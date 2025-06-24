import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }
    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id.toString(),
    });

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });
    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];
    
    if (user.role !== "user") {
      // Admin users - get all tickets with AI analysis
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .select("title description status createdAt aiAnalysis summary priority helpfulNotes relatedSkills processed")
        .sort({ createdAt: -1 })
        .lean(); // Use lean() to get plain objects instead of Mongoose docs
    } else {
      // Regular users - get their tickets with AI analysis
      tickets = await Ticket.find({ createdBy: user._id })
        .select("title description status createdAt aiAnalysis summary priority helpfulNotes relatedSkills processed")
        .sort({ createdAt: -1 })
        .lean(); // Use lean() to get plain objects
    }
    
    // Additional sanitization to ensure no circular references
    const sanitizedTickets = tickets.map(ticket => ({
      _id: ticket._id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
      processed: ticket.processed,
      
      // Check both AI analysis structures
      summary: ticket.summary || (ticket.aiAnalysis?.summary),
      priority: ticket.priority || (ticket.aiAnalysis?.priority),
      helpfulNotes: ticket.helpfulNotes || (ticket.aiAnalysis?.helpfulNotes),
      relatedSkills: ticket.relatedSkills || (ticket.aiAnalysis?.relatedSkills),
      
      // Legacy aiAnalysis field for compatibility
      aiAnalysis: ticket.aiAnalysis ? {
        summary: ticket.aiAnalysis.summary,
        priority: ticket.aiAnalysis.priority,
        helpfulNotes: ticket.aiAnalysis.helpfulNotes,
        relatedSkills: ticket.aiAnalysis.relatedSkills
      } : (ticket.summary ? {
        summary: ticket.summary,
        priority: ticket.priority,
        helpfulNotes: ticket.helpfulNotes,
        relatedSkills: ticket.relatedSkills
      } : null),
      
      assignedTo: ticket.assignedTo ? {
        _id: ticket.assignedTo._id,
        email: ticket.assignedTo.email
      } : null
    }));
    
    return res.status(200).json(sanitizedTickets);
  } catch (error) {
    console.error("Error fetching tickets", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id)
        .populate("assignedTo", ["email", "_id", "name"])
        .populate("createdBy", ["email", "_id", "name"])
        .lean(); // Use lean() for plain objects
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id,
      })
      .populate("createdBy", ["email", "_id", "name"])
      .lean(); // Use lean() for plain objects
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    console.log("Raw ticket from DB:", ticket); // Debug log
    
    // Sanitize single ticket - return ticket directly, not wrapped
    const sanitizedTicket = {
      _id: ticket._id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      processed: ticket.processed,
      
      // AI Analysis fields - check both structures
      summary: ticket.summary || (ticket.aiAnalysis?.summary),
      priority: ticket.priority || (ticket.aiAnalysis?.priority),
      helpfulNotes: ticket.helpfulNotes || (ticket.aiAnalysis?.helpfulNotes),
      relatedSkills: ticket.relatedSkills || (ticket.aiAnalysis?.relatedSkills),
      
      // Legacy aiAnalysis field for compatibility
      aiAnalysis: ticket.aiAnalysis || (ticket.summary ? {
        summary: ticket.summary,
        priority: ticket.priority,
        helpfulNotes: ticket.helpfulNotes,
        relatedSkills: ticket.relatedSkills
      } : null),
      
      assignedTo: ticket.assignedTo ? {
        _id: ticket.assignedTo._id,
        email: ticket.assignedTo.email,
        name: ticket.assignedTo.name
      } : null,
      
      createdBy: ticket.createdBy ? {
        _id: ticket.createdBy._id,
        email: ticket.createdBy.email,
        name: ticket.createdBy.name
      } : null
    };
    
    console.log("Sanitized ticket being returned:", sanitizedTicket); // Debug log
    
    // Return ticket directly, not wrapped in another object
    return res.status(200).json(sanitizedTicket);
  } catch (error) {
    console.error("Error fetching ticket", error.message);
    console.error("Full error:", error); // More detailed error logging
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};