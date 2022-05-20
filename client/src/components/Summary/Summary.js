import { MDBCard, MDBCol, MDBRow } from 'mdbreact';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Map from '../Map/Map';
import Spinner from '../Spinner.js/Spinner';
import './summary.scss'
const Summary = () => {

    const appointment = useSelector((state) => state.appointmentReducer.appointment)
    const garages = useSelector((state) => state.garagesReducer.garages)
    const [showSpinner, setShowSpinner] = useState(true)
    const navigate = useNavigate()
    const [lat, setLat] = useState(null)
    const [lng, setLng] = useState(null)
    const [selectedGarage, setSelectedGarage] = useState([])
    const [center, setCenter] = useState({
        lat,
        lng
    })
    const [zoom, setZoom] = useState(7.5)
    useEffect(() => {
        const selectedGarageToUpdate = garages.filter(g => g._id == appointment.Garage)
        console.log('selectedGarage', selectedGarage);
        setSelectedGarage(selectedGarageToUpdate)

        if (Object.values(selectedGarageToUpdate).length == 0)
            navigate("/")

        else {

            setLat(selectedGarageToUpdate[0].Latitude)
            setLng(selectedGarageToUpdate[0].Longitude)

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

                                <MDBCol sm='6' className="summary-card">

                                    <h2 className='text-center'>{appointment.User.FirstName} {appointment.User.LastName}</h2>
                                    <h3 className='text-center'> {moment(appointment.Datetime).format("DD/MM/YYYY HH:mm")}</h3>
                                    <br />
                                    <h4 className='text-center'>{garages.filter(g => g._id == appointment.Garage)[0].Name}</h4>
                                    <h5 className='text-center'> {selectedGarage[0].Address} | {selectedGarage[0].City}</h5>
                                    <br />
                                    <div className='row text-center'>
                                        <div className='col-sm-6'>
                                            <p>טלפון: {appointment.User.Phone} </p>
                                            <p>דואר אלקטרוני: {appointment.User.Email} </p>
                                        </div>

                                        <div className='col-sm-6'>
                                            <p>ת.ז: {appointment.User.TZ} </p>
                                            <p>מספר רכב: {appointment.CarNumber} </p>
                                        </div>
                                    </div>



                                </MDBCol>

                                <MDBCol sm='6' className='flex map-container' >
                                    <Map
                                        lat={Number(lat)}
                                        setLat={setLat}
                                        lng={Number(lng)}
                                        setLng={setLng}
                                        center={center}
                                        setCenter={setCenter}
                                        idOfGarage={appointment.Garage}
                                        zoom={zoom}
                                        setZoom={setZoom}
                                        showInfoWindow={false}
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