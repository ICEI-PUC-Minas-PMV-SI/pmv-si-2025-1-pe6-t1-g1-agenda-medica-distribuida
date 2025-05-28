const joi = require("joi");

exports.signupSchema = joi.object({
  name: joi.string().required(),
  email: joi
    .string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: {allow: ["com", "net"]},
    }),
  password: joi
    .string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
  gender: joi.string().valid("Male", "Female"),
  birthdate: joi.date(),
  userImage: joi.string().base64(),
});

exports.signinSchema = joi.object({
  email: joi
    .string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: {allow: ["com", "net"]},
    }),
  password: joi
    .string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

exports.acceptCodeSchema = joi.object({
  email: joi
    .string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: {allow: ["com", "net"]},
    }),
  providedCode: joi.number(),
});

exports.changePasswordSchema = joi.object({
  newPassword: joi
    .string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
  oldPassword: joi
    .string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

exports.acceptForgotPasswordCodeSchema = joi.object({
  email: joi
    .string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: {allow: ["com", "net"]},
    }),
  providedCode: joi.number(),
  newPassword: joi
    .string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

exports.newDoctorSchema = joi.object({
  name: joi.string().required(),
  specialty: joi.string().required(),
  crm: joi.string().required(),
  profileImage: joi.string().uri(),
  experience: joi.string().required(),
  rating: joi.number().min(0).max(5),
  about: joi.string().required(),
  education: joi.array().items(
    joi.object({
      degree: joi.string().required(),
      institution: joi.string().required(),
      year: joi.string().required(),
    })
  ),
  availability: joi.array().items(
    joi.object({
      day: joi.string().required(),
      startTime: joi.string().required(),
      endTime: joi.string().required(),
    })
  ),
  location: joi.string().required(),
});

exports.updateDoctorSchema = joi.object({
  name: joi.string(),
  specialty: joi.string(),
  profileImage: joi.string().uri(),
  experience: joi.string(),
  rating: joi.number().min(0).max(5),
  about: joi.string(),
  education: joi.array().items(
    joi.object({
      degree: joi.string().required(),
      institution: joi.string().required(),
      year: joi.string().required(),
    })
  ),
  availability: joi.array().items(
    joi.object({
      day: joi.string().required(),
      startTime: joi.string().required(),
      endTime: joi.string().required(),
    })
  ),
  location: joi.string(),
});

exports.newAppointmentSchema = joi.object({
  userId: joi.string().required(),
  docId: joi.string().required(),
  slotDate: joi.string().required(),
  slotTime: joi.string().required(),
});

exports.cancelAppointment = joi.object({
  userId: joi.string().required(),
  appointmentId: joi.string().required(),
});
