const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId, role, skills } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role, skills },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, updateUser };