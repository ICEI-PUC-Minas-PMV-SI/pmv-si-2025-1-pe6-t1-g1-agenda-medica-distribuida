const express = require('express');
const router = express.Router();
const doctorRoutes = require('../routers/doctorRouter');
const userRoutes = require('./userRoutes');
const authRoutes = require('../routers/authRouter');
const appointmentRoutes = require('../routers/appointmentRouter');

router.use('/doctors', doctorRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/appointment', appointmentRoutes);

module.exports = router; 