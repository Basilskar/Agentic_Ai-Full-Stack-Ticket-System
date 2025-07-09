// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  // Handle cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate field value' });
  }
  
  // Default error response
  res.status(500).json({ error: 'Internal server error' });
};

// Export error handler
module.exports = errorHandler;