const router = require("express").Router();
const Appointment = require("../schemas/appointments/appointments.schema");
const Garage = require("../schemas/garages/garages.schema");
const moment = require("moment");
const { sendEmail } = require("../utils/email");
const geolib = require("geolib");

router.get("/", async (req, res) => {
  const appointments = await Appointment.find();
  res.send({ appointments });
});

router.post("/email", (req, res) => {
  sendEmail(req.body.Subject, req.body.Body, req.body.Email);
  res.send("done");
});

router.get("/:garage/:year/:month", async (req, res) => {
  try {
    let month = parseInt(req.params?.month);
    if (month < 1 || month > 12) return res.status(400).send("Invalid month");
    const bookedAppointments = await Appointment.find({
      Garage: req.params.garage,
      $expr: { $eq: [{ $month: "$Datetime" }, req.params.month] },
      $expr: { $eq: [{ $year: "$Datetime" }, req.params.year] },
    });

    // const ll = bookedAppointments.map((app) =>
    //   moment(app.Datetime).local().format("DD/MM/YYYY HH:mm")
    // );
    // console.log({ ll });
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

const calculateDistanceToGarage = (userLocation, garageLocation) => {
  console.log("userLocation", userLocation)
  console.log("garageLocation", garageLocation)
  // const myLocation = {
  //   latitude: 32.38996950755073,
  //   longitude: 34.98740266931584,
  // };
  // const garageLocation = {
  //   // hadera
  //   // latitude: 32.43479838895164,
  //   // longitude: 34.92068461774575,

  //   // netanua
  //   latitude: 32.32840407146948,
  //   longitude: 34.864968630378215,
  // };
  const distance =
    geolib.getPreciseDistance(userLocation, garageLocation) / 1000;
  const distanceInKm = distance.toFixed(1)
  console.log('distanceInKm', distanceInKm)
  return distanceInKm
};

router.put("/recommended", async (req, res) => {
  // calculateDistanceToGarage();
  const userLocation = {
    latitude: req.body.Latitude,
    longitude: req.body.Longitude,
  };
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
            Distance: calculateDistanceToGarage(userLocation, {
              latitude: garage.Latitude,
              longitude: garage.Longitude,
            }),
            DistanceRank: i + 1,
            Appointments: recAppointments,
          });
          // console.log({ allGaragesRecommendedAppointments });
        }
      } catch (error) {
        console.log("error" + error);
      }
    })
  );
  const Recommendations = calculateBestRecommendedAppointments(
    userLocation,
    allGaragesRecommendedAppointments
  );

  res.send({ Recommendations });
});

const calculateBestRecommendedAppointments = (userLocation, garagesRecs) => {
  const result = [];
  let scores = [];
  let bestAppointment = null;
  let secondBestAppointment = null;

  garagesRecs.forEach((garagesRec) => {
    garagesRec.Appointments.forEach((appointment) => {
      // console.log({ appointment });
      const minutesToAppointment = appointment.diff(moment(), "minutes");
      // console.log({ minutesToAppointment });
      // console.log("garagesRec.DistanceRank", garagesRec.DistanceRank);
      const appointmentScore =
        parseInt(garagesRec.DistanceRank) + minutesToAppointment;
      scores.push(appointmentScore);
      if (!bestAppointment) {
        bestAppointment = {
          Id: garagesRec.Id,
          Name: garagesRec.Name,
          Distance: garagesRec.Distance,
          Score: appointmentScore,
          Datetime: appointment,
        };
        return;
      }
      if (!secondBestAppointment) {
        // console.log({ appointmentScore });
        // console.log("bestAppointment.Score", bestAppointment.Score);
        if (
          appointmentScore < bestAppointment.Score ||
          (appointmentScore === bestAppointment.Score &&
            appointment.Distance < bestAppointment.Distance)
        ) {
          secondBestAppointment = { ...bestAppointment };
          bestAppointment = {
            Id: garagesRec.Id,
            Name: garagesRec.Name,
            Distance: garagesRec.Distance,
            Score: appointmentScore,
            Datetime: appointment,
          };
          return;
        }
        secondBestAppointment = {
          Id: garagesRec.Id,
          Name: garagesRec.Name,
          Distance: garagesRec.Distance,
          Score: appointmentScore,
          Datetime: appointment,
        };
        return;
      }

      if (appointment.Score <= secondBestAppointment.Score) {
        if (
          appointmentScore < bestAppointment.Score ||
          (appointmentScore === bestAppointment.Score &&
            appointment.Distance < bestAppointment.Distance)
        ) {
          secondBestAppointment = { ...bestAppointment };
          bestAppointment = {
            Id: garagesRec.Id,
            Name: garagesRec.Name,
            Distance: garagesRec.Distance,
            Score: appointmentScore,
            Datetime: appointment,
          };
          return;
        }
        if (
          appointmentScore < secondBestAppointment.Score ||
          (appointmentScore === secondBestAppointment.Score &&
            appointment.Distance < secondBestAppointment.Distance)
        ) {
          secondBestAppointment = {
            Id: garagesRec.Id,
            Name: garagesRec.Name,
            Distance: garagesRec.Distance,
            Score: appointmentScore,
            Datetime: appointment,
          };
          return;
        }
      }
    });
  });
  // console.log({ bestAppointment });
  // console.log({ secondBestAppointment });
  if (bestAppointment) result.push(bestAppointment);
  if (secondBestAppointment) result.push(secondBestAppointment);
  console.log({ scores });
  return result;
};

