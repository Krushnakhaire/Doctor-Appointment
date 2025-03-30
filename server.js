const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));



// Serving React App
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*",function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Port Setup
const PORT = process.env.PORT || 8080;
const MODE = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${MODE} mode on port ${PORT}`.bgCyan.white);
});
