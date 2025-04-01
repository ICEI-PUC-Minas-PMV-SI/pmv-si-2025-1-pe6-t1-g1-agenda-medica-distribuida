const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookies = require("cookie-parser");
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

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

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Medical Appointment API",
      version: "1.0.0",
      description: "API para agendamento de consultas médicas",
    },
    servers: [
      {
        url: "http://localhost:" + (process.env.PORT || 3000),
        description: "Servidor de desenvolvimento",
      },
      {
        url:
          "http://ec2-35-153-153-45.compute-1.amazonaws.com" +
          (process.env.PORT || 3000),
        description: "Servidor em produção",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routers/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.listen(process.env.PORT);
