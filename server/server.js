const express = require("express");
const env = require("dotenv");
// const mongoose = require("mongoose");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

const app = express();

// environment variable
env.config();

// setting up cors config
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

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
    console.error(err);
  });

// import routes
const appointmentsRoute = require("./routes/appointments.route");
const garagesRoute = require("./routes/garages.route");

// API
app.use("/appointments", appointmentsRoute);
app.use("/garages", garagesRoute);

const port = process.env.PORT || 4000;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${port}`);
});
