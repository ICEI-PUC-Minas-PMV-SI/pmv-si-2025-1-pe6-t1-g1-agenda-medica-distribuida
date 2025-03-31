const express = require("express");
const apppointmentsController = require("../controllers/appointmentController");
const {identifier} = require("../middlewares/identification");
const router = express.Router();

router.get("/", identifier, apppointmentsController.viewAppointments);
router.post("/", identifier, apppointmentsController.newAppointment);
router.post("/cancel", identifier, apppointmentsController.cancelAppointment);

module.exports = router;
