import { MDBAnimation } from "mdbreact";
import React from "react";
import AppointmentForm from "../../components/AppointmentForm/AppointmentForm";
const Home = () => {
    return (
        <div className="container-fluid">
            <div className="container">
                <MDBAnimation type="fadeIn" delay="0.5s">
                    <div className="row">
                        <div className="col-lg-6 ">
                            <h1>קביעת תור לטסט לרכב</h1>
                            {/* <h1>טסט הרכב הבא שלך מתחיל כאן!</h1> */}
                            <br />
                            <div className="home-form">
                                <AppointmentForm />
                            </div>
                        </div>
                        {/* <div className='col-lg-6'>
                            <img src={image}
                                width={"100%"}
                                height={"80%"}
                            />
                        </div> */}
                    </div>
                </MDBAnimation>
            </div>
        </div>
    );
};

export default Home;
