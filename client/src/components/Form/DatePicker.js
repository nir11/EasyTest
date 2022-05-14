import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment"

//redux
import { getAppointments } from "../../redux/appointment/appointment-actions";

const MyDatePicker = ({ selectedGagrage, setAppointmentDateTime, appointmentDateTime }) => {

    const dispatch = useDispatch()
    const [indexOfDay, setIndexOfDay] = useState(0)
    const [excludeDatetimes, setExcludeDatetimes] = useState([])
    const appointmentTimes = useSelector((state) => state.appointmentReducer.appointmentTimes)


    // let handleColor = (time) => {
    //     return time.getHours() > 7.5 && time.getHours() < 16.5 ? "text-error" : "text-success";
    // };

    useEffect(() => {
        const today = new Date()
        changeMonthHandler(today)
        setIndexOfDay(moment(today).weekday() - 1)
    }, [])

    const isWeekday = (date) => {
        const day = date.getDay() + 1;
        return selectedGagrage[0].WorkDays.some(w => w.DayIndex == day)
    };

    const changeHandler = (date) => {
        console.log(date);
        setIndexOfDay(moment(date).weekday())
        setAppointmentDateTime(date)

    }

    const changeMonthHandler = (date) => {

        console.log('date', date);

        const garageId = selectedGagrage[0]._id;
        const month = moment(date).month() + 1;
        const year = moment(date).year();

        dispatch(getAppointments(garageId, year, month))
            .then((res) => {
                console.log('res', res);
                let results = []
                results = res.ExcludeDatetime.map(e => new Date(moment(e, "DD/MM/YYYY HH:mm")))

                setExcludeDatetimes(results)
            })
            .catch(error => alert(error))

    }

    // useEffect(() => {
    //     console.log('excludeDatetimes 0', moment(excludeDatetimes[0], "DD/MM/YYYY HH:mm").weekday());
    //     console.log('indexOfDay', indexOfDay);
    //     console.log(excludeDatetimes.filter(e => moment(e, "DD/MM/YYYY HH:mm").weekday() == indexOfDay));

    // }, [excludeDatetimes, indexOfDay])

    // useEffect(() => {
    //     console.log("selectedGagrage", selectedGagrage);
    // }, [selectedGagrage])
    return (
        <>
            {
                selectedGagrage.length > 0 &&
                <DatePicker
                    // className="form-control"
                    // placeholderText="בחר/י תאריך פנוי"
                    selected={appointmentDateTime}
                    showTimeSelect
                    // timeClassName={handleColor}
                    onChange={changeHandler}
                    onMonthChange={changeMonthHandler}
                    // onYearChange
                    // onMonthChange
                    shouldCloseOnSelect={false}
                    filterDate={isWeekday}
                    timeIntervals={15}

                    minTime={new Date(`08/05/2022 ${selectedGagrage[0].WorkDays[indexOfDay].StartTime}`)}
                    maxTime={new Date(`08/05/2022 ${selectedGagrage[0].WorkDays[indexOfDay].EndTime}`)}
                    // minTime={new Date(`08/05/2022 07:00`)}
                    // maxTime={new Date(`08/05/2022 16:00`)}
                    excludeTimes={excludeDatetimes.filter(e => moment(e, "DD/MM/YYYY HH:mm").weekday() == indexOfDay)}
                // excludeTimes={appointmentTimes.map(a => moment(a, 'YYYY-MM-DD')._i)}
                />
            }

        </>

    )
}

export default MyDatePicker
