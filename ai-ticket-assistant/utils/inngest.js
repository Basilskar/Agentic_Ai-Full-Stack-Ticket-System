const { Inngest } = require('inngest');
const { serve } = require('inngest/express');
const Ticket = require('../models/Ticket');
const { processTicketWithAI, findBestModerator } = require('../services/aiService');
const { sendEmailNotification } = require('../services/emailService');

const inngest = new Inngest({ 
  id: 'ticket-management-app',
  name: 'Ticket Management System'
});

const processTicket = inngest.createFunction(
  { id: 'process-ticket' },
  { event: 'ticket/created' },
  async ({ event, step }) => {
    const ticketId = event.data.ticketId;
    
    const ticket = await step.run('get-ticket', async () => {
      return await Ticket.findById(ticketId).populate('userId');
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const aiResult = await step.run('ai-processing', async () => {
      return await processTicketWithAI(ticket);
    });

    const updatedTicket = await step.run('update-ticket', async () => {
      return await Ticket.findByIdAndUpdate(
        ticketId,
        {
          ticketType: aiResult.ticketType,
          priority: aiResult.priority,
          requiredSkills: aiResult.requiredSkills,
          aiNotes: aiResult.aiNotes,
          updatedAt: new Date()
        },
        { new: true }
      );
    });

    const moderator = await step.run('assign-moderator', async () => {
      const bestModerator = await findBestModerator(aiResult.requiredSkills);
      if (!bestModerator) {
        // Optionally, you can set assignedTo to null or leave ticket unassigned
        await Ticket.findByIdAndUpdate(ticketId, {
          assignedTo: null,
          status: 'Open'
        });
        return null;
      }
      await Ticket.findByIdAndUpdate(ticketId, {
        assignedTo: bestModerator._id,
        status: 'In Progress'
      });
      return bestModerator;
    });

    await step.run('send-notification', async () => {
      if (moderator) {
        await sendEmailNotification(updatedTicket, moderator);
      }
      // Optionally, send a fallback notification to admin or log the issue
    });

    return { 
      success: true, 
      ticketId, 
      assignedTo: moderator ? moderator.email : null,
      message: moderator ? "Ticket assigned to moderator." : "No moderator found, ticket left unassigned."
    };
  }
);

module.exports = { inngest, processTicket, serve };
