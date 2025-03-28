const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    price: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("appointment", appointmentSchema);