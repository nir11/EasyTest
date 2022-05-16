import React, { useEffect, useState } from "react";
import Geolocation from "../../components/Geolocation/Geolocation";
import Map from "../../components/Map/Map";
import RecommendedAppointment from "../../components/RecommendedAppointment/RecommendedAppointment";

const Location = () => {

  const [isUserAllowedLocation, setIsUserAllowedLocation] = useState(false)
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  // const [center, setCenter] = useState({
  //   lat,
  //   lng,
  // });

  useEffect(() => {

  }, [])

  return (
    <div className="container-fluid">
      <div className="container">

        <h1> תורים מומלצים {isUserAllowedLocation && "על בסיס מיקומך"}</h1>

        <Geolocation setLat={setLat} setLng={setLng} setIsUserAllowedLocation={setIsUserAllowedLocation} />
        <RecommendedAppointment
          lat={lat}
          lng={lng}
          isUserAllowedLocation={isUserAllowedLocation}
        />


        {/* <Map
                lat={lat}
                setLat={setLat}
                lng={lng}
                setLng={setLng}
                center={center}
                setCenter={setCenter}
            /> */}
      </div>
    </div>
  );
};

export default Location;
