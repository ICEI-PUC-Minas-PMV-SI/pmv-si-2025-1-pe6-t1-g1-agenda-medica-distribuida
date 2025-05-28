const express = require('express');
const router = express.Router();
const {
  newDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctors,
  getDoctorById,
  getSpecialties,
} = require('../controllers/doctorController');
const { isAuthenticated } = require('../middlewares/auth');

// Public routes
router.get('/specialties', getSpecialties);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

// Protected routes (admin only)
router.post('/', isAuthenticated, newDoctor);
router.put('/:id', isAuthenticated, updateDoctor);
router.delete('/:id', isAuthenticated, deleteDoctor);

module.exports = router; 