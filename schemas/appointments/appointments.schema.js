const mongoose = require("mongoose");
const pkg = require("mongoose");
const { PathSchema } = require("../garages/garages.schema");
const {
  Types: { ObjectId },
  Schema,
} = pkg;

const UserSchema = new Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
});

const AppointmentSchema = new Schema({
  User: {
    type: UserSchema,
  },
  Path: {
    type: Schema.Types.ObjectId,
    ref: "Path",
    required: true,
  },
  PathName: {
    type: String,
    required: true,
  },
  CarNumber: {
    type: String,
    required: true,
  },
  Datetime: {
    type: Date,
    required: true,
  },
  Garage: { type: Schema.Types.ObjectId, ref: "Garage" },
  GarageName: {
    type: String,
    required: true,
  },
});

// appointmentSchema.virtual("FullName").get(function () {
//   return `${this.FirstName} ${this.LastName}`;
// });

module.exports = mongoose.model(
  "Appointment",
  AppointmentSchema,
  "Appointments"
);
