import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getGarages } from '../../redux/garages/garages-actions'
import MyDatePicker from './DatePicker'
import PersonalDetails from './PersonalDetails'

import { MDBInput } from 'mdbreact'

import { createAppointment } from '../../redux/appointment/appointment-actions'

// import './form.scss'

const MyForm = (setAppointmentData, setStep) => {

    const [city, setCity] = useState('')
    const [selectedGagrage, setSelectedGagrage] = useState("")
    const [id, setId] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [carNumber, setCarNumber] = useState("")

    //form fields
    const [appointmentDateTime, setAppointmentDateTime] = useState(new Date());

    const dispatch = useDispatch()

    const garages = useSelector((state) => state.garagesReducer.garages)


    useEffect(() => {
        dispatch(getGarages())
    }, [])


    const submitForm = (e) => {
        e.preventDefault();
        const data = {
            User: {
                "FirstName": firstName,
                "LastName": lastName,
                "Phone": phone,
                "Email": email,
                "TZ": "123"
            },
            "CarNumber": carNumber,
            "Datetime": appointmentDateTime,
            "GarageId": selectedGagrage
        }
        console.log('data', data);
        dispatch(createAppointment(data))
            .then(() => {
                alert("התור נשמר בהצלחה!")
                setAppointmentData(data)
                setStep(2)
            })
            .catch(error => alert(error))
    }


    return (
        <div>
            <Form onSubmit={submitForm}>

                <h2>בחירת מוסך</h2>
                <MDBInput label="* שם עיר" outline
                    group type={"text"}
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    icon="city"
                    required
                />

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <select className='form-control' onChange={e => setSelectedGagrage(e.target.value)} required>
                        <option value={0}>בחר/י מוסך</option>
                        {
                            garages != undefined &&
                            garages.map(garage => {
                                return (
                                    <option key={garage._id} value={garage._id}>{garage.Name}</option>
                                )
                            })
                        }
                    </select>
                </Form.Group>
                {
                    selectedGagrage != "" &&
                    <MyDatePicker
                        selectedGagrage={garages.filter(g => g._id == selectedGagrage)}
                        setAppointmentDateTime={setAppointmentDateTime}
                        appointmentDateTime={appointmentDateTime}
                    />
                }
                {/* <br /> <br /> */}
                {/* <p>{`${appointmentDateTime}`}</p> */}
                <hr />
                <PersonalDetails
                    id={id} setId={setId}
                    firstName={firstName} setFirstName={setFirstName}
                    lastName={lastName} setLastName={setLastName}
                    phone={phone} setPhone={setPhone}
                    email={email} setEmail={setEmail}
                    carNumber={carNumber} setCarNumber={setCarNumber}
                />

                <Button variant="primary" type="submit">
                    סיום
                </Button>
            </Form>



        </div >
    )
}

export default MyForm