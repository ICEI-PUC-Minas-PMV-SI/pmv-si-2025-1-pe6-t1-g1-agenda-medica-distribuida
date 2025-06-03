const {
  newDoctorSchema,
  updateDoctorSchema,
} = require("../middlewares/validator");
const Doctor = require("../models/doctorModel");
exports.newDoctor = async (req, res) => {
  const {name, speciality, crm, pricePerAppointment, doctorImage, about} =
    req.body;
  const {isAdmin} = req.user;
  if (!isAdmin) {
    return res.status(401).json({success: false, message: "Unauthorized"});
  }
  try {
    const {error, value} = newDoctorSchema.validate({
      name,
      speciality,
      crm,
      pricePerAppointment,
      doctorImage,
      about,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const existingDoctor = await Doctor.findOne({crm});
    if (existingDoctor) {
      return res
        .status(401)
        .json({success: false, message: "Doctor already exists!"});
    }

    const newDoctor = new Doctor({
      name,
      speciality,
      crm,
      pricePerAppointment,
      doctorImage,
      about,
    });

    const result = await newDoctor.save();
    res.status(201).json({
      success: true,
      message: "The doctor has been created successfully",
      result,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateDoctor = async (req, res) => {
  const {speciality, pricePerAppointment, doctorImage, about} = req.body;
  const {crm} = req.params;
  const {isAdmin} = req.user;
  if (!isAdmin) {
    return res.status(401).json({success: false, message: "Unauthorized"});
  }

  const {error, value} = updateDoctorSchema.validate({
    speciality,
    pricePerAppointment,
    doctorImage,
    about,
  });
  if (error) {
    return res.status(401).json({
      success: false,
      message: error.details[0].message,
    });
  }
  const existingDoctor = await Doctor.findOne({crm});

  const fieldsToUpdate = {
    speciality,
    pricePerAppointment,
    doctorImage,
    about,
  };

  const updateDoctor = Object.assign(existingDoctor, fieldsToUpdate);

  updateDoctor.save();
  return res.status(200).json({
    success: true,
    message: "Doctor has been updated successfully!",
  });
};

exports.deleteDoctor = async (req, res) => {
  const {crm} = req.params;
  const {isAdmin} = req.user;

  if (!isAdmin) {
    return res.status(401).json({success: false, message: "Unauthorized"});
  }

  try {
    const doctorToDelete = await Doctor.deleteOne({crm});
    if (doctorToDelete.deletedCount < 1) {
      return res
        .status(403)
        .json({success: false, message: "Unable to delete doctor!"});
    }
    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully!",
      doctorToDelete,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.viewDoctors = async (req, res) => {
  let query = {};
  for (const [key, value] of Object.entries(req.query)) {
    query[key] = value;
  }

  const doctors = await Doctor.find(query);
  return res.status(200).json({
    success: true,
    doctors,
  });
};
