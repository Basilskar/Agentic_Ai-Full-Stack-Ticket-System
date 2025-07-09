// Import dependencies
const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS
    }
  });
};

// Send ticket assignment notification
const sendEmailNotification = async (ticket, moderator) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: 'support@ticketmanagement.com',
      to: moderator.email,
      subject: `New Ticket Assigned: ${ticket.title}`,
      html: `
        <h2>New Ticket Assignment</h2>
        <p><strong>Ticket ID:</strong> ${ticket._id}</p>
        <p><strong>Title:</strong> ${ticket.title}</p>
        <p><strong>Priority:</strong> ${ticket.priority}</p>
        <p><strong>Type:</strong> ${ticket.ticketType}</p>
        <p><strong>Description:</strong> ${ticket.description}</p>
        <p><strong>Required Skills:</strong> ${ticket.requiredSkills.join(', ')}</p>
        <p><strong>AI Notes:</strong> ${ticket.aiNotes}</p>
        <p><strong>View Ticket:</strong> <a href="${process.env.APP_URL}/tickets/${ticket._id}">Click here</a></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', moderator.email);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

// Send ticket status update notification
const sendStatusUpdateNotification = async (ticket, user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: 'support@ticketmanagement.com',
      to: user.email,
      subject: `Ticket Status Updated: ${ticket.title}`,
      html: `
        <h2>Ticket Status Update</h2>
        <p><strong>Ticket ID:</strong> ${ticket._id}</p>
        <p><strong>Title:</strong> ${ticket.title}</p>
        <p><strong>New Status:</strong> ${ticket.status}</p>
        <p><strong>Priority:</strong> ${ticket.priority}</p>
        <p><strong>View Ticket:</strong> <a href="${process.env.APP_URL}/tickets/${ticket._id}">Click here</a></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Status update email sent to:', user.email);
  } catch (error) {
    console.error('Status update email error:', error);
  }
};

// Export email service functions
module.exports = { 
  sendEmailNotification, 
  sendStatusUpdateNotification 
};