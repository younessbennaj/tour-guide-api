const express = require("express");
const app = express();
const port = 3300;

app.use(express.json());

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.log("err"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

const activitySchema = new mongoose.Schema({
  name: String,
  tags: [String],
  description: String
});

var Activity = mongoose.model("Activity", activitySchema);

app.get("/api/activities", (req, res) => {
  if (Object.keys(req.query).length == 0) {
    async function getActivities() {
      const result = await Activity.find();
      res.send(result);
    }
    getActivities();
  } else {
    async function getActivities() {
      let filter = [];
      for (let tag in req.query.tags) {
        filter.push({ tags: { $in: [req.query.tags[tag]] } });
      }
      const result = await Activity.find().and(filter);
      res.send(result);
    }
    getActivities();
  }
});

app.post("/api/activities", (req, res) => {
  async function createActivity() {
    const activity = new Activity({
      name: req.body.name,
      tags: req.body.tags,
      description: req.body.description
    });
    const result = await activity.save();
  }
  createActivity();
  res.send("success");
});

app.get("/api/activities/:id", (req, res) => {
  async function getActivity() {
    const result = await Activity.findById(req.params.id);
    res.send(result);
  }
  getActivity();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
