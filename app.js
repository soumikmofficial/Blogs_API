require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
// imports
const connectDB = require("./config/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authRoutes = require("./routes/authRoutes");
// packages
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log(`Shutting down server due to uncaught exception rejection.`);
  process.exit(1);
});

// ............................body parser............................
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());

// ............................routes...........................
app.get("/", (req, res) => res.send("<h2>The home page<h2/>"));
app.use("/api/v1/auth", authRoutes);

// ............................error handlers............................
app.use(errorHandlerMiddleware);

// ..................................server and database...........................
connectDB();

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`server up on port: ${port}`)
);

process.on("unhandledRejection", (err) => {
  console.log(err.message);
  console.log(`Shutting down server due to unhandled promise rejection.`);
  server.close(() => {
    process.exit(1);
  });
});
