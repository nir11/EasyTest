import React, { useEffect, useState } from "react";

//create your forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const Geolocation = ({
  setLat,
  setLng,
  isUserAllowedLocation,
  setIsUserAllowedLocation,
  setIsSharingLocationTested,
}) => {
  // call your hook here
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    document.querySelector("#find-me").addEventListener("click", geoFindMe);
    geoFindMe();
  }, []);

  const geoFindMe = async () => {
    console.log("go");
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");

    mapLink.href = "";
    mapLink.textContent = "";

    if (!navigator.geolocation) {
      // status.textContent = 'Geolocation is not supported by your browser';
      alert("Geolocation is not supported by your browser");
    } else {
      status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  function success(position) {
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLng(longitude);
    setLat(latitude);

    status.textContent = "";
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    // console.log(mapLink.href);
    // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    setIsUserAllowedLocation(true);
    setIsSharingLocationTested(true);
  }

  function error() {
    const status = document.querySelector("#status");

    status.textContent = "Unable to retrieve your location";
    // setLat(31.768318)
    // setLng(35.213711)
    setIsSharingLocationTested(true);
  }

  return (
    <div style={{ display: "none" }}>
      <button id="find-me">Show my location</button>
      <br />
      <p id="status"></p>
      <a id="map-link" target="_blank" rel="noreferrer"></a>
    </div>
  );
};
export default Geolocation;
