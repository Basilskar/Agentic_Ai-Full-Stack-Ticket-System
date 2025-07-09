// Import all middleware
const { authenticateToken, requireRole } = require('./auth');
const errorHandler = require('./errorHandler');
const { validateTicketInput, validateUserInput } = require('./validation');

// Export all middleware
module.exports = {
  authenticateToken,
  requireRole,
  errorHandler,
  validateTicketInput,
  validateUserInput
};