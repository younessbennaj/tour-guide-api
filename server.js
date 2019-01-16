const activities = require("./routes/activities");
const express = require("express");
const app = express();

app.use(express.json());
app.use("/api/activities", activities);

const port = process.env.PORT || 3300;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
