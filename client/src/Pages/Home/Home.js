import React, { useEffect } from "react";
import { MDBAnimation } from "mdbreact";

import AppointmentForm from "../../components/AppointmentForm/AppointmentForm";
import { useParams } from "react-router-dom";

const Home = () => {
  const { editAppointmentId } = useParams();

  return (
    <div className="container-fluid">
      <div className="container">
        <MDBAnimation type="fadeIn" delay="0.5s">
          <div className="row">
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
