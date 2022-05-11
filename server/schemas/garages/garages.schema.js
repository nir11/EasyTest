const mongoose = require("mongoose");

const GarageSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Longitude: {
    type: String,
    require: true,
  },
  Latitude: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Garage", GarageSchema, "Garages");
