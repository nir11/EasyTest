const router = require("express").Router();
const Garage = require("../schemas/garages/garages.schema");

router.post("/login", async (req, res) => {
  if (
    req.body.username.toLowerCase() === "admin" &&
    req.body.password.toLowerCase() === "pilot2023"
  )
    return res.send("Login success");
  res.status(400).send("Wrong login details");

  const isNameExists = await Garage.findOne({ Name: req.body.Name });
  if (isNameExists) return res.status(400).send("Garage name already exists");
});

module.exports = router;
