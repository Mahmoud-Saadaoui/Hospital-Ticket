// create server
require("dotenv").config();
const express = require("express");
const app = express();

//CRON
const cleanupAppointments = require("./config/cronJobs");

const cors = require("cors");
const corsOption = require("./config/corsOption");
const cookieParser = require("cookie-parser");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");

//connect DB
const mongoose = require("mongoose");
const connectDb = require("./config/dbconnect");
const PORT = process.env.PORT || 5000;

connectDb();

app.disable("x-powered-by");
app.use(requestLogger);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'"
  );
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }
  next();
});
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));

//Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/doctor", require("./routes/doctorRoutes"));
app.use("/appointment", require("./routes/appointmentRoutes"));

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    data: {
      title: "Route not found",
    },
  });
});
app.use(errorHandler);

cleanupAppointments();

//if connect done
mongoose.connection.once("open", () => {
  console.log("connection to database is done");
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});

// if not
mongoose.connection.on("error", (err) => {
  console.log(err);
});
