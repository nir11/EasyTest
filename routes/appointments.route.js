const router = require("express").Router();
const Appointment = require("../schemas/appointments/appointments.schema");
const Garage = require("../schemas/garages/garages.schema");
// const moment = require("moment");
const moment = require("moment-timezone");
const { sendNewAppointmentEmail } = require("../utils/email");
const geolib = require("geolib");
var ObjectId = require("mongoose").Types.ObjectId;

router.get("/", async (req, res) => {
  const appointments = await Appointment.find();
  res.send({ appointments });
});

router.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid appointemtn id");
  const appointment = await Appointment.findById(req.params.id).populate(
    "Garage"
  );
  if (!appointment) return res.status(400).send("Appointment not exists");

  res.send({ appointment });
});

router.get("/garage/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid garage id");
  const appointments = await Appointment.find({ Garage: req.params.id }).sort({
    Datetime: 1,
  });

  res.send({ appointments });
});

router.delete("/garage/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid garage id");
  await Appointment.deleteOne({ Garage: req.params.id });
  res.send("Done");
});

router.post("/email", (req, res) => {
  sendNewAppointmentEmail({});
  res.send("done");
});

router.delete("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid appointemtn id");
  await Appointment.deleteOne({
    _id: req.params.id,
  });
  res.send("Appointment deleted successfully");
});

router.get("/:garage/:year/:month", async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.garage);
    if (!garage) return res.status(400).send("Garage not exists");

    const month = parseInt(req.params?.month);
    if (month < 1 || month > 12) return res.status(400).send("Invalid month");

    let startDate = moment({
      year: parseInt(req.params.year),
      month: month - 1,
      day: 1,
    });

    let endDate = moment({
      year: parseInt(req.params.year),
      month: month === 12 ? 0 : month,
      day: 1,
    });

    let bookedAppointments = await Appointment.find({
      Garage: req.params.garage,
      $and: [{ Datetime: { $gte: startDate } }, { Datetime: { $lt: endDate } }],
      // $expr: { $eq: [{ $month: "$Datetime" }, req.params.month] },
      // $expr: { $eq: [{ $year: "$Datetime" }, req.params.year] },
    });
    // console.log({ bookedAppointments });

    bookedAppointments = bookedAppointments.map((app) =>
      moment(app.Datetime).tz("Asia/Jerusalem").format("DD/MM/YYYY HH:mm")
    );

    const activePaths = garage.Paths.filter((path) => path.Active === true);
    const allowedAppointmentsPerTime = activePaths.length * 2;

    const uniueAppointemtnsTimes = [...new Set(bookedAppointments)];
    let ExcludeDatetime = [];

    for (const uniqueAppTime of uniueAppointemtnsTimes) {
      const numOfAppointemtnsForCurrentTime = bookedAppointments.filter(
        (app) => app === uniqueAppTime
      );
      if (
        numOfAppointemtnsForCurrentTime.length >= allowedAppointmentsPerTime
      ) {
        ExcludeDatetime.push(uniqueAppTime);
      }
    }

    // console.log({ ExcludeDatetime });

    let todayPastTime = [];
    const minutesToAdd = 15;

    const currentMonth = moment().tz("Asia/Jerusalem").month() + 1;
    if (currentMonth === parseInt(req.params?.month)) {
      let time = moment().tz("Asia/Jerusalem").startOf("day");
      const nowPlus30Minutes = moment().tz("Asia/Jerusalem").add(30, "minutes");
      // console.log({ nowPlus30Minutes });
      while (nowPlus30Minutes.isAfter(time)) {
        todayPastTime.push(time.clone());
        time = time.add(minutesToAdd, "minutes");
      }
      ExcludeDatetime = ExcludeDatetime.concat(
        ...new Set(todayPastTime.map((date) => date.format("DD/MM/YYYY HH:mm")))
      );
    }

    res.send({ ExcludeDatetime });
  } catch (err) {
    res.status(400).send("Error");
  }
});

const calculateDistanceToGarage = (userLocation, garageLocation) => {
  const distance =
    geolib.getPreciseDistance(userLocation, garageLocation) / 1000;
  const distanceInKm = parseFloat(distance.toFixed(1));
  // console.log("distanceInKm", distanceInKm);
  return distanceInKm;
};

