import moment from "moment";
import React, { forwardRef, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
//redux
import { getAppointments } from "../../redux/appointment/appointment-actions";
import "./form.scss";

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
  const dispatch = useDispatch();
  const [indexOfDay, setIndexOfDay] = useState(moment().weekday());
  const [excludeDatetimes, setExcludeDatetimes] = useState([]);
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
  // const appointmentTimes = useSelector(
  //   (state) => state.appointmentReducer.appointmentTimes
  // );

  // let handleColor = (time) => {
  //     return time.getHours() > 7.5 && time.getHours() < 16.5 ? "text-error" : "text-success";
  // };

  useEffect(() => {
    if (!disabled) {
      const today = new Date();
      changeMonthHandler(today);
      // setIndexOfDay(moment(today).weekday());
    }
  }, [selectedGagrage]);

  const isWeekday = (date) => {
    const day = date.getDay() + 1;
    return selectedGagrage[0].WorkDays.some((w) => w.DayIndex == day);
  };

  const changeHandler = (date) => {
    setIndexOfDay(moment(date).weekday());
    setAppointmentDateTime(date);
    setIsUserSelectedDate(true);
  };

  const changeMonthHandler = (date) => {
    console.log({ indexOfDay });
    console.log("date", date);
    console.log({ selectedGagrage });
    const garageId = selectedGagrage[0]._id;
    const month = moment(date).month() + 1;
    const year = moment(date).year();

    dispatch(getAppointments(garageId, year, month))
      .then((res) => {
        console.log("res", res);
        let results = [];
        results = res.ExcludeDatetime.map(
          (e) => new Date(moment(e, "DD/MM/YYYY HH:mm"))
        );
        setExcludeDatetimes(results);
      })
      .catch((error) => alert(error));
  };

  // useEffect(() => {
  //     console.log('excludeDatetimes 0', moment(excludeDatetimes[0], "DD/MM/YYYY HH:mm").weekday());
  //     console.log('indexOfDay', indexOfDay);
  //     console.log(excludeDatetimes.filter(e => moment(e, "DD/MM/YYYY HH:mm").weekday() == indexOfDay));

  // }, [excludeDatetimes, indexOfDay])

  // useEffect(() => {
  //     console.log("selectedGagrage", selectedGagrage);
  // }, [selectedGagrage])

  return (
    <DatePicker
      locale="he"
      // className="form-control"
      // placeholderText="בחר/י תאריך פנוי"
      selected={appointmentDateTime}
      dateFormat="HH:mm  dd/MM/yyyy"
      // timeClassName={handleColor}
      onChange={changeHandler}
      onMonthChange={changeMonthHandler}
      // onYearChange
      // onMonthChange
      // shouldCloseOnSelect={false}
      timeFormat="HH:mm"
      showTimeSelect
      filterDate={isWeekday}
      timeIntervals={15}
      minDate={new Date()}
      // minDate={moment().toDate()}
      minTime={
        disabled
          ? new Date()
          : new Date(
              `08/05/2022 ${selectedGagrage[0].WorkDays[indexOfDay].StartTime}`
            )
      }
      maxTime={
        disabled
          ? new Date()
          : new Date(
              moment(
                `08/05/2022 ${selectedGagrage[0].WorkDays[indexOfDay].EndTime}`
              )
                .add(-15, "minutes")
                .toDate()
            )
      }
      // minTime={new Date(`08/05/2022 07:00`)}
      // maxTime={new Date(`08/05/2022 16:00`)}
      excludeTimes={
        disabled
          ? []
          : excludeDatetimes.filter(
              (e) => moment(e, "DD/MM/YYYY HH:mm").weekday() == indexOfDay
            )
      }
      customInput={<DatePickerButton />}

      // excludeTimes={appointmentTimes.map(a => moment(a, 'YYYY-MM-DD')._i)}
    />
  );
};

export default MyDatePicker;
