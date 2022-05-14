import React, { useState } from 'react'
import MyForm from '../../components/Form/Form'
import Summary from '../../components/Summary/Summary'

const Home = () => {

    const [step, setStep] = useState(1)
    const [appointmentData, setAppointmentData] = useState([])
    return (
        <div className='container-fluid'>
            <div className='container card'>
                <h1>קביעת תור לטסט לרכב</h1>

                {
                    step == 1 ?
                        <MyForm
                            setStep={setStep}
                            setAppointmentData={setAppointmentData}
                        />
                        : step == 2
                        && <Summary />
                }
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