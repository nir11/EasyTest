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
    type: Date,
    require: true,
  },
  EndTime: {
    type: Date,
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
