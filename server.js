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
// tests 5 + 6 + 7
app.get("/api/exercise/log", (request, response) => {
  User.findById(request.query.userId, (error, result) => {
    if (!error) {
      let responseObject = result;

      if (request.query.from || request.query.to) {
        let fromDate = new Date(0);
        let toDate = new Date();

        if (request.query.from) {
          fromDate = new Date(request.query.from);
        }

        if (request.query.to) {
          toDate = new Date(request.query.to);
        }

        fromDate = fromDate.getTime();
        toDate = toDate.getTime();

        responseObject.log = responseObject.log.filter((session) => {
          let sessionDate = new Date(session.date).getTime();

          return sessionDate >= fromDate && sessionDate <= toDate;
        });
      }

      if (request.query.limit) {
        responseObject.log = responseObject.log.slice(0, request.query.limit);
      }

      responseObject = responseObject.toJSON();
      responseObject["count"] = result.log.length;
      response.json(responseObject);
    }
  });
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
