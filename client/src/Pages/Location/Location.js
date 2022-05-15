import React, { useEffect, useState } from "react";
import Geolocation from "../../components/Geolocation/Geolocation";
import Map from "../../components/Map/Map";
import RecommendedAppointment from "../../components/RecommendedAppointment/RecommendedAppointment";

const Location = () => {
  //set to lat & lng of Jerusalem
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [center, setCenter] = useState({
    lat,
    lng,
  });

  return (
    <div className="container-fluid">
      <div className="container">
        <h1>תורים מומלצים</h1>

        <Geolocation setLat={setLat} setLng={setLng} />
        {lat != null && lng != null ? (
          <RecommendedAppointment lat={lat} lng={lng} />
        ) : (
          <p>אנא הפעל מיקום כדי לקבל תורים מומלצים עבורך</p>
        )}

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
