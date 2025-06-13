const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  speciality: {
    type: String,
    required: [true, "Speciality is required!"],
  },
  crm: {
    type: String,
    required: [true, "CRM is required!"],
  },
  scheduledAppointments: {type: Object, default: {}},
  pricePerAppointment: {
    type: Number,
    required: [true, "Price per Appointment is required!"],
  },
  doctorImage: {
    type: String,
  },
  about: {type: String},
});

module.exports = mongoose.model("Doctor", doctorSchema);