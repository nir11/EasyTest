import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import MyDatePicker from './DatePicker'

// import './form.scss'

const MyForm = () => {

    const [city, setCity] = useState('')
    const [selectedGagrage, setSelectedGagrage] = useState("")
    const garages = [
        {
            id: 1,
            name: "מ.מ.מ בדיקות רכב ורישוי",
            days: [
                {
                    day: 'Sunday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: true
                },
                {
                    day: 'Monday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: true
                },
                {
                    day: 'Tuesday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: true
                },
                {
                    day: 'Wendsday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: true
                },
                {
                    day: 'Thursday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: true
                },
                {
                    day: 'Friday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: false
                },
                {
                    day: 'Saturday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: false
                },
            ]
        },
        {
            id: 2,
            name: "טסט ליין בעמ",
            days: [
                {
                    day: 'Sunday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: true
                },
                {
                    day: 'Monday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: true
                },
                {
                    day: 'Tuesday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: true
                },
                {
                    day: 'Wendsday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: true
                },
                {
                    day: 'Thursday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: true
                },
                {
                    day: 'Friday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: false
                },
                {
                    day: 'Saturday',
                    hours: {
                        startHour: 7.5,
                        endHour: 16.5
                    },
                    active: false
                },
            ]
        }
    ]
    return (
        <div>
            <Form>
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

                        {
                            garages.map(garage => {
                                return (
                                    <option key={garage.id} value={garage.id}>{garage.name}</option>
                                )
                            })
                        }
                    </select>
                </Form.Group>
                {
                    selectedGagrage != "" &&
                    <MyDatePicker
                        selectedGagrage={garages.filter(g => g.id == selectedGagrage)}
                    />
                }
                <br /> <br />

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <select className='form-control'>
                        <option>מוסך 1</option>
                        <option>מוסך 2</option>
                        <option>מוסך 3</option>
                        <option>מוסך 4</option>
                    </select>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div >
    )
}

export default MyForm