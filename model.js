require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to mongo DB");
  }
);
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  __v: { type: Number, select: false },
});
const User = new mongoose.model(`User`, UserSchema);

const ExerciseSchema = new mongoose.Schema({
  date: String,
  duration: { type: Number, required: true },
  description: { type: String, required: true },
});
const Exercise = new mongoose.model(`Exercise`, ExerciseSchema);

module.exports = { User, Exercise };
