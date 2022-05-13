const router = require("express").Router();
const Garage = require("../schemas/garages/garages.schema");

router.post("/", async (req, res) => {
  const isNameExists = await Garage.findOne({ Name: req.body.Name });
  if (isNameExists) return res.status(400).send("Garage name already exists");

  const newGarage = new Garage({
    Name: req.body.Name,
    Phone: req.body.Phone,
    Longitude: req.body.Longitude,
    Latitude: req.body.Latitude,
    WorkDays: req.body.WorkDays,
  });
  await newGarage.save();
  res.send({ Id: newGarage._id });
});

router.get("/", async (req, res) => {
  const garages = await Garage.find();
  res.send({ garages });
});

module.exports = router;
