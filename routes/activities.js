const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.log("err"));

const activitySchema = new mongoose.Schema({
  name: String,
  tags: [String],
  description: String
});

var Activity = mongoose.model("Activity", activitySchema);

router.get("/", (req, res) => {
  console.log("get activities");
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

router.post("/", (req, res) => {
  async function createActivity() {
    const activity = new Activity({
      name: req.body.name,
      tags: req.body.tags,
      description: req.body.description
    });
    const result = await activity.save();
    res.send(result);
  }
  createActivity();
});

router.get("/:id", (req, res) => {
  async function getActivity() {
    const result = await Activity.findById(req.params.id);
    res.send(result);
  }
  getActivity();
});

router.put("/:id", (req, res) => {
  async function updateActivity() {
    const result = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          tags: req.body.tags
        }
      },
      { new: true }
    );
    res.send(result);
  }
  updateActivity();
});

router.delete("/:id", (req, res) => {
  async function deleteActivity() {
    const result = await Activity.deleteOne({ _id: req.params.id });
    res.send(result);
  }

  deleteActivity();
});

module.exports = router;
