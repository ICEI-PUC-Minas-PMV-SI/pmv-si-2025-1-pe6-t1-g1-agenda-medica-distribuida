const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  crm: {
    type: String,
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  experience: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
  },
  about: {
    type: String,
    required: true,
  },
  education: [{
    degree: String,
    institution: String,
    year: String,
  }],
  availability: [{
    day: String,
    startTime: String,
    endTime: String,
  }],
  location: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Doctor', doctorSchema);
