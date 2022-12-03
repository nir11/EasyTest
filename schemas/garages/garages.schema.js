const mongoose = require("mongoose");
const pkg = require("mongoose");
const {
  Types: { ObjectId },
  Schema,
} = pkg;

const DayTime = new Schema({
  // 1-7 - sunday to saturday
  DayIndex: {
    type: Number,
    required: true,
  },
  StartTime: {
    type: String,
    require: true,
  },
  EndTime: {
    type: String,
    require: true,
  },
});

const GarageSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Longitude: {
    type: String,
    required: true,
  },
  Latitude: {
    type: String,
    required: true,
  },
  WorkDays: {
    type: [DayTime],
    required: true,
  },
});

module.exports = mongoose.model("Garage", GarageSchema, "Garages");
