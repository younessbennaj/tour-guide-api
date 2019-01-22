const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb://tour-guide-user:chalons51@ds159634.mlab.com:59634/tour-guide"
  )
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.log("err"));

const activitySchema = new mongoose.Schema({
  name: String,
  tags: [String],
  url: String,
  description: String,
  img: String
});

var Activity = mongoose.model("Activity", activitySchema);

router.get("/", (req, res) => {
  if (Object.keys(req.query).length == 0) {
    async function getActivities() {
      const result = await Activity.find();
      res.send(result);
    }
    getActivities();
  } else {
    if (req.query.name) {
      //Find activities by name
      async function getActivitiesByName() {
        const result = await Activity.find({
          name: { $regex: new RegExp(`.*${req.query.name}.*`, "i") }
        });
        res.send(result);
      }
      getActivitiesByName();
    }
    if (req.query.tags) {
      //Find activities by tag
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
  }
});

router.post("/", (req, res) => {
  async function createActivity() {
    const activity = new Activity({
      name: req.body.name,
      tags: req.body.tags,
      url: req.body.url,
      description: req.body.description,
      img: req.body.img
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
          tags: req.body.tags,
          url: req.body.url,
          img: req.body.img
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
