const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');

// Placeholder for appointment routes
router.post('/', isAuthenticated, (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Appointment created successfully'
  });
});

router.get('/', isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    appointments: []
  });
});

router.delete('/:id', isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Appointment cancelled successfully'
  });
});

module.exports = router; 