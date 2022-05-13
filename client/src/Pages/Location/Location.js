import React, { useEffect, useState } from 'react'
import Geolocation from '../../components/Geolocation/Geolocation'
import Map from '../../components/Map/Map'

const Location = () => {

    //set to lat & lng of Jerusalem 
    const [lat, setLat] = useState(31.768318)
    const [lng, setLng] = useState(35.213711)
    const [center, setCenter] = useState({
        lat,
        lng
    })

    return (
        <div>
            <h1>Location</h1>

            <Geolocation
                setLat={setLat}
                setLng={setLng}
            />

            <Map
                lat={lat}
                setLat={setLat}
                lng={lng}
                setLng={setLng}
                center={center}
                setCenter={setCenter}
            />
        </div>
    )
}

export default Location