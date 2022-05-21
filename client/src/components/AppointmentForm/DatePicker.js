import React, { forwardRef, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";

//css
import "react-datepicker/dist/react-datepicker.css";
import "./form.scss";

//redux
import { useDispatch } from "react-redux";
import { getAppointments } from "../../redux/appointment/appointment-actions";

import he from "date-fns/locale/he";
registerLocale("he", he);

const MyDatePicker = ({
  selectedGagrage,
  setAppointmentDateTime,
  appointmentDateTime,
  setIsUserSelectedDate,
  isUserSelectedDate,
  disabled,
}) => {
  const [indexOfDay, setIndexOfDay] = useState(moment().weekday());
  const [excludeDatetimes, setExcludeDatetimes] = useState([]);
  const [minTime, setMinTime] = useState(new Date());
  const [maxTime, setMaxTime] = useState(new Date());
  const [isInit, setIsInit] = useState(false);

  const dispatch = useDispatch();

  const DatePickerButton = forwardRef(({ value, onClick }, ref) => (
    <>
      <button
        className={"appointment-date-button" + (disabled ? " disabled" : "")}
        onClick={onClick}
        ref={ref}
        type="button"
      >
        {!isUserSelectedDate ? "תאריך" : value}
        <i className="fas fa-calendar-alt"></i>
      </button>
    </>
  ));

  //when user selected a garage - initial datepicker input
  useEffect(() => {
    if (!disabled) {
      const today = new Date();
      changeMonthHandler(today);
    }
  }, [selectedGagrage]);

  //check if chosen day is part of avaiable days
  const isWeekday = (date) => {
    const day = date.getDay() + 1;
    return selectedGagrage[0].WorkDays.some((w) => w.DayIndex == day);
  };

  //when user selcted a day - update available times (min & max)
  const updateMinMaxDayTimes = (date) => {
    if (selectedGagrage[0].WorkDays[moment(date).weekday()]?.StartTime) {
      // console.log("found startTime in day");
      setMinTime(
        new Date(
          `08/05/2022 ${
            selectedGagrage[0].WorkDays[moment(date).weekday()].StartTime
          }`
        )
      );
    } else {
      // console.log("no found startTime in day");
      setMinTime(new Date(`08/05/2022 00:00`));
    }

    if (selectedGagrage[0].WorkDays[moment(date).weekday()]?.EndTime) {
      // console.log("found endTime in day");
      setMaxTime(
        moment(
          `08/05/2022 ${
            selectedGagrage[0].WorkDays[moment(date).weekday()].EndTime
          }`
        )
          .add(-15, "minutes")
          .toDate()
      );
    } else {
      // console.log("no found endTime in day");
      setMaxTime(new Date(`08/05/2022 00:00`));
    }
  };

  //when user selected a day
  const changeHandler = (date) => {
    updateMinMaxDayTimes(date);
    setIndexOfDay(moment(date).weekday());
    setAppointmentDateTime(date);
    setIsUserSelectedDate(true);
  };

  //when user changed a month
  const changeMonthHandler = (date) => {
    const garageId = selectedGagrage[0]._id;
    const month = moment(date).month() + 1;
    const year = moment(date).year();

    dispatch(getAppointments(garageId, year, month))
      .then((res) => {
        let results = [];
        results = res.ExcludeDatetime.map(
          (e) => new Date(moment(e, "DD/MM/YYYY HH:mm").local().format())
        );
        setExcludeDatetimes(results);
      })
      .catch((error) => alert(error));
  };

  return (
    <DatePicker
      onCalendarOpen={() => {
        if (!isInit) {
          updateMinMaxDayTimes(new Date());
          setIsInit(true);
        }
      }}
      locale="he"
      selected={appointmentDateTime}
      dateFormat="HH:mm  dd/MM/yyyy"
      onChange={changeHandler}
      onMonthChange={changeMonthHandler}
      timeFormat="HH:mm"
      showTimeSelect
      filterDate={isWeekday}
      timeIntervals={15}
      minDate={new Date()}
      minTime={disabled ? new Date() : minTime}
      maxTime={disabled ? new Date() : maxTime}
      excludeTimes={
        disabled
          ? []
          : excludeDatetimes.filter(
              (e) =>
                moment(e, "DD/MM/YYYY HH:mm").date() ==
                moment(appointmentDateTime).date()
            )
      }
      customInput={<DatePickerButton />}
    />
  );
};

export default MyDatePicker;