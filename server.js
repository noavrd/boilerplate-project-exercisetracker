const express = require("express");
const app = express();
const cors = require("cors");
const { User, Exercise } = require("./model");
const { request } = require("express");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
// test 2
app.post("/api/exercise/new-user", async (req, res) => {
  const userName = req.body.username;
  const newUser = new User({
    username: userName,
  });
  newUser.save((err, user) => {
    if (!err) {
      let responseObj = {};
      responseObj.username = userName;
      responseObj._id = user._id;
      res.json(responseObj);
    }
  });
});
// test 3
app.get("/api/exercise/users", (req, res) => {
  User.find({}, (err, userArr) => {
    if (!err) {
      res.json(userArr);
    }
  });
});
// test 4
app.post("/api/exercise/add", (req, res) => {
  let newExerciseItem = new Exercise({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date,
  });

  if (newExerciseItem.date === "") {
    newExerciseItem.date = new Date()
      .toISOString()
      .substring(0, 10)
      .toDateString();
  }

  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { log: newExerciseItem } },
    { new: true },
    (error, updatedUser) => {
      if (!error) {
        let responseObject = {};
        responseObject["_id"] = updatedUser.id;
        responseObject["username"] = updatedUser.username;
        responseObject["description"] = newExerciseItem.description;
        responseObject["duration"] = newExerciseItem.duration;
        responseObject["date"] = new Date(newExerciseItem.date).toDateString();
        res.json(responseObject);
      }
    }
  );
});
// tests 5 + 6
app.get(`/api/exercise/log`, (req, res) => {
  User.findById(req.query.userId, (err, user) => {
    if (!err) {
      let resObj = {};
      resObj._id = user._id;
      resObj.username = user.username;
      resObj.count = user.log.length;
      resObj.log = [];
      for (userLog of user.log) {
        const logObj = {
          description: userLog.description,
          duration: userLog.duration,
          date: userLog.date,
        };
        resObj.log.push(logObj);
        console.log(userLog);
      }
      res.json(resObj);
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
