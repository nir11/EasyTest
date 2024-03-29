const mongoose = require("mongoose");
const pkg = require("mongoose");
const {
  Types: { ObjectId },
  Schema,
} = pkg;

const Path = new Schema(
  {
    Name: {
      type: String,
      require: true,
    },
    Active: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

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
  Active: {
    type: Boolean,
    required: true,
    default: true,
  },
  WorkDays: {
    type: [DayTime],
    required: true,
  },
  Paths: {
    type: [Path],
    required: true,
  },
});

module.exports = mongoose.model("Garage", GarageSchema, "Garages");
