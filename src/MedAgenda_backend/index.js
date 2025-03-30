const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookies = require("cookie-parser");
const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;


const authRouter = require("./routers/authRouter");
const doctorRouter = require("./routers/doctorRouter");
const appointmentRouter = require("./routers/appointmentRouter");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookies());
app.use(express.urlencoded({extended: true}));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

cloudinary
  .config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});
  
app.use("/api/auth", authRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/appointment", appointmentRouter);
app.get("/", (req, res) => {
  res.json({message: "Hello World!"});
});

app.listen(process.env.PORT);
