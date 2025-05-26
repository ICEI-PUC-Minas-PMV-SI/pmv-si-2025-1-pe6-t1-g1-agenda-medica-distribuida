const express = require('express');
const router = express.Router();
const doctorRoutes = require('./doctorRoutes');
const userRoutes = require('./userRoutes');
const appointmentRoutes = require('./appointmentRoutes');

router.use('/doctors', doctorRoutes);
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router; 