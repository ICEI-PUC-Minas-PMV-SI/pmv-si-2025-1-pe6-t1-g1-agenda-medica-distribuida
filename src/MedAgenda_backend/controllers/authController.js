const jwt = require("jsonwebtoken");
const {
  signupSchema,
  signinSchema,
  acceptCodeSchema,
  changePasswordSchema,
  acceptForgotPasswordCodeSchema,
} = require("../middlewares/validator");
const {doHash, doHashValidation, hmacProcess} = require("../utils/hashing");
const User = require("../models/usersModel");
const transport = require("../middlewares/sendMail");
exports.signup = async (req, res) => {
  const {name, email, password, gender, birthdate, userImage} = req.body;
  try {
    const {error, value} = signupSchema.validate({
      name,
      email,
      password,
      gender,
      birthdate,
      userImage,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const existingUser = await User.findOne({email});

    if (existingUser) {
      return res
        .status(401)
        .json({success: false, message: "User already exists!"});
    }

    const hashedPassword = await doHash(password, 12);
    
    // Preparar dados do usuário
    const userData = {
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    };

    // Adicionar campos opcionais apenas se fornecidos
    if (gender) userData.gender = gender;
    if (birthdate) userData.birthdate = new Date(birthdate);
    if (userImage) userData.userImage = userImage;

    const newUser = new User(userData);

    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({
      success: true,
      message: "Your account has been created successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.signin = async (req, res) => {
  const {email, password} = req.body;

  try {
    const {error, value} = signinSchema.validate({email, password});
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const existingUser = await User.findOne({email}).select("+password");
    if (!existingUser) {
      return res
        .status(401)
        .json({success: false, message: "User does not exists!"});
    }

    const result = await doHashValidation(password, existingUser.password);
    if (!result) {
      return res
        .status(401)
        .json({success: false, message: "Invalid credentials!"});
    }
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
        isAdmin: existingUser.isAdmin,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        token,
        message: "logged in successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.signout = async (req, res) => {
  res
    .clearCookie("Authorization")
    .status(200)
    .json({success: true, message: "Logged out successfully!"});
};

exports.sendVerificationCode = async (req, res) => {
  const tokenEmail = req.user.email;
  const {email} = req.body;
  try {
    if (tokenEmail !== email) {
      return res.status(401).json({success: false, message: "Unauthorized"});
    }
    const existingUser = await User.findOne({email});
    if (!existingUser) {
      return res
        .status(401)
        .json({success: false, message: "Users does not exists!"});
    }
    if (existingUser.verified) {
      return res
        .status(401)
        .json({success: false, message: "You are already verified!"});
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();
    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Verification code",
      html: "<h1>" + codeValue + "</h1>",
    });

    if (info.accepted[0] === existingUser.email) {
      const hashedCodedValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingUser.verificationCode = hashedCodedValue;
      existingUser.verificationCodeValidation = Date.now();
      await existingUser.save();
      return res.status(200).json({success: true, message: "Code sent!"});
    }
    res.status(400).json({success: false, message: "Code sent failed!"});
  } catch (error) {
    console.log(error);
  }
};

exports.verifyForgotPasswordCode = async (req, res) => {
  const {email, providedCode, newPassword} = req.body;
  try {
    const {error, value} = acceptForgotPasswordCodeSchema.validate({
      email,
      providedCode,
      newPassword,
    });
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({email}).select(
      "+forgotPasswordCode +forgotPasswordCodeValidation"
    );

    if (!existingUser) {
      return res
        .status(401)
        .json({success: false, message: "User does not exists!"});
    }

    if (
      !existingUser.forgotPasswordCode ||
      !existingUser.forgotPasswordCodeValidation
    ) {
      return res
        .status(400)
        .json({success: false, message: "Something is wrong with the code!"});
    }

    if (
      Date.now() - existingUser.forgotPasswordCodeValidation >
      5 * 60 * 1000
    ) {
      return res
        .status(400)
        .json({success: false, message: "Code has been expired!"});
    }

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );

    if (hashedCodeValue === existingUser.forgotPasswordCode) {
      const hashedPassword = await doHash(newPassword, 12);
      existingUser.password = hashedPassword;
      existingUser.forgotPasswordCode = undefined;
      existingUser.forgotPasswordCodeValidation = undefined;
      await existingUser.save();
      return res
        .status(200)
        .json({success: true, message: "Your password has been changed!"});
    }
    return res
      .status(400)
      .json({success: false, message: "Unexpected ocurred!"});
  } catch (error) {
    console.log(error);
  }
};

exports.changePassword = async (req, res) => {
  const {userId, verified} = req.user;
  const {oldPassword, newPassword} = req.body;

  try {
    const {error, value} = changePasswordSchema.validate({
      oldPassword,
      newPassword,
    });
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    if (!verified) {
      return res
        .status(401)
        .json({success: false, message: "Your user are not verified!"});
    }
    const existingUser = await User.findOne({_id: userId}).select("+password");
    if (!existingUser) {
      return res
        .status(401)
        .json({success: false, message: "User does not exists!"});
    }
    const result = await doHashValidation(oldPassword, existingUser.password);
    if (!result) {
      return res
        .status(401)
        .json({success: false, message: "Invalid credentials!"});
    }
    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return res.status(200).json({success: true, message: "Password updated!!"});
  } catch (error) {
    console.log(error);
  }
};

exports.sendForgotPasswordCode = async (req, res) => {
  const {email} = req.body;
  try {
    const existingUser = await User.findOne({email});
    if (!existingUser) {
      return res
        .status(401)
        .json({success: false, message: "Users does not exists!"});
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();
    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: existingUser.email,
      subject: "Forgot password code",
      html: "<h1>" + codeValue + "</h1>",
    });

    if (info.accepted[0] === existingUser.email) {
      const hashedCodedValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
      existingUser.forgotPasswordCode = hashedCodedValue;
      existingUser.forgotPasswordCodeValidation = Date.now();
      await existingUser.save();
      return res.status(200).json({success: true, message: "Code sent!"});
    }
    res.status(400).json({success: false, message: "Code sent failed!"});
  } catch (error) {
    console.log(error);
  }
};

exports.verifyVerificationCode = async (req, res) => {
  const tokenEmail = req.user.email;

  const {email, providedCode} = req.body;
  if (tokenEmail !== email) {
    return res.status(401).json({success: false, message: "Unauthorized"});
  }
  try {
    const {error, value} = acceptCodeSchema.validate({email, providedCode});
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({email}).select(
      "+verificationCode +verificationCodeValidation"
    );

    if (!existingUser) {
      return res
        .status(401)
        .json({success: false, message: "User does not exists!"});
    }

    if (existingUser.verified) {
      return res
        .status(401)
        .json({success: false, message: "You are already verified!"});
    }

    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      return res
        .status(400)
        .json({success: false, message: "Something is wrong with the code!"});
    }

    if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
      return res
        .status(400)
        .json({success: false, message: "Code has been expired!"});
    }

    const hashedCodeValue = hmacProcess(
      codeValue,
      process.env.HMAC_VERIFICATION_CODE_SECRET
    );

    if (hashedCodeValue === existingUser.verificationCode) {
      existingUser.verified = true;
      existingUser.verificationCode = undefined;
      existingUser.verificationCodeValidation = undefined;
      await existingUser.save();
      return res
        .status(200)
        .json({success: true, message: "Your account has been verified!"});
    }
    return res
      .status(400)
      .json({success: false, message: "Unexpected ocurred!"});
  } catch (error) {
    console.log(error);
  }
};

exports.getUserProfile = async (req, res) => {
  const { userId } = req.user;
  
  try {
    const user = await User.findById(userId).select('-password -verificationCode -verificationCodeValidation -forgotPasswordCode -forgotPasswordCodeValidation');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
