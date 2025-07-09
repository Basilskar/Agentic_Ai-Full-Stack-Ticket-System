const express = require('express');
const { createTicket, getTickets, getTicketById } = require('../controllers/ticketController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, createTicket);
router.get('/', authenticateToken, getTickets);
router.get('/:id', authenticateToken, getTicketById);

module.exports = router;