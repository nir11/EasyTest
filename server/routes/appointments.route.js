const router = require("express").Router();
const Appointment = require("../schemas/appointments/appointments.schema");

router.get("/", async (req, res) => {
  const appointments = await Appointment.find();
  res.send({ appointments });
});

router.post("/", async (req, res) => {
  // const appointments = await Appointment.find();
  // res.send({ appointments });
});

module.exports = router;
