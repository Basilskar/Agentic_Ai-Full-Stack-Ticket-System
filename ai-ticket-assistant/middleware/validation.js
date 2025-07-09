// Input validation middleware
const validateTicketInput = (req, res, next) => {
  const { title, description } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  if (!description || description.trim().length === 0) {
    return res.status(400).json({ error: 'Description is required' });
  }
  
  if (title.length > 200) {
    return res.status(400).json({ error: 'Title must be less than 200 characters' });
  }
  
  next();
};

const validateUserInput = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  next();
};

// Export validation functions
module.exports = {
  validateTicketInput,
  validateUserInput
};