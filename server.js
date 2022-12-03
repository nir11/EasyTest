const express = require("express");
const env = require("dotenv");
// const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { default: mongoose } = require("mongoose");

const app = express();

// environment variable
env.config();

// setting up cors config
app.use(cors());

app.use(express.json());

// mongodb connection
mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    // console.error(err);
  });

// import routes
const appointmentsRoute = require("./routes/appointments.route");
const garagesRoute = require("./routes/garages.route");

// API
app.use("/appointments", appointmentsRoute);
app.use("/garages", garagesRoute);

const port = process.env.PORT || 4000;

// Step 1:
app.use(express.static(path.resolve(__dirname, "./client/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${port}`);
});
