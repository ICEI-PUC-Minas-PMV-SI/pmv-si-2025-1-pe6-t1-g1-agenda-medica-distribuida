const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookies = require("cookie-parser");
const mongoose = require("mongoose");

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

app.use("/api/auth", authRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/appointment", appointmentRouter);

app.listen(process.env.PORT);
