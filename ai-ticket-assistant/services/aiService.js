// Import dependencies
const User = require('../models/User');

// AI processing service
const processTicketWithAI = async (ticket) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Try Pro model first, fallback to Flash if error
    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro-002' });
      // Test quota/model with a lightweight call if needed
    } catch (proErr) {
      console.warn('Pro model unavailable or quota exceeded, switching to Flash:', proErr.message);
      model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    }

    const prompt = `
    Analyze this support ticket and provide a JSON response with the following structure:
    {
      "ticketType": "string (e.g., Technical, Billing, General, Account)",
      "priority": "string (Low, Medium, High, Critical)",
      "requiredSkills": ["array of required skills"],
      "aiNotes": "string with helpful notes and suggestions"
    }
    
    Ticket Title: ${ticket.title}
    Ticket Description: ${ticket.description}
    
    Provide only the JSON response without any additional text.
    `;

    let result, response, text;
    try {
      result = await model.generateContent(prompt);
      response = await result.response;
      text = response.text();
    } catch (err) {
      // If quota or model error, try Flash as fallback
      if (
        err.message &&
        (err.message.includes('429') ||
         err.message.includes('quota') ||
         err.message.includes('404') ||
         err.message.includes('not found'))
      ) {
        console.warn('Falling back to Flash model due to error:', err.message);
        model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
        result = await model.generateContent(prompt);
        response = await result.response;
        text = response.text();
      } else {
        throw err;
      }
    }

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseErr) {
        console.error('Error parsing AI JSON:', parseErr);
      }
    }

    // Fallback response
    return {
      ticketType: 'General',
      priority: 'Medium',
      requiredSkills: ['General Support'],
      aiNotes: 'Ticket requires manual review.'
    };
  } catch (error) {
    console.error('AI Processing Error:', error);
    return {
      ticketType: 'General',
      priority: 'Medium',
      requiredSkills: ['General Support'],
      aiNotes: 'AI processing failed. Manual review required.'
    };
  }
};

// Find best moderator based on skills
const findBestModerator = async (requiredSkills) => {
  try {
    const moderators = await User.find({ role: 'Moderator' });

    if (!moderators || moderators.length === 0) {
      // Fallback to admin if no moderators available
      const admin = await User.findOne({ role: 'Admin' });
      if (!admin) {
        console.error('No moderators or admin found!');
        return null;
      }
      return admin;
    }

    let bestModerator = moderators[0];
    let bestScore = 0;

    // Calculate skill match score for each moderator
    for (const moderator of moderators) {
      let score = 0;
      if (Array.isArray(moderator.skills)) {
        for (const skill of requiredSkills) {
          for (const moderatorSkill of moderator.skills) {
            if (
              moderatorSkill.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(moderatorSkill.toLowerCase())
            ) {
              score++;
            }
          }
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestModerator = moderator;
      }
    }

    return bestModerator;
  } catch (error) {
    console.error('Error finding moderator:', error);
    // Try to fallback to admin
    try {
      const admin = await User.findOne({ role: 'Admin' });
      return admin || null;
    } catch (adminErr) {
      console.error('No admin found:', adminErr);
      return null;
    }
  }
};

// Export AI service functions
module.exports = { 
  processTicketWithAI, 
  findBestModerator 
};
