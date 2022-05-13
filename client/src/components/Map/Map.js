import React, { useEffect, useState } from 'react'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '600px',
    height: '600px'
};

const MyMap = ({ lat, setLat, lng, setLng, center, setCenter, garages }) => {

    const [isGargeSelected, setIsGargeSelected] = useState(false)
    // useEffect(() => {
    //     setLat(31.768318)
    //     setLng(35.213711)
    // }, [])


    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={7}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            { /* Child components, such as markers, info windows, etc. */}

            {
                garages.map(garage => {

                    return <React.Fragment key={garage.id}>

                        <Marker
                            animation={window.google.maps.Animation.DROP}
                            key={1}
                            position={{
                                lat: lat,
                                lng: lng,
                            }}

                            // key={result._id}
                            // position={{
                            //     lat: result.Y_Coordinate,
                            //     lng: result.X_Coordinate,
                            // }}

                            onClick={() => {
                                // setSelectedATM(result)
                                setLat(garage.lat)
                                setLng(garage.lng)
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
                                    lat: lat,
                                    lng: lng
                                }}
                                onCloseClick={() => {
                                    setIsGargeSelected(false)
                                }}

                            >
                                <div className='infoWindow'>

                                    <h2>{garage.name}</h2>
                                    <p><b>שעות פתיחה</b></p>
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
    ) : <></>
}

export default React.memo(MyMap)