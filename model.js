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

const ExerciseSchema = new mongoose.Schema({
  date: String,
  duration: { type: Number, required: true },
  description: { type: String, required: true },
});
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [ExerciseSchema],
});
const Exercise = new mongoose.model(`Exercise`, ExerciseSchema);
const User = new mongoose.model(`User`, UserSchema);

module.exports = { User, Exercise };
