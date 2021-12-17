const mongoose = require("mongoose");

const connectDB = async () => {
  const data = await mongoose.connect(process.env.MONGO_URI);
  console.log(`connect to mongoDB on ${data.connection.host}`);
};

module.exports = connectDB;
