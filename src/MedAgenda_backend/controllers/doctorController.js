const {
  newDoctorSchema,
  updateDoctorSchema,
} = require("../middlewares/validator");
const Doctor = require("../models/doctorModel");
const { doctors, specialties } = require("../data/doctors");

// Initialize doctors if none exist
const initializeDoctors = async () => {
  try {
    const count = await Doctor.countDocuments();
    if (count === 0) {
      await Doctor.insertMany(doctors);
      console.log('Doctors initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing doctors:', error);
  }
};

// Call initialization
initializeDoctors();

exports.getSpecialties = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      specialties,
    });
  } catch (error) {
    console.error('Error getting specialties:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting specialties',
    });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const { specialty } = req.query;
    const query = specialty ? { specialty } : {};
    const doctors = await Doctor.find(query);
    return res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error('Error getting doctors:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting doctors',
    });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }
    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error('Error getting doctor:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting doctor',
    });
  }
};

exports.newDoctor = async (req, res) => {
  const { name, specialty, crm, profileImage, experience, about, education, availability, location } = req.body;
  const { isAdmin } = req.user;
  
  if (!isAdmin) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const existingDoctor = await Doctor.findOne({ crm });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor already exists!",
      });
    }

    const newDoctor = new Doctor({
      name,
      specialty,
      crm,
      profileImage,
      experience,
      about,
      education,
      availability,
      location,
    });

    const result = await newDoctor.save();
    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor: result,
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating doctor',
    });
  }
};

exports.updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.user;
  
  if (!isAdmin) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const doctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating doctor',
    });
  }
};

exports.deleteDoctor = async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.user;

  if (!isAdmin) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting doctor',
    });
  }
};
