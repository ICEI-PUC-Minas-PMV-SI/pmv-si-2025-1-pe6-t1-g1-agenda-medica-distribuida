const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {type: String, required: [true, "Informe seu Nome!"], trim: true,},
    email: {type: String, required: [true, "Informe seu Email"], trim: true, unique: [true, "Email must be unique!"], minLength: [5, "Email must have 5 characters!"], lowerCase: true,},
    password: {type: String, required: [true, "Digite sua Senha!"], trim: true, select: false,},
    verified: {type: Boolean,default: false,},
    verificationCode: {type: String, select: false,},
    verificationCodeValidation: {type: String, select: false,},
    forgotPasswordCode: {type: String,select: false,},
    forgotPasswordCodeValidation: {type: String, select: false,},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
