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
  speciality: joi.string().required(),
  crm: joi.string().required(),
  pricePerAppointment: joi.number().required(),
  doctorImage: joi.string().base64(),
  about: joi.string(),
});

exports.updateDoctorSchema = joi.object({
  speciality: joi.string().required(),
  pricePerAppointment: joi.number().required(),
  doctorImage: joi.string().base64(),
  about: joi.string(),
});
