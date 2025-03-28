const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    schedulesApppointments: { type: Object, default: {} },
    date: { type: Number, required: true },
}, { minimize: false })

module.exports = mongoose.model("doctor", doctorSchema);