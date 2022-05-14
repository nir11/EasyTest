import React, { useEffect } from 'react'

//redux
import { useDispatch, useSelector } from 'react-redux'
import { getRecommendedAppointments } from '../../redux/appointment/appointment-actions'

import moment from 'moment'
import { Card, Accordion } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardTitle,
    MDBCardText,
    MDBCol
} from 'mdbreact';

const Calculate = ({ lat, lng }) => {
    const dispatch = useDispatch()

    const appointments = useSelector((state) => state.appointmentReducer.appointments)


    useEffect(() => {
        dispatch(getRecommendedAppointments({
            "Latitude": lat,
            "Longitude": lng
        }))
    }, [])

    useEffect(() => {
        console.log('appointments', appointments);
    }, [appointments])

    return (
        <div>
            <div className='row'>
                {
                    appointments.map((appointment, index) => {
                        return <MDBCol sm='12' key={index}>
                            <Card className='card' >
                                <Card.Body className='row'>
                                    <div className='col-sm-6'>
                                        <Card.Title>{appointment.Name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">מרחק: {appointment.Distance} ק"מ</Card.Subtitle>
                                        <Card.Text>
                                            <p>תאריך: {moment(appointment.Datetime).format("DD/MM/YYYY")} </p>
                                            <p>שעה: {moment(appointment.Datetime).format("HH:mm")} </p>
                                        </Card.Text>
                                    </div>
                                    <div className='col-sm-6 flex'>
                                        {/* <p>הזמנת תור</p> */}
                                        <Link to={"/"}>הזמנת תור <i className="fas fa-angle-double-left"></i></Link>
                                    </div>

                                    {/* 
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header></Accordion.Header>
                                            <Accordion.Body>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                                                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                                                est laborum.
                                            </Accordion.Body>
                                        </Accordion.Item>

                                    </Accordion> */}

                                </Card.Body>
                            </Card>
                        </MDBCol>
                    })

                }

            </div>

        </div >

    )
}

export default Calculate