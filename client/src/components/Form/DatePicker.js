import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const MyDatePicker = ({ selectedGagrage }) => {
  const [startDate, setStartDate] = useState(
    new Date("2022-05-15T12:08:08.007+00:00")
  );

  let handleColor = (time) => {
    return time.getHours() > 7.5 && time.getHours() < 16.5
      ? "text-error"
      : "text-success";
  };

  useEffect(() => {
    console.log("selectedGagrage", selectedGagrage[0].name);
  }, [selectedGagrage]);

  let handleDays = (day) => {};
  //   const isWeekday = (date) => {
  //     const day = getDay(date);
  //     return day !== 0 && day !== 6;
  //   };
  return (
    <DatePicker
      className="form-control"
      placeholderText="בחר/י תאריך פנוי"
      //   selected={startDate}
      dayClassName={handleDays}
      showTimeSelect
      timeClassName={handleColor}
      onChange={(date) => setStartDate(date)}
      shouldCloseOnSelect={false}
      //   filterDate={isWeekday}
      timeIntervals={15}
      //   minDate={new Date()}
      //   maxDate={new Date("2022-05-15T12:08:08.007+00:00")}
      includeDates={[new Date(), new Date("2022-05-15T12:08:08.007+00:00")]}
      includeTimes={[new Date("2022-05-15T12:15:08.007+00:00")]}
      //   openToDate={new Date("1993/09/28")}
    />
  );
};

export default MyDatePicker;
