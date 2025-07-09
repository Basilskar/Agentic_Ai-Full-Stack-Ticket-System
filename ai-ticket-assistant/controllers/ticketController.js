const Ticket = require('../models/Ticket');
const { inngest } = require('../utils/inngest');

// Create new ticket
const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Create ticket
    const ticket = new Ticket({
      title,
      description,
      userId: req.user.userId
    });

    await ticket.save();

    // Trigger Inngest event for AI processing
    await inngest.send({
      name: 'ticket/created',
      data: { ticketId: ticket._id.toString() }
    });

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tickets based on user role
const getTickets = async (req, res) => {
  try {
    let query = {};

    // Filter tickets based on user role
    if (req.user.role === 'User') {
      query = { userId: req.user.userId };
    } else if (req.user.role === 'Moderator') {
      query = { assignedTo: req.user.userId };
    }
    // Admin can see all tickets (no filter)

    const tickets = await Ticket.find(query)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check permissions
    if (req.user.role === 'User' && ticket.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (
      req.user.role === 'Moderator' &&
      ticket.assignedTo &&
      ticket.assignedTo._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update ticket status (for moderators/admins)
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check permissions
    if (
      req.user.role === 'Moderator' &&
      ticket.assignedTo &&
      ticket.assignedTo.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update ticket status
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status, updatedAt: new Date() },
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email');

    res.json({
      message: 'Ticket status updated successfully',
      ticket: updatedTicket
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    let query = {};

    // Filter based on user role
    if (req.user.role === 'User') {
      query = { userId: req.user.userId };
    } else if (req.user.role === 'Moderator') {
      query = { assignedTo: req.user.userId };
    }

    const stats = await Ticket.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTickets = await Ticket.countDocuments(query);

    res.json({
      totalTickets,
      statusBreakdown: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export ticket controller functions
module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  getDashboardStats
};
