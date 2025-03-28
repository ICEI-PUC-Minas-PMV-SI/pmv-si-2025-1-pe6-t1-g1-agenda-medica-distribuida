const jwt = require("jsonwebtoken");
const {signupSchema, signinSchema, acceptCodeSchema, changePasswordSchema, acceptForgotPasswordCodeSchema,} = require("../middlewares/validator");
const {doHash, doHashValidation, hmacProcess} = require("../utils/hashing");
const User = require("../models/usersModel");
const Appointment = require("../models/appointmentsModel");
const transport = require("../middlewares/sendMail");


// API to book appointment 
exports.bookAppointment = async (req, res) => {

  try {

      const { userId, docId, slotDate, slotTime } = req.body
      const docData = await doctorModel.findById(docId).select("-password")

      if (!docData.available) {
          return res.json({ success: false, message: 'Doctor Not Available' })
      }

      let slots_booked = docData.slots_booked

      // checking for slot availablity 
      if (slots_booked[slotDate]) {
          if (slots_booked[slotDate].includes(slotTime)) {
              return res.json({ success: false, message: 'Slot Not Available' })
          }
          else {
              slots_booked[slotDate].push(slotTime)
          }
      } else {
          slots_booked[slotDate] = []
          slots_booked[slotDate].push(slotTime)
      }

      const userData = await userModel.findById(userId).select("-password")

      delete docData.slots_booked

      const appointmentData = {
          userId,
          docId,
          userData,
          docData,
          amount: docData.fees,
          slotTime,
          slotDate,
          date: Date.now()
      }

      const newAppointment = new appointmentModel(appointmentData)
      await newAppointment.save()

      // save new slots data in docData
      await doctorModel.findByIdAndUpdate(docId, { slots_booked })

      res.json({ success: true, message: 'Appointment Booked' })

  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }

}

// API to cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {

      const { userId, appointmentId } = req.body
      const appointmentData = await appointmentModel.findById(appointmentId)

      // verify appointment user 
      if (appointmentData.userId !== userId) {
          return res.json({ success: false, message: 'Unauthorized action' })
      }

      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

      // releasing doctor slot 
      const { docId, slotDate, slotTime } = appointmentData

      const doctorData = await doctorModel.findById(docId)

      let slots_booked = doctorData.slots_booked

      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

      await doctorModel.findByIdAndUpdate(docId, { slots_booked })

      res.json({ success: true, message: 'Appointment Cancelled' })

  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }
}

// API to get user appointments for frontend my-appointments page
exports.listAppointment = async (req, res) => {
  try {

      const { userId } = req.body
      const appointments = await appointmentModel.find({ userId })

      res.json({ success: true, appointments })

  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }
}