router.put("/free", async (req, res) => {
  let garages = [];
  if (req.body?.Garages?.length > 0)
    garages = await Garage.find({ _id: { $in: req.body.Garages } });
  else {
    garages = await Garage.find();
  }
  let allGaragesRecommendedAppointments = [];

  for (let i = 0; i < garages.length; i++) {
    try {
      const recAppointments = await findNextFreeAppointmentOfGarage(
        garages[i]._id
      );
      // console.log({ recAppointments });
      if (recAppointments.length > 0) {
        allGaragesRecommendedAppointments.push({
          Id: garages[i]._id,
          Name: garages[i].Name,
          Appointments: recAppointments,
          Address: garages[i].Address,
          City: garages[i].City,
        });
        // console.log({ allGaragesRecommendedAppointments });
      }
    } catch (error) {
      console.log("error" + error);
    }
  }

  let bestAppointment = null;
  allGaragesRecommendedAppointments.forEach((garage) => {
    garage.Appointments.forEach((appointment) => {
      if (!bestAppointment) {
        bestAppointment = {
          Id: garage.Id,
          Name: garage.Name,
          Distance: garage.Distance,
          Datetime: appointment,
          Address: garage.Address,
          City: garage.City,
        };
        return;
      }
      if (appointment.isBefore(bestAppointment.Datetime)) {
        bestAppointment = {
          Id: garage.Id,
          Name: garage.Name,
          Distance: garage.Distance,
          Datetime: appointment,
          Address: garage.Address,
          City: garage.City,
        };
      }
    });
    // console.log({ garage });
  });

  res.send({ Appointments: [bestAppointment] });
});

router.put("/recommended", async (req, res) => {
  let garages = [];
  if (req.body?.Garages?.length > 0)
    garages = await Garage.find({ _id: { $in: req.body.Garages } });
  else {
    garages = await Garage.find();
  }

  const userLocation = {
    latitude: req.body.Latitude,
    longitude: req.body.Longitude,
  };

  let allGaragesRecommendedAppointments = [];

  for (let i = 0; i < garages.length; i++) {
    try {
      const recAppointments = await findNextFreeAppointmentOfGarage(
        garages[i]._id
      );
      // console.log({ recAppointments });
      if (recAppointments.length > 0) {
        allGaragesRecommendedAppointments.push({
          Id: garages[i]._id,
          Name: garages[i].Name,
          Distance: calculateDistanceToGarage(userLocation, {
            latitude: garages[i].Latitude,
            longitude: garages[i].Longitude,
          }),
          Appointments: recAppointments,
          Address: garages[i].Address,
          City: garages[i].City,
        });
        // console.log({ allGaragesRecommendedAppointments });
      }
    } catch (error) {
      console.log("error" + error);
    }
  }

  const Recommendations = calculateBestRecommendedAppointments(
    allGaragesRecommendedAppointments
  );

  res.send({ Recommendations });
});

const calculateBestRecommendedAppointments = (garagesRecs) => {
  // console.log({ garagesRecs });
  const result = [];
  let scores = [];

  garagesRecs.forEach((garage) => {
    garage.Appointments.forEach((appointment) => {
      const appointmentScore = getAppointmenScore(garage, appointment);

      // console.log("garagesRec.Distance", garagesRec.Distance);
      // console.log({ appointmentScore });
      scores.push({
        name: garage.Name,
        distance: garage.Distance,
        score: appointmentScore,
      });
      if (!result[0]) {
        result[0] = addNewRecommendedAppointment(
          garage,
          appointment,
          appointmentScore
        );
        return;
      }
      if (!result[1]) {
        // console.log({ appointmentScore });
        if (
          appointmentScore < result[0].Score ||
          (appointmentScore === result[0].Score &&
            appointment.Distance < result[0].Distance)
        ) {
          result[1] = { ...result[0] };
          result[0] = addNewRecommendedAppointment(
            garage,
            appointment,
            appointmentScore
          );
          return;
        }
        result[1] = addNewRecommendedAppointment(
          garage,
          appointment,
          appointmentScore
        );
        return;
      }

      if (
        appointmentScore < result[1].Score ||
        (appointmentScore === result[1].Score &&
          appointment.Distance < result[1].Distance)
      ) {
        if (
          appointmentScore < result[0].Score ||
          (appointmentScore === result[0].Score &&
            appointment.Distance < result[0].Distance)
        ) {
          result[0] = addNewRecommendedAppointment(
            garage,
            appointment,
            appointmentScore
          );
          return;
        }
        result[1] = addNewRecommendedAppointment(
          garage,
          appointment,
          appointmentScore
        );
        return;
      }
    });
  });
  // console.log({ scores });
  return result;
};

const getAppointmenScore = (garage, appointment) => {
  // console.log({ appointment });

  let totalScore = 0;
  let distanceScore = 0;
  let daysLeftScore = 0;

  // console.log("distance", garage.Distance);
  if (garage.Distance < 15) distanceScore = 0;
  else if (garage.Distance >= 15 && garage.Distance < 20) distanceScore = 1;
  else if (garage.Distance >= 20 && garage.Distance < 30) distanceScore = 2;
  else if (garage.Distance >= 30) distanceScore = 3;

  const daysToAppointment = parseInt(appointment.diff(moment(), "days"));
  // console.log({ daysToAppointment });
  if (daysToAppointment < 5) daysLeftScore = 0;
  else if (daysToAppointment >= 5 && daysToAppointment < 10) daysLeftScore = 1;
  else if (daysToAppointment >= 10 && daysToAppointment < 15) daysLeftScore = 2;
  else if (daysToAppointment >= 15) daysLeftScore = 3;

  const minutesToAppointment = parseInt(appointment.diff(moment(), "minutes"));

  // console.log({ minutesToAppointment });

  totalScore = distanceScore + daysLeftScore + minutesToAppointment;
  return totalScore;
};

