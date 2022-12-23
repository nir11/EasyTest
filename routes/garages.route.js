const router = require("express").Router();
const Garage = require("../schemas/garages/garages.schema");

// migration
router.put("/", async (req, res) => {
  await Garage.updateMany({}, { $set: { Active: true } });

  // update מ.מ.מ בדיקות רכב ורישוי
  const mmmGarage = await Garage.findById("627e21090e5f3b0a0df6d274");
  mmmGarage.Paths = [
    {
      Name: "מסלול 1",
    },
    {
      Name: "מסלול 2",
    },
    {
      Name: "מסלול 3",
    },
  ];

  await mmmGarage.save();

  // update בסט טסט בע"מ
  const bestTestGarage = await Garage.findById("627e25e505b3fc112c864013");
  bestTestGarage.Paths = [
    {
      Name: "מסלול 1",
    },
    {
      Name: "מסלול 2",
    },
    {
      Name: "מסלול 3",
    },
    {
      Name: "מסלול 4",
    },
  ];
  await bestTestGarage.save();

  // update דינמומטר
  const dinamometerGarage = await Garage.findById("627e264205b3fc112c86401c");
  dinamometerGarage.Paths = [
    {
      Name: "מסלול 1",
    },
    {
      Name: "מסלול 2",
    },
    {
      Name: "מסלול 3",
    },
    {
      Name: "מסלול 4",
    },
  ];
  await dinamometerGarage.save();

  // update טסט ליין בע"מ
  const testLineGarage = await Garage.findById("627e243b05b3fc112c864005");
  testLineGarage.Paths = [
    {
      Name: "מסלול 1",
    },
    {
      Name: "מסלול 2",
    },
    {
      Name: "מסלול 3",
    },
    {
      Name: "מסלול 4",
    },
  ];
  await testLineGarage.save();

  res.send("Done");
});

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
  const garages = await Garage.find({ Active: true });
  res.send({ garages });
});

router.put("/:id", async (req, res) => {
  const garage = await Garage.findById(req.params.id);
  if (!garage) res.status(400).send("Garage not found");

  garage.WorkDays = req.body.WorkDays;
  await garage.save();
  res.send("Done");
});

router.put("/:id/paths", async (req, res) => {
  const garage = await Garage.findById(req.params.id);
  if (!garage) res.status(400).send("Garage not found");

  garage.Paths = req.body.Paths;
  await garage.save();
  res.send("Done");
});

module.exports = router;
