const activities = require("./routes/activities");
const express = require("express");
const app = express();

app.use(express.json());
app.use("/api/activities", activities);

app.listen(process.env.PORT || port, () =>
  console.log(`Listening on port ${port}`)
);