const addNewRecommendedAppointment = (garage, appointment, distanceScore) => {
  return {
    Id: garage.Id,
    Name: garage.Name,
    Distance: garage.Distance,
    Score: distanceScore,
    Datetime: appointment,
    Address: garage.Address,
    City: garage.City,
  };
};

const findNextFreeAppointmentOfGarage = async (garageId) => {
  let recommendedAppointments = [];

  // get current date
  let date = moment();
  const garage = await Garage.findOne({ _id: garageId });
  if (!garage) return null;

  // get day index
  let dayIndex = moment().day() + 1;
  // console.log({ dayIndex });

  let count = 1;
  while (count !== 7) {
    // console.log({ dayIndex });
    const isDayIndexExistsForGarage = garage.WorkDays[dayIndex - 1];
    if (!isDayIndexExistsForGarage) {
      // console.log("day not exists");
      date = date.clone().add(1, "days");
      dayIndex = date.clone().day() + 1;
      count++;
      continue;
    }
    const bookedAppointmentOfDate = await getBookedAppointmentsOfDay(
      date.clone(),
      garage._id
    );
    // console.log({ bookedAppointmentOfDate });

    let startTimeOfDate = moment(
      date.clone().format("YYYY-MM-DD") +
        " " +
        garage.WorkDays[dayIndex - 1].StartTime
    );
    const endTimeOfDate = moment(
      date.clone().format("YYYY-MM-DD") +
        " " +
        garage.WorkDays[dayIndex - 1].EndTime
    );

    const isDateIsToday = moment().isSame(
      date.clone().format("YYYY-MM-DD"),
      "day"
    );
    // console.log({ isDayIsToday });
    if (isDateIsToday) {
      const start = moment();
      const reminder = 30 - (start.minute() % 30);
      startTimeOfDate = moment().add(30, "minutes").add(reminder, "minutes");
    }
    // console.log({ startTimeOfDate });

    const recommendedAppointmentsInDay = findFreeAppointmentsInDay(
      bookedAppointmentOfDate,
      startTimeOfDate,
      endTimeOfDate
    );
    // console.log({ recommendedAppointmentsInDay });
    if (recommendedAppointmentsInDay.length > 0)
      recommendedAppointments = recommendedAppointments.concat(
        recommendedAppointmentsInDay
      );

    if (recommendedAppointments.length >= 2) {
      if (recommendedAppointments.length > 2) {
        recommendedAppointments = recommendedAppointments.sort(function (a, b) {
          return new Date(a) - new Date(b);
        });
        recommendedAppointments = [
          recommendedAppointments[0],
          recommendedAppointments[1],
        ];
      }
      return recommendedAppointments;
    }

    if (dayIndex == 6) {
      dayIndex = 0;
    } else {
      dayIndex++;
    }
    date = date.clone().add(1, "days");
    dayIndex = date.clone().day() + 1;
    count++;
  }
  return recommendedAppointments;
};

const getBookedAppointmentsOfDay = async (date, garageId) => {
  // console.log({ date });
  const testDate = date
    .clone()
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    // .local()
    .toISOString();
  const nextDate = date
    .clone()
    .add(1, "days")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    // .local()
    .toISOString();

  let bookedAppointmentsForDate = await Appointment.find({
    Garage: garageId,
    $and: [
      { Datetime: { $gte: new Date(testDate) } },
      { Datetime: { $lt: new Date(nextDate) } },
    ],
  });
  // console.log({ bookedAppointmentsForDate });
  bookedAppointmentsForDate = bookedAppointmentsForDate.map((app) =>
    // moment.utc(app.Datetime).format("HH:mm")
    moment(app.Datetime).format("HH:mm")
  );

  let uniqueBookedAppointmentsForDate = [];

  var bookedAppointmentsSortedByTimeAndCount = bookedAppointmentsForDate.reduce(
    function (p, c) {
      if (c in p) {
        p[c]++;
      } else {
        p[c] = 1;
      }
      return p;
    },
    {}
  );

  // console.log(bookedAppointmentsSortedByTimeAndCount);
  const garage = await Garage.findById(garageId);
  if (!garage) return [];
  let numOfAllowedAppointmentsPerTime =
    garage.Paths.filter((path) => path.Active === true).length * 2;

  for (var key of Object.keys(bookedAppointmentsSortedByTimeAndCount)) {
    if (
      bookedAppointmentsSortedByTimeAndCount[key] >=
      numOfAllowedAppointmentsPerTime
    )
      uniqueBookedAppointmentsForDate.push(key);
  }

  return uniqueBookedAppointmentsForDate;
};

