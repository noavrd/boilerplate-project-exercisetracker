require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  __v: { type: Number, select: false },
});
const User = new mongoose.model(`User`, UserSchema);
module.exports = User;
