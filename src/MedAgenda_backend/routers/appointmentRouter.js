const express = require("express");
const apppointmentsController = require("../controllers/appointmentController");
const appointmentsAuth = require("../middlewares/appointmentAuth");
const router = express.Router();

// User
router.get("/user-list-appointment", appointmentsAuth.userAuth, apppointmentsController.userListAppointment);
router.post("/user-book-appointment", appointmentsAuth.userAuth, apppointmentsController.userBookAppointment);
router.post("/user-cancel-appointment", appointmentsAuth.userAuth, apppointmentsController.userCancelAppointment);

// Doctor
router.get("/doctor-list-appointment", appointmentsAuth.doctorAuth, apppointmentsController.doctorListAppointment);
router.post("/doctor-cancel-appointment", appointmentsAuth.doctorAuth, apppointmentsController.doctorCancelAppointment);
router.post("/doctor-complete-appointment", appointmentsAuth.doctorAuth, apppointmentsController.doctorCompleteAppointment);

// Admin
router.get("/admin-list-appointment", appointmentsAuth.adminAuth, apppointmentsController.adminListAppointment);
router.post("/admin-cancel-appointment", appointmentsAuth.adminAuth, apppointmentsController.adminCancelAppointment);


module.exports = router;