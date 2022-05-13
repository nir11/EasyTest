import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const MyDatePicker = ({ selectedGagrage }) => {
    const [startDate, setStartDate] = useState(new Date());

    let handleColor = (time) => {
        return time.getHours() > 7.5 && time.getHours() < 16.5 ? "text-error" : "text-success";
    };

    useEffect(() => {
        console.log('selectedGagrage', selectedGagrage[0].name);

    }, [selectedGagrage])

    let handleDays = (day) => {

    }



    return (
        <DatePicker
            className="form-control"
            placeholderText="בחר/י תאריך פנוי"
            selected={startDate}
            dayClassName={handleDays}
            showTimeSelect
            timeClassName={handleColor}
            onChange={(date) => setStartDate(date)}
        />


    )
}

export default MyDatePicker
