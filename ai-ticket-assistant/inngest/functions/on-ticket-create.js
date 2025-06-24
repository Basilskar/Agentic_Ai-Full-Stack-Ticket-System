import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;
      console.log("🚀 Ticket creation event received:", ticketId);

      // Step 1: Fetch ticket from DB
      const ticket = await step.run("fetch-ticket", async () => {
        const t = await Ticket.findById(ticketId);
        if (!t) {
          throw new NonRetriableError("❌ Ticket not found");
        }
        console.log("🎟️ Ticket fetched from DB:", t.title);
        return t;
      });

      // Check if ticket is already processed, skip if yes
      if (ticket.processed) {
        console.log(`✅ Ticket ${ticketId} already processed, skipping further steps.`);
        return { success: true };
      }

      // Step 2: Update status to TODO if not already set
      await step.run("update-ticket-status", async () => {
        if (ticket.status !== "TODO") {
          await Ticket.findByIdAndUpdate(ticket._id, { status: "TODO" });
          console.log("✅ Ticket status updated to TODO");
        } else {
          console.log("ℹ️ Ticket status already TODO");
        }
      });

      // Step 3: Run AI analysis on the ticket
      const aiResponse = await analyzeTicket(ticket);
      console.log("🧠 AI Analysis Response:", aiResponse);

      // Step 4: Update ticket with AI analysis results (without aiSummary)
      const relatedSkills = await step.run("ai-processing", async () => {
        if (aiResponse) {
          const priority = ["low", "medium", "high"].includes(aiResponse.priority)
            ? aiResponse.priority
            : "medium";

          await Ticket.findByIdAndUpdate(ticket._id, {
            priority,
            helpfulNotes: aiResponse.helpfulNotes,
            relatedSkills: aiResponse.relatedSkills,
            status: "IN_PROGRESS",
          });

          console.log("📌 AI skills updated:", aiResponse.relatedSkills);
          return aiResponse.relatedSkills || [];
        }
        return [];
      });

      // Step 5: Assign a moderator or fallback admin
      const moderator = await step.run("assign-moderator", async () => {
        let user = null;
        if (relatedSkills.length > 0) {
          user = await User.findOne({
            role: "moderator",
            skills: {
              $elemMatch: {
                $regex: relatedSkills.join("|"),
                $options: "i",
              },
            },
          });
        }

        if (!user) {
          console.warn("⚠️ No matching moderator found, falling back to admin");
          user = await User.findOne({ role: "admin" });
        }

        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });

        console.log("👨‍💻 Ticket assigned to:", user?.email || "None");
        return user;
      });

      // Step 6: Send email notification to assigned user
      await step.run("send-email-notification", async () => {
        if (moderator) {
          const finalTicket = await Ticket.findById(ticket._id);
          await sendMail(
            moderator.email,
            "Ticket Assigned",
            `A new ticket has been assigned to you:\n\nTitle: ${finalTicket.title}\n\nPlease review it.`
          );
          console.log("📧 Email sent to moderator:", moderator.email);
        }
      });

      // Step 7: Mark ticket as processed to avoid duplicate processing
      await step.run("mark-processed", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, { processed: true });
        console.log(`✅ Ticket ${ticketId} marked as processed`);
      });

      console.log("✅ Ticket flow completed successfully");
      return { success: true };
    } catch (err) {
      console.error("❌ Error in on-ticket-created function:", err);
      return { success: false, error: err.message };
    }
  }
);