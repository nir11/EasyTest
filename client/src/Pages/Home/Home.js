import React from "react";
import { MDBAnimation } from "mdbreact";

import AppointmentForm from "../../components/AppointmentForm/AppointmentForm";

const Home = () => {
    return (
        <div className="container-fluid">
            <div className="container">
                <MDBAnimation type="fadeIn" delay="0.5s">
                    <div className="row">
                        <div className="col-lg-6 ">

                            <h1>קביעת תור למבחן רישוי</h1>
                            <br />

                            <div className="home-form">
                                <AppointmentForm />
                            </div>

                        </div>
                    </div>
                </MDBAnimation>
            </div>
        </div>
    );
};

export default Home;
