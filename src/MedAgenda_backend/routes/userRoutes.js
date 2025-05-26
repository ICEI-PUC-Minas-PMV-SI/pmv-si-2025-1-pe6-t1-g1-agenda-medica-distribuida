const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');

// Placeholder for user routes
router.post('/signin', (req, res) => {
  res.status(200).json({
    success: true,
    token: 'dummy_token',
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      isAdmin: true
    }
  });
});

router.post('/signup', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'User created successfully'
  });
});

router.put('/profile', isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully'
  });
});

module.exports = router; 