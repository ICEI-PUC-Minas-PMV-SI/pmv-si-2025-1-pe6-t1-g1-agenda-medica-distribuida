const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required!"],
      trim: true,
      unique: [true, "Email must be unique!"],
      minLength: [5, "Email must have 5 characters!"],
      lowerCase: true,
    },
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    birthdate: {type: Date},
    userImage: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password must be provided!"],
      trim: true,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeValidation: {
      type: String,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeValidation: {
      type: String,
      select: false,
    },
    isAdmin: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);