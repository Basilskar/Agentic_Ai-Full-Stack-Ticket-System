import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI Ticket Triage Assistant",
    system: `You are an expert AI assistant that processes support tickets.

Respond ONLY with valid raw JSON. Do NOT include markdown, comments, or formatting.

Output format (strict JSON):
{
  "summary": "Short summary of the ticket",
  "priority": "low" | "medium" | "high",
  "helpfulNotes": "Detailed moderator notes and links",
  "relatedSkills": ["React", "Node.js"]
}

NO markdown or text outside this JSON.`
  });

  const prompt = `
Analyze this support ticket:

- Title: ${ticket.title}
- Description: ${ticket.description}

Respond ONLY with this JSON format:
{
  "summary": "Short summary",
  "priority": "low" | "medium" | "high",
  "helpfulNotes": "Detailed explanation",
  "relatedSkills": ["React", "Node.js"]
}`;

  const response = await supportAgent.run(prompt);

  const rawOutput =
    response?.output?.[0]?.text?.trim() ||
    response?.output?.[0]?.content?.trim() ||
    response?.output?.[0]?.context?.trim();

  console.log("🔍 Raw AI output before cleanup:\n", rawOutput);

  if (!rawOutput || rawOutput.length < 10) {
    console.error("❌ Empty or invalid AI response");
    return {
      summary: "",
      priority: "medium",
      helpfulNotes: "",
      relatedSkills: [],
    };
  }

  // 🧼 Remove code block formatting if present
  const cleaned = rawOutput
    .replace(/^```json\s*/, '')  // remove starting ```json
    .replace(/^```\s*/, '')      // fallback
    .replace(/```$/, '')         // remove ending ```
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    console.log("✅ Parsed AI response:", parsed);
    return parsed;
  } catch (e) {
    console.error("❌ Failed to parse JSON from cleaned AI response:", e.message);
    console.error("📦 Cleaned AI response was:", cleaned);
    return {
      summary: "",
      priority: "medium",
      helpfulNotes: "",
      relatedSkills: [],
    };
  }
};

export default analyzeTicket;
