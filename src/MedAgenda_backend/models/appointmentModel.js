const mongoose = require("mongoose");
const {Schema} = mongoose;

const appointmentSchema = mongoose.Schema({
  user: [{type: Schema.Types.ObjectId, ref: "User"}],
  doctor: [{type: Schema.Types.ObjectId, ref: "Doctor"}],
  slotDate: {type: String, required: true},
  slotTime: {type: String, required: true},
  date: {type: Number, required: true},
  amount: {type: Number, required: true},
  cancelled: {type: Boolean, default: false},
  isCompleted: {type: Boolean, default: false},
});

module.exports = mongoose.model("appointment", appointmentSchema);
