const activities = require("./routes/activities");
const express = require("express");
const app = express();
const port = 3300;

app.use(express.json());
app.use("/api/activities", activities);

app.get("/", (req, res) => {
  res.send("Hello World !!");
});

app.listen(process.env.PORT || port, () =>
  console.log(`Listening on port ${port}`)
);
