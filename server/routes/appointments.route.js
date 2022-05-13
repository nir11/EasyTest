const router = require("express").Router();
const Appointment = require("../schemas/appointments/appointments.schema");
const Garage = require("../schemas/garages/garages.schema");

router.get("/", async (req, res) => {
  const appointments = await Appointment.find();
  res.send({ appointments });
});

router.post("/", async (req, res) => {
  const isGarageExists = await Garage.findById(req.body.GarageId);
  if (!isGarageExists) return res.status(400).send("Garage not exists");

  const isAppointmentDatetimeExists = await Appointment.findOne({
    Datetime: req.body.Datetime,
    Garage: req.body.GarageId,
  });
  if (isAppointmentDatetimeExists)
    return res.status(400).send("Appointment Datetime already exists");

  const newAppointment = new Appointment({
    User: {
      FirstName: req.body.User.FirstName,
      LastName: req.body.User.LastName,
      Phone: req.body.User.Phone,
      Email: req.body.User.Email,
      TZ: req.body.User.TZ,
    },
    CarNumber: req.body.CarNumber,
    Datetime: req.body.Datetime,
    Garage: req.body.GarageId,
  });
  await newAppointment.save();
  res.send({ Id: newAppointment._id });
});

module.exports = router;
