import React, { useEffect, useState } from 'react'
import Geolocation from '../../components/Geolocation/Geolocation'
import Map from '../../components/Map/Map'
import Api from '../../utilis/Api'

const Location = () => {

    //set to lat & lng of Jerusalem 
    const [lat, setLat] = useState(31.768318)
    const [lng, setLng] = useState(35.213711)
    const [center, setCenter] = useState({
        lat,
        lng
    })

    useEffect(() => {
        Api.get(`garages`)
            .then((res) => {
                if (res.request.status == 200) {
                    console.log('res', res);
                }
            })
            .catch(error => console.log(error))

    }, [])


    const garages = [
        {
            id: 1,
            name: "מ.מ.מ בדיקות רכב ורישוי",
            lat: 31.748754158296734,
            lng: 35.21171274479499
        }
    ]
    return (
        <div>
            <h1>Location</h1>

            <Geolocation
                setLat={setLat}
                setLng={setLng}
            // setCityKey={setCityKey}
            // setCityName={setCityName}
            />

            <Map
                lat={lat}
                setLat={setLat}
                lng={lng}
                setLng={setLng}
                center={center}
                setCenter={setCenter}
                garages={garages}
            />
        </div>
    )
}

export default Location