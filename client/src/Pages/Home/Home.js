import React, { useEffect } from "react";
import { MDBAnimation } from "mdbreact";

import AppointmentForm from "../../components/AppointmentForm/AppointmentForm";
import { useParams } from "react-router-dom";

const Home = () => {
  const { appointmentId } = useParams();

  return (
    <div className="container-fluid">
      <div className="container">
        <MDBAnimation type="fadeIn" delay="0.5s">
          <div className="row">
            <div className="col-lg-7" style={{ margin: "auto" }}>
              <h1>קביעת תור למבחן רישוי</h1>
              <br />

              <div className="home-form">
                <AppointmentForm appointmentId={appointmentId} />
              </div>
            </div>
          </div>
        </MDBAnimation>
      </div>
    </div>
  );
};

export default Home;
