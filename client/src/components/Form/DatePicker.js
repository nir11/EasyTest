import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";

import moment from 'moment'

//redux
import { getAppointments } from "../../redux/appointment/appointment-actions";

const MyDatePicker = ({ selectedGagrage, setAppointmentDateTime }) => {

    const dispatch = useDispatch()
    const [indexOfDay, setIndexOfDay] = useState(0)

    const appointmentTimes = useSelector((state) => state.appointmentReducer.appointmentTimes)


    // let handleColor = (time) => {
    //     return time.getHours() > 7.5 && time.getHours() < 16.5 ? "text-error" : "text-success";
    // };

    const isWeekday = (date) => {
        const day = date.getDay() + 1;
        return selectedGagrage[0].WorkDays.some(w => w.DayIndex == day)
    };

    const changeHandler = (date) => {
        console.log('date', date);
        setIndexOfDay(date.getDay())
        setAppointmentDateTime(date)

        dispatch(getAppointments(selectedGagrage[0]._id, date.getDay()))
            .then((res) => {
                console.log('res', res);
            })
            .catch(error => alert(error))
    }

    useEffect(() => {
        console.log('appointmentTimes', appointmentTimes);

    }, [appointmentTimes])
    return (
        <>
            {
                selectedGagrage.length > 0 &&
                <DatePicker
                    // className="form-control"
                    // placeholderText="בחר/י תאריך פנוי"
                    //   selected={startDate}
                    showTimeSelect
                    // timeClassName={handleColor}
                    onChange={changeHandler}
                    // onYearChange
                    // onMonthChange
                    shouldCloseOnSelect={false}
                    filterDate={isWeekday}

                    timeIntervals={15}

                    minTime={new Date(`08/05/2022 ${selectedGagrage[0].WorkDays[indexOfDay].StartTime}`)}
                    maxTime={new Date(`08/05/2022 ${selectedGagrage[0].WorkDays[indexOfDay].EndTime}`)}
                    excludeTimes={[new Date("08/05/2022 11:30")]}
                // excludeTimes={appointmentTimes.map(a => moment(a, 'YYYY-MM-DD')._i)}
                />
            }

        </>

    )
}

export default MyDatePicker
