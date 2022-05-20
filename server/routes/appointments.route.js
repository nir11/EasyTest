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

    // console.log({ ll });
    const ExcludeDatetime = [
      ...new Set(
        bookedAppointments.map((app) =>
          moment(app.Datetime).format("DD/MM/YYYY HH:mm")
        )
      ),
    ];

    res.send({ ExcludeDatetime });
  } catch (err) {
    res.status(400).send("Error");
  }
});

const calculateDistanceToGarage = (userLocation, garageLocation) => {
  // console.log("userLocation", userLocation);
  // console.log("garageLocation", garageLocation);
  // const myLocation = {
  //   latitude: 32.38996950755073,
  //   longitude: 34.98740266931584,
  // };
  // const garageLocation = {
  //   // hadera
  //   // latitude: 32.43479838895164,
  //   // longitude: 34.92068461774575,

  //   // netanya
  //   latitude: 32.32840407146948,
  //   longitude: 34.864968630378215,
  // };
  const distance =
    geolib.getPreciseDistance(userLocation, garageLocation) / 1000;
  const distanceInKm = parseFloat(distance.toFixed(1));
  // console.log("distanceInKm", distanceInKm);
  return distanceInKm;
};

router.get("/free", async (req, res) => {
  const garages = await Garage.find();
  let allGaragesRecommendedAppointments = [];

  await Promise.all(
    garages.map(async (garage, i) => {
      try {
        const recAppointments = await findNextFreeAppointmentOfGarage(
          garage._id
        );
        // console.log({ recAppointments });
        if (recAppointments.length > 0) {
          allGaragesRecommendedAppointments.push({
            Id: garage._id,
            Name: garage.Name,
            Appointments: recAppointments,
            Address: garage.Address,
            City: garage.City,
          });
          // console.log({ allGaragesRecommendedAppointments });
        }
      } catch (error) {
        console.log("error" + error);
      }
    })
  );
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

  await Promise.all(
    garages.map(async (garage, i) => {
      try {
        const recAppointments = await findNextFreeAppointmentOfGarage(
          garage._id
        );
        // console.log({ recAppointments });
        if (recAppointments.length > 0) {
          allGaragesRecommendedAppointments.push({
            Id: garage._id,
            Name: garage.Name,
            Distance: calculateDistanceToGarage(userLocation, {
              latitude: garage.Latitude,
              longitude: garage.Longitude,
            }),
            DistanceRank: i + 1,
            Appointments: recAppointments,
            Address: garage.Address,
            City: garage.City,
          });
          // console.log({ allGaragesRecommendedAppointments });
        }
      } catch (error) {
        console.log("error" + error);
      }
    })
  );
  const Recommendations = calculateBestRecommendedAppointments(
    allGaragesRecommendedAppointments
  );

  res.send({ Recommendations });
});

const calculateBestRecommendedAppointments = (garagesRecs) => {
  const result = [];
  let scores = [];
  let bestAppointment = null;
  let secondBestAppointment = null;

  garagesRecs.forEach((garage) => {
    // console.log({ garage });
    garage.Appointments.forEach((appointment) => {
      console.log({ appointment });
      const minutesToAppointment = parseInt(
        appointment.diff(moment(), "minutes")
      );
      // console.log({ minutesToAppointment });
      // console.log("garagesRec.Distance", garagesRec.Distance);
      const appointmentScore = garage.Distance + minutesToAppointment;
      // console.log({ appointmentScore });
      scores.push(appointmentScore);
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
        // console.log("bestAppointment.Score", bestAppointment.Score);
        if (appointmentScore < result[0].Score) {
          result[1] = { ...bestAppointment };
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

      if (appointmentScore < result[1].Score) {
        if (appointmentScore < result[0].Score) {
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
  // console.log({ bestAppointment });
  // console.log({ secondBestAppointment });
  // if (bestAppointment) result.push(bestAppointment);
  // if (secondBestAppointment) result.push(secondBestAppointment);
  // console.log({ scores });
  return result;
};

const addNewRecommendedAppointment = (
  garage,
  appointment,
  appointmentScore
) => {
  return {
    Id: garage.Id,
    Name: garage.Name,
    Distance: garage.Distance,
    Score: appointmentScore,
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
    // console.log({ date });
    const isDayIndexExistsForGarage = garage.WorkDays[dayIndex - 1];
    if (!isDayIndexExistsForGarage) {
      // console.log("day not exists");
      date = date.clone().add(1, "days");
      dayIndex = date.clone().day() + 1;
      count++;
      continue;
    }
    const bookedAppointmentOfDate = await getBookedAppointmentsOfDay(
      date,
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
    // console.log({ endTimeOfDate });

    // check if it's today
    // console.log("date before inserting", date);
    // console.log(moment().isSame(date.format("YYYY-MM-DD"), "day"));
    // console.log({ date });
    const isDateIsToday = moment().isSame(date.format("YYYY-MM-DD"), "day");
    // console.log({ isDayIsToday });
    if (isDateIsToday) {
      const roundedUp = Math.ceil(moment().minute() / 15) * 15;
      startTimeOfDate = moment().add(2, "hours").minute(roundedUp);
    }
    // console.log({ startTimeOfDate });

    const recommendedAppointmentsInDay = findFreeAppointmentsInDay(
      date.clone().format("YYYY-MM-DD"),
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
    // dayIndex = date.clone().day() + 1;
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
  date,
  bookedAppointments,
  startTimeMoment,
  endTimeMoment
) => {
  const recommendedAppointments = [];

  // const startTimeMoment = moment(date + " " + startTime);
  // const endTimeMoment = moment(date + " " + endTime);
  // console.log({ startTimeMoment });
  // console.log({ endTimeMoment });
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
