const Joi = require("joi");
const joi = require("joi");

exports.signupSchema = joi.object({
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

exports.acceptCodeSchema = Joi.object({
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

exports.changePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
  oldPassword: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

exports.acceptForgotPasswordCodeSchema = Joi.object({
  email: joi
    .string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: {allow: ["com", "net"]},
    }),
  providedCode: joi.number(),
  newPassword: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});
