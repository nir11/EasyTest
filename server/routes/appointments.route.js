const router = require("express").Router();
const Appointment = require("../schemas/appointments/appointments.schema");
const Garage = require("../schemas/garages/garages.schema");
const moment = require("moment");
const { sendEmail } = require("../utils/email");

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

router.get("/recommended", async (req, res) => {
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
            Distance: i + 1,
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
    allGaragesRecommendedAppointments
  );

  res.send({ Recommendations });
});

const calculateBestRecommendedAppointments = (garagesRecs) => {
  const result = [];
  let bestAppointment = null;
  let secondBestAppointment = null;

  garagesRecs.forEach((garagesRec) => {
    garagesRec.Appointments.forEach((appointment) => {
      // console.log({ appointment });
      const minutesToAppointment = moment().diff(appointment, "minutes");
      console.log({ minutesToAppointment });
      console.log("garagesRec.DistanceRank", garagesRec.DistanceRank);
      const appointmentScore =
        parseInt(garagesRec.DistanceRank) + minutesToAppointment;

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
  return result;
};

const findNextFreeAppointmentOfGarage = async (garageId) => {
  let recommendedAppointments = [];
  const date = moment();
  const garage = await Garage.findOne({ _id: garageId });
  if (!garage) return null;
  // console.log({ garage });

  let dateIndexOfWeek = date.day() + 1;
  // console.log({ dateIndexOfWeek });

  let count = 1;
  while (count !== 7) {
    const bookedAppointmentOfDate = await getBookedAppointmentsOfDay(
      date,
      garage._id
    );
    // console.log({ bookedAppointmentOfDate });

    const isDayIndexExistsForGarage = garage.WorkDays[count - 1];
    if (!isDayIndexExistsForGarage) continue;

    const startTimeOfDate = garage.WorkDays[count - 1].StartTime;
    const endTimeOfDate = garage.WorkDays[count - 1].EndTime;

    recommendedAppointments = findFreeAppointmentsInDay(
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
    count++;
    date = date.add(1, "days");
  }
  return recommendedAppointments;
};

const getBookedAppointmentsOfDay = async (date, garageId) => {
  // console.log({ date });
  const testDate = date
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .local()
    .toISOString();
  const nextDate = date
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

const findFreeAppointmentsInDay = (bookedAppointments, startTime, endTime) => {
  const recommendedAppointments = [];
  let date = moment().format("YYYY-MM-DD"); //"2017-03-13";
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
