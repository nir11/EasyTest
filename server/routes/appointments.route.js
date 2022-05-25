const router = require("express").Router();
const Appointment = require("../schemas/appointments/appointments.schema");
const Garage = require("../schemas/garages/garages.schema");
const moment = require("moment");
const { sendNewAppointmentEmail } = require("../utils/email");
const geolib = require("geolib");

router.get("/", async (req, res) => {
  const appointments = await Appointment.find();
  res.send({ appointments });
});

router.post("/email", (req, res) => {
  e;
  sendNewAppointmentEmail({});
  res.send("done");
});

router.get("/:garage/:year/:month", async (req, res) => {
  try {
    const month = parseInt(req.params?.month);
    if (month < 1 || month > 12) return res.status(400).send("Invalid month");

    let startDate = moment({
      year: parseInt(req.params.year),
      month: month - 1,
      day: 1,
    });

    let endDate = moment({
      year: parseInt(req.params.year),
      month: month,
      day: 1,
    });

    const bookedAppointments = await Appointment.find({
      Garage: req.params.garage,
      $and: [{ Datetime: { $gte: startDate } }, { Datetime: { $lt: endDate } }],
      // $expr: { $eq: [{ $month: "$Datetime" }, req.params.month] },
      // $expr: { $eq: [{ $year: "$Datetime" }, req.params.year] },
    });
    // console.log({ bookedAppointments });

    let ExcludeDatetime = [
      ...new Set(
        bookedAppointments.map((app) =>
          moment(app.Datetime).format("DD/MM/YYYY HH:mm")
        )
      ),
    ];
    // console.log({ ExcludeDatetime });

    let todayPastTime = [];
    const minutesToAdd = 15;

    const currentMonth = moment().month() + 1;
    if (currentMonth === parseInt(req.params?.month)) {
      let time = moment().startOf("day");
      const nowPlus30Minutes = moment().add(30, "minutes");
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
      const reminder = 15 - (start.minute() % 15);
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
  return bookedAppointmentsForDate;
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
    currentTime.add(15, "minutes");
  }
  return recommendedAppointments;
};

router.post("/", async (req, res) => {
  const garage = await Garage.findById(req.body.GarageId);
  if (!garage) return res.status(400).send("Garage not exists");

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
  sendNewAppointmentEmail(newAppointment, garage);
  res.send({ Appointment: newAppointment });
});

module.exports = router;
