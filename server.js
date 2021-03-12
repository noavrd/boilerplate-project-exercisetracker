const express = require("express");
const app = express();
const cors = require("cors");
const User = require("./model");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", async (req, res) => {
  const userName = req.body.username;

  const newUser = new User({
    name: userName,
  });
  // User.findOne({ name: userName })
  //   .exec()
  //   .then((doc) => {
  //     if (doc) {
  //       console.log("hello");
  //     } else {
  //       console.log("Goodbye");
  //     }
  //   });
  newUser
    // .select([`_id`, `username`])
    .save()
    .then((result) => {
      res.send(`{"username": ${newUser.username}, "_id": ${newUser._id}}`);
    })
    .catch((err) => {
      res.status(500).send(`Internal server error ${err}`);
    });

  // await console.log(User.findOne({ name: userName }).exec());
  // if (User.findOne({ name: userName }).exec()) {
  //   res.status(400).send("Username already taken");
  // }
});

app.get("api/exercise/users", (req, res) => {
  res.send();
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