const findNextFreeAppointmentOfGarage = async (garageId) => {
  let recommendedAppointments = [];
  let date = moment();
  // console.log({ date });
  const garage = await Garage.findOne({ _id: garageId });
  if (!garage) return null;
  // console.log({ garage });

  let dateIndexOfWeek = date.clone().day() + 1;
  // console.log({ dateIndexOfWeek });

  let dayIndex = moment().day() + 1;
  // console.log({ dayIndex });
  let count = 1;
  while (count !== 7) {
    console.log({ dayIndex });
    console.log({ date });
    const isDayIndexExistsForGarage = garage.WorkDays[dayIndex - 1];
    if (!isDayIndexExistsForGarage) {
      console.log("day not exists");
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

    let startTimeOfDate = garage.WorkDays[dayIndex - 1].StartTime;
    const endTimeOfDate = garage.WorkDays[dayIndex - 1].EndTime;

    // check if it's today
    const now = moment().format("YYYY-MM-DD");
    // console.log("date before inserting", date);
    // console.log(moment().isSame(date.format("YYYY-MM-DD"), "day"));
    if (moment().isSame(date.format("YYYY-MM-DD"), "day")) {
      startTimeOfDate = date.clone();
      const remainder = 15 - (startTimeOfDate.minute() % 15); // round to the next 15 min
      startTimeOfDate = moment(startTimeOfDate)
        .add(remainder, "minutes")
        .format("hh:mm");
      // console.log({ startTimeOfDate });
    }

    recommendedAppointments = findFreeAppointmentsInDay(
      date.clone().format("YYYY-MM-DD"),
      bookedAppointmentOfDate,
      startTimeOfDate,
      endTimeOfDate
    );

    // console.log({ recommendedAppointments });
    if (recommendedAppointments.length === 2) return recommendedAppointments;

    if (dateIndexOfWeek == 7) {
      dateIndexOfWeek = 1;
    } else {
      dateIndexOfWeek++;
    }
    // console.log({ dateIndexOfWeek });
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
    .local()
    .toISOString();
  const nextDate = date
    .clone()
    .add(1, "days")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .local()
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
    moment.utc(app.Datetime).format("HH:mm")
  );
  return bookedAppointmentsForDate;
};

const findFreeAppointmentsInDay = (
  date,
  bookedAppointments,
  startTime,
  endTime
) => {
  const recommendedAppointments = [];
  const startTimeMoment = moment(date + " " + startTime);
  const endTimeMoment = moment(date + " " + endTime);
  // console.log({ startTimeMoment });
  // console.log({ endTimeMoment });
  // console.log({ bookedAppointments });

  let currentTime = startTimeMoment;

  while (currentTime.isBefore(endTimeMoment)) {
    if (!bookedAppointments.includes(currentTime.format("hh:mm"))) {
      const addDate = currentTime.clone();
      recommendedAppointments.push(addDate);
      if (recommendedAppointments.length === 2) return recommendedAppointments;
    }
    currentTime.add(15, "minutes");
  }
  return recommendedAppointments;
};

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
