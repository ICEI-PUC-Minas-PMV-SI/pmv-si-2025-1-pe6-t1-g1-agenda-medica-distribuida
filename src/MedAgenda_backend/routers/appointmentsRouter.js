const express = require("express");
const apppointmentsController = require("../controllers/appointmentsController");
const {identifier} = require("../middlewares/identification");
const router = express.Router();


apppointmentRouter.post("/book-appointment", apppointmenthUser, bookAppointment)
apppointmentRouter.get("/appointments", apppointmentUser, listAppointment)
apppointmentRouter.post("/cancel-appointment", apppointmentUser, cancelAppointment)


//doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
//doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)

//adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
//adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)