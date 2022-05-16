import { MDBCard, MDBCol, MDBRow } from 'mdbreact';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Map from '../Map/Map';
import Spinner from '../Spinner.js/Spinner';

const Summary = () => {

    const appointment = useSelector((state) => state.appointmentReducer.appointment)
    const garages = useSelector((state) => state.garagesReducer.garages)
    const [showSpinner, setShowSpinner] = useState(true)
    const navigate = useNavigate()
    const [lat, setLat] = useState(null)
    const [lng, setLng] = useState(null)
    const [center, setCenter] = useState({
        lat,
        lng
    })
    useEffect(() => {
        const selectedGarage = garages.filter(g => g._id == appointment.Garage)
        console.log('selectedGarage', selectedGarage);

        if (selectedGarage.length == 0)
            navigate("/")

        else {

            setLat(selectedGarage[0].Latitude)
            setLng(selectedGarage[0].Longitude)

            setShowSpinner(false)
        }
    }, [appointment, garages])




    // const appointment = {
    //     "_id": "627e283973cac6b4c2a19414",
    //     "User": {
    //         "FirstName": "Nir",
    //         "LastName": "Almog",
    //         "Phone": "0502820404",
    //         "Email": "nir.almog90@gmail.com",
    //         "TZ": "1212121212",
    //         "_id": { "$oid": "627e283973cac6b4c2a19415" }
    //     },
    //     "CarNumber": "80269451",
    //     "Datetime": "2022-05-13T08:15:00.466+00:00",
    //     "Garage": "627e21090e5f3b0a0df6d274",
    //     "__v": 0
    // }

    return (
        <div className='container-fluid'>
            <div className='container'>
                <h1>פרטי התור</h1>

                <div>
                    {
                        !showSpinner ?
                            <MDBRow>

                                <MDBCol sm='12' style={{ border: "1px solid #fff", marginBottom: "20px" }}>

                                    <h2 className='text-center'>{appointment.User.FirstName} {appointment.User.LastName}</h2>
                                    <h3 className='text-center'> {moment(appointment.Datetime).format("DD/MM/YYYY HH:mm")}</h3>
                                    <br />
                                    <h4 className='text-center'>{garages.filter(g => g._id == appointment.Garage)[0].Name}</h4>
                                    <div className='row text-center'>
                                        <div className='col-sm-6'>
                                            <p>טלפון: {appointment.User.Phone} </p>
                                            <p>דואר אלקטרוני: {appointment.User.Email} </p>
                                        </div>

                                        <div className='col-sm-6'>
                                            <p>ת.ז: {appointment.User.TZ} </p>
                                            <p>מספר מכונית: {appointment.CarNumber} </p>
                                        </div>
                                    </div>



                                </MDBCol>

                                <MDBCol sm='12' className='flex'>
                                    <Map
                                        lat={Number(lat)}
                                        setLat={setLat}
                                        lng={Number(lng)}
                                        setLng={setLng}
                                        center={center}
                                        setCenter={setCenter}
                                        idOfGarage={appointment.Garage}
                                    />
                                </MDBCol>
                            </MDBRow>

                            : <Spinner />
                    }

                </div>
            </div>
        </div >
    )
}

export default Summary