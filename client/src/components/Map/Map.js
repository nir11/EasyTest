import React, { useEffect, useState } from 'react'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useSelector } from 'react-redux';

import './map.css'

const containerStyle = {
    width: '100%',
    height: '600px'
};

const MyMap = ({ lat, setLat, lng, setLng, center, setCenter }) => {

    const [isGargeSelected, setIsGargeSelected] = useState(false)

    const garages = useSelector((state) => state.garagesReducer.garages)


    useEffect(() => {
        console.log('garages', garages);
    }, [garages])


    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(Number(center));
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    useEffect(() => {
        console.log("lng", lng);
        console.log("lat", lat);
    }, [lat, lng])

    return isLoaded && garages != undefined ?
        (
            <GoogleMap
                mapContainerStyle={containerStyle}
                // center={center}
                defaultZoom={20}
                zoom={7}
                onLoad={onLoad}
                onUnmount={onUnmount}
                defaultCenter={{ lat: lat, lng: lng }}
                center={{ lat: lat, lng: lng }}

            >
                { /* Child components, such as markers, info windows, etc. */}

                {
                    garages.map(garage => {
                        // console.log('garage', garage);

                        return <React.Fragment key={garage._id}>


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
                                    setLat(garage.Latitude)
                                    setLng(garage.Longitude)
                                    setIsGargeSelected(true)
                                    // props.setZoom(18)
                                }}

                            // icon={{
                            //     url: `../images/atm.jpg`,
                            //     scaledSize: new window.google.maps.Size(15, 25)
                            // }}
                            />


                            {
                                isGargeSelected &&
                                <InfoWindow
                                    position={{
                                        // lat: Number(garage.Latitude),
                                        // lng: Number(garage.Longitude),
                                        lat,
                                        lng
                                    }}
                                    onCloseClick={() => {
                                        setIsGargeSelected(false)
                                    }}

                                >
                                    <div className='infoWindow'>

                                        {/* <h2>{garage.Name}</h2> */}
                                        <p><b>{garage.Name}</b></p>
                                        <p> שעות פתיחה</p>

                                        {
                                            garage.WorkDays.map(w =>
                                                <p key={w.DayIndex}>{w.DayIndex}: {w.StartTime} - {w.EndTime}</p>
                                            )}
                                        {/* <p>{selectedATM.ATM_Address} | {selectedATM.ATM_Location}</p>
                                <p>{selectedATM.ATM_Type}</p> */}

                                    </div>

                                </InfoWindow>
                            }

                        </React.Fragment>

                    })

                }
                <></>
            </GoogleMap>
        ) : <>
        </>
}

export default React.memo(MyMap)