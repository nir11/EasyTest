import React, { useState } from "react";

//components
import Geolocation from "../../components/Geolocation/Geolocation";
import RecommendedAppointment from "../../components/RecommendedAppointment/RecommendedAppointment";

const Location = () => {
  const [isUserAllowedLocation, setIsUserAllowedLocation] = useState(false);
  const [isSharingLocationTested, setIsSharingLocationTested] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  return (
    <div className="container-fluid">
      <div className="container">
        <h1> תורים מומלצים {isUserAllowedLocation && "על בסיס מיקומך"}</h1>
        {!isUserAllowedLocation && (
          <>
            <p>
              לקבלת המלצות בהתאם למיקומך אנא אפשר שיתוף מיקום ולחץ לרענון{" "}
              <i
                className="fas fa-redo"
                onClick={() => window.location.reload()}
              ></i>
            </p>
          </>
        )}

        <Geolocation
          setLat={setLat}
          setLng={setLng}
          setIsUserAllowedLocation={setIsUserAllowedLocation}
          setIsSharingLocationTested={setIsSharingLocationTested}
          isUserAllowedLocation={isUserAllowedLocation}
        />

        {isSharingLocationTested && (
          <RecommendedAppointment
            lat={lat}
            lng={lng}
            isUserAllowedLocation={isUserAllowedLocation}
            isSharingLocationTested={isSharingLocationTested}
          />
        )}
      </div>
    </div>
  );
};

export default Location;
