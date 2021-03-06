require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// imports
const connectDB = require("./config/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");
const likeRoutes = require("./routes/likeRoutes");

// packages
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// cloudinary
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log(`Shutting down server due to uncaught exception rejection.`);
  process.exit(1);
});

// ...........security...................
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

// ........public................
app.use(express.static("./public"));

// ............................body parser............................
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// ............................routes...........................
app.get("/", (req, res) => res.send("<h2>The home page<h2/>"));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/likes", likeRoutes);

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
