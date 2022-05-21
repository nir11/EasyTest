import React, { useEffect, useState } from 'react'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useSelector } from 'react-redux';

import './map.css'

const containerStyle = {
    width: '100%',
    height: '600px'
};

const MyMap = ({ lat, setLat, lng, setLng, idOfGarage, zoom, setZoom, showInfoWindow, containerStyleModal }) => {

    const [isGargeSelected, setIsGargeSelected] = useState(false)
    const [showInfoWindowState, setShowInfoWindowState] = useState(false)
    const garages = useSelector((state) => state.garagesReducer.garages)
    const [selectedGarage, setSelectedGarage] = useState([])

    useEffect(() => {
        console.log('garages', garages);

        let selectedGarageToUpdate = garages.filter(g => g._id == idOfGarage)
        setLat(Number(selectedGarageToUpdate[0].Latitude))
        setLng(Number(selectedGarageToUpdate[0].Longitude))
        setZoom(12)
        setSelectedGarage(selectedGarageToUpdate)



    }, [idOfGarage])

    useEffect(() => {
        if (showInfoWindow)
            setShowInfoWindowState(true)
        else
            setShowInfoWindowState(false)
    }, [showInfoWindow])

    // useEffect(() => {
    //     setZoom(7.5)
    // }, [map])
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY
    })

    const [map, setMap] = React.useState(null)

    // const onLoad = React.useCallback(function callback(map) {
    //     const bounds = new window.google.maps.LatLngBounds(Number(center));
    //     map.fitBounds(bounds);
    //     setMap(map)
    // }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    // useEffect(() => {
    //     console.log("lng", lng);
    //     console.log("lat", lat);
    // }, [lat, lng])

    return isLoaded && selectedGarage.length > 0 ?
        (
            <GoogleMap
                mapContainerStyle={containerStyleModal != undefined ? containerStyleModal : containerStyle}
                // onLoad={onLoad}
                onUnmount={onUnmount}
                dire
                defaultZoom={zoom}
                zoom={zoom}
                defaultCenter={{ lat: lat, lng: lng }}
                center={{ lat: lat, lng: lng }}

            >
                { /* Child components, such as markers, info windows, etc. */}

                {
                    selectedGarage.map(garage => {
                        // console.log('garage', garage);

                        return <React.Fragment key={garage._id} >


                            <Marker
                                animation={window.google.maps.Animation.DROP}
                                position={{
                                    // lat: Number(garage.Latitude),
                                    // lng: Number(garage.Longitude),
                                    lat,
                                    lng
                                }}

                                onClick={() => {
                                    // setSelectedATM(result)
                                    setLat(Number(garage.Latitude))
                                    setLng(Number(garage.Longitude))
                                    setIsGargeSelected(true)
                                    setZoom(18)
                                    setShowInfoWindowState(true)
                                }}

                            // icon={{
                            //     url: `../images/atm.jpg`,
                            //     scaledSize: new window.google.maps.Size(15, 25)
                            // }}
                            />


                            {
                                (isGargeSelected || showInfoWindowState) &&
                                <InfoWindow
                                    position={{
                                        // lat: Number(garage.Latitude),
                                        // lng: Number(garage.Longitude),
                                        lat,
                                        lng
                                    }}
                                    onCloseClick={() => {
                                        setIsGargeSelected(false)
                                        setShowInfoWindowState(false)
                                    }}

                                >
                                    <div className='infoWindow'>

                                        {/* <h2>{garage.Name}</h2> */}
                                        <p><b>{garage.Name}</b></p>
                                        <p> שעות פתיחה:</p>
                                        <table>
                                            <tbody>
                                                {
                                                    garage.WorkDays.map(w =>
                                                        <tr key={w.DayIndex}>

                                                            <td>
                                                                {
                                                                    w.DayIndex == 1 ? "ראשון" : w.DayIndex == 2 ? "שני" : w.DayIndex == 3 ? "שלישי" : w.DayIndex == 4 ? "רביעי" : w.DayIndex == 5 ? "חמישי" : w.DayIndex == 6 ? "שישי" : ""
                                                                }
                                                                :</td>

                                                            <td>&nbsp;
                                                                {w.StartTime} - {w.EndTime}
                                                            </td>

                                                        </tr>
                                                    )}

                                            </tbody>
                                        </table>
                                    </div>

                                </InfoWindow>
                            }

                        </React.Fragment>

                    })

                }
                <></>
            </GoogleMap >
        ) : <>
        </>
}

export default React.memo(MyMap)