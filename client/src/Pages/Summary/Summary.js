import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MDBCol, MDBRow } from 'mdbreact';
import moment from 'moment';

//redux
import { useSelector } from 'react-redux';

//components
import Spinner from '../../components/Spinner.js/Spinner';
import Map from '../../components/Map/Map';

//scss
import './summary.scss'

const Summary = () => {

    const [showSpinner, setShowSpinner] = useState(true)
    const [lat, setLat] = useState(null)
    const [lng, setLng] = useState(null)
    const [selectedGarage, setSelectedGarage] = useState([])
    const [zoom, setZoom] = useState(7.5)
    const [center, setCenter] = useState({
        lat,
        lng
    })

    //redux fields
    const appointment = useSelector((state) => state.appointmentReducer.appointment)
    const garages = useSelector((state) => state.garagesReducer.garages)

    const navigate = useNavigate()

    //when user goes to this page - initial selected garage and lat&lng
    useEffect(() => {

        const selectedGarageToUpdate = garages.filter(g => g._id == appointment.Garage)
        setSelectedGarage(selectedGarageToUpdate)

        //if user load this page directly - go to home page
        if (Object.values(selectedGarageToUpdate).length == 0)
            navigate("/")
        else {
            setLat(selectedGarageToUpdate[0].Latitude)
            setLng(selectedGarageToUpdate[0].Longitude)
            setShowSpinner(false)
        }
    }, [appointment, garages])

    return (
        <div className='container-fluid summary-wrapper'>
            <div className='container'>

                <h1>תור חדש נשמר בהצלחה!</h1>

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