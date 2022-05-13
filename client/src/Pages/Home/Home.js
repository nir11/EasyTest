import React, { useState } from 'react'
import MyForm from '../../components/Form/Form'

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


const Home = () => {

    const [startDate, setStartDate] = useState(new Date());
    const [hours, setHours] = useState(new Date())
    const [minutes, setMinutes] = useState("")

    return (
        <div className='container-fluid'>
            <div className='container'>
                <h1>EastTest</h1>
                <MyForm />
            </div>

            {/* <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                minTime={setHours(setMinutes(new Date(), 0), 17)}
                maxTime={setHours(setMinutes(new Date(), 30), 20)}
                dateFormat="MMMM d, yyyy h:mm aa"
            /> */}

        </div>
    )
}

export default Home