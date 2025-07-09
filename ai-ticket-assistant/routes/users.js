const express = require('express');
const { getUsers, updateUser } = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, requireRole(['Admin']), getUsers);
router.post('/update', authenticateToken, requireRole(['Admin']), updateUser);

module.exports = router;