import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { createAppointment } from '../../redux/appointment/appointment-actions'
import { getGarages } from '../../redux/garages/garages-actions'
import MyDatePicker from './DatePicker'

// import './form.scss'

const MyForm = () => {

    const [city, setCity] = useState('')
    const [selectedGagrage, setSelectedGagrage] = useState("")

    //form fields
    const [appointmentDateTime, setAppointmentDateTime] = useState(new Date());
    const [id, setId] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [carNumber, setCarNumber] = useState("")
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

        dispatch(createAppointment(data))
            .then(() => {
                alert("התור נשמר בהצלחה!")
                document.location.reload()
            })
            .catch(error => alert(error))
    }
    return (
        <div>
            <Form onSubmit={submitForm}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>שם עיר</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="הקלידו עיר..."
                        onChange={e => setCity(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <select className='form-control' onChange={e => setSelectedGagrage(e.target.value)}>
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
                    />
                }
                <br /> <br />
                <p>{`${appointmentDateTime}`}</p>

                <input type={"number"}
                    className='form-control'
                    placeholder='תעודת זהות'
                    value={id}
                    onChange={e => setId(e.target.value)}
                    required
                />
                <br />

                <input type={"text"}
                    className='form-control'
                    placeholder='שם פרטי'
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                />
                <br />
                <input type={"text"}
                    className='form-control'
                    placeholder='שם משפחה'
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                />
                <br />

                <input type={"tel"}
                    className='form-control'
                    placeholder='טלפון'
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                />
                <br />

                <input type={"email"}
                    className='form-control'
                    placeholder='דואר אלקטרוני'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <br />

                <input type={"number"}
                    className='form-control'
                    placeholder='מספר האוטו'
                    value={carNumber}
                    onChange={e => setCarNumber(e.target.value)}
                    required
                />
                <br />

                <br />
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div >
    )
}

export default MyForm