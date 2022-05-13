const router = require("express").Router();
const Appointment = require("../schemas/appointments/appointments.schema");
const Garage = require("../schemas/garages/garages.schema");
const moment = require("moment");

router.get("/", async (req, res) => {
  const appointments = await Appointment.find();
  res.send({ appointments });
});

router.get("/:garage/:month", async (req, res) => {
  try {
    let month = parseInt(req.params?.month);
    if (month < 1 || month > 12) return res.status(400).send("Invalid month");
    const bookedAppointments = await Appointment.find({
      Garage: req.params.garage,
      $expr: { $eq: [{ $month: "$Datetime" }, req.params.month] },
    });

    const ll = bookedAppointments.map((app) =>
      moment(app.Datetime).local().format("DD/MM/YYYY HH:mm")
    );
    console.log({ ll });
    const ExcludeDatetime = [
      ...new Set(
        bookedAppointments.map((app) =>
          moment(app.Datetime).local().format("DD/MM/YYYY HH:mm")
        )
      ),
    ];

    res.send({ ExcludeDatetime });
  } catch (err) {
    res.status(400).send("Error");
  }
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