const findFreeAppointmentsInDay = (
  bookedAppointments,
  startTimeMoment,
  endTimeMoment
) => {
  const recommendedAppointments = [];
  // console.log({ bookedAppointments });

  let currentTime = startTimeMoment;

  while (currentTime.isBefore(endTimeMoment)) {
    // console.log("currentTime", currentTime.format("HH:mm"));
    if (!bookedAppointments.includes(currentTime.format("HH:mm"))) {
      const addDate = currentTime.clone();
      recommendedAppointments.push(addDate);
      if (recommendedAppointments.length === 2) return recommendedAppointments;
    }
    currentTime.add(30, "minutes");
  }
  return recommendedAppointments;
};

router.post("/", async (req, res) => {
  const garage = await Garage.findById(req.body.GarageId);
  if (!garage) return res.status(400).send("Garage not exists");

  const activePaths = garage.Paths.filter((path) => path.Active === true);

  const numOfAllowedAppointmentsForEachTime = activePaths.length * 2; // every 30 minutes

  const existsAppointments = await Appointment.find({
    Datetime: req.body.Datetime,
    Garage: req.body.GarageId,
  });
  if (existsAppointments.length >= numOfAllowedAppointmentsForEachTime)
    return res.status(400).send("Appointment Datetime already booked");

  let newAppointmentPath = null;
  for (const path of activePaths) {
    const numOfAppointmentsOfCurrentPath = existsAppointments.filter((ea) =>
      ea.Path.equals(path._id)
    ).length;
    if (numOfAppointmentsOfCurrentPath !== 2) {
      newAppointmentPath = path;
      break;
    }
  }
  if (!newAppointmentPath)
    return res.status(400).send("No active path found for current appointment");

  const newAppointment = new Appointment({
    User: {
      FirstName: req.body.User.FirstName,
      LastName: req.body.User.LastName,
      Phone: req.body.User.Phone,
      Email: req.body.User.Email,
    },
    CarNumber: req.body.CarNumber,
    Datetime: req.body.Datetime,
    Garage: req.body.GarageId,
    GarageName: garage.Name,
    Path: newAppointmentPath._id,
    PathName: newAppointmentPath.Name,
  });
  await newAppointment.save();
  sendNewAppointmentEmail(newAppointment, garage);
  res.send({ Appointment: newAppointment });
});

router.put("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid appointemtn id");
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(400).send("Appointment not exists");

  const garage = await Garage.findById(req.body.GarageId);
  if (!garage) return res.status(400).send("Garage not exists");

  const appointmentPath = garage.Paths.find(
    (path) => path._id.toString() === appointment.Path._id.toString()
  );
  if (!appointmentPath) return res.status(400).send("Path not exists");

  let newAppointmentPath = appointmentPath;
  if (
    moment(appointment.Datetime).toISOString() !==
    moment(req.body.Datetime).toISOString()
  ) {
    const activePaths = garage.Paths.filter((path) => path.Active === true);

    const numOfAllowedAppointmentsForEachTime = activePaths.length * 2; // every 30 minutes

    const existsAppointments = await Appointment.find({
      Datetime: req.body.Datetime,
      Garage: req.body.GarageId,
    });

    if (
      existsAppointments.length >= numOfAllowedAppointmentsForEachTime &&
      moment(appointment.Datetime).toISOString() !==
        moment(req.body.Datetime).toISOString()
    )
      return res.status(400).send("Appointment Datetime already booked");

    for (const path of activePaths) {
      const numOfAppointmentsOfCurrentPath = existsAppointments.filter((ea) =>
        ea.Path.equals(path._id)
      ).length;
      if (numOfAppointmentsOfCurrentPath !== 2) {
        newAppointmentPath = path;
        break;
      }
    }
    if (!newAppointmentPath)
      return res
        .status(400)
        .send("No active path found for current appointment");
  }

  appointment.User = {
    FirstName: req.body.User.FirstName,
    LastName: req.body.User.LastName,
    Phone: req.body.User.Phone,
    Email: req.body.User.Email,
  };
  appointment.CarNumber = req.body.CarNumber;
  appointment.Datetime = req.body.Datetime;
  appointment.Garage = req.body.GarageId;
  appointment.GarageName = garage.Name;
  appointment.Path = newAppointmentPath._id;
  appointment.PathName = newAppointmentPath.Name;

  await appointment.save();
  sendNewAppointmentEmail(appointment, garage);
  res.send({ Appointment: appointment });
});

module.exports = router;
