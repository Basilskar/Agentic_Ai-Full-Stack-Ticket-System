import mongoose from "mongoose";
// In your models/ticket.js
const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Individual AI analysis fields (what your Inngest is saving)
  summary: { type: String },
  priority: { type: String },
  helpfulNotes: { type: String },
  relatedSkills: [{ type: String }],
  processed: { type: Boolean, default: false },
  
  // Legacy aiAnalysis object field (if you had this before)
  aiAnalysis: {
    summary: { type: String },
    priority: { type: String },
    helpfulNotes: { type: String },
    relatedSkills: [{ type: String }]
  }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
