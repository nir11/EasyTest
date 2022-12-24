import React, { useEffect } from "react";
import { MDBAnimation } from "mdbreact";

import AppointmentForm from "../../components/AppointmentForm/AppointmentForm";
import { useParams } from "react-router-dom";
import "./home.scss";

const Home = () => {
  const { editAppointmentId } = useParams();

  return (
    <div className="container-fluid home-container">
      <div className="container">
        <MDBAnimation type="fadeIn" delay="0.5s">
          <div className="row home-header">
            <div className="col-lg-7" style={{ margin: "auto" }}>
              <h1>{editAppointmentId ? "עריכת" : "קביעת"} תור למבחן רישוי</h1>
              <br />

              <div className="home-form">
                <AppointmentForm
                  key={editAppointmentId ? editAppointmentId : "1"}
                  editAppointmentId={editAppointmentId}
                />
              </div>
            </div>
          </div>
        </MDBAnimation>
      </div>
    </div>
  );
};

export default Home;
