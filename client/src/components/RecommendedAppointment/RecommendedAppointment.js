import React, { useEffect, useState } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  createAppointment,
  getRecommendedAppointments,
} from "../../redux/appointment/appointment-actions";

import Moment from "moment";
import { extendMoment } from "moment-range";

import {
  Card,
  Accordion,
  Button,
  Form,
  useAccordionButton,
} from "react-bootstrap";

import "./RecommendedAppointment.scss";

import PersonalDetails from "../Form/PersonalDetails";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner.js/Spinner";

const RecommendedAppointment = ({ lat, lng }) => {
  const dispatch = useDispatch();
  // const [city, setCity] = useState('')
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const [showSpinner, setShowSpinner] = useState(true);

  const appointments = useSelector(
    (state) => state.appointmentReducer.appointments
  );
  const moment = extendMoment(Moment);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getRecommendedAppointments({
        Latitude: lat,
        Longitude: lng,
      })
    );
  }, []);

  useEffect(() => {
    if (appointments.length) setShowSpinner(false);
  }, [appointments]);

  const submitForm = (e, appointment) => {
    e.preventDefault();

    console.log(id);
    const data = {
      User: {
        FirstName: firstName,
        LastName: lastName,
        Phone: phone,
        Email: email,
        TZ: "123",
      },
      CarNumber: carNumber,
      Datetime: appointment.Datetime,
      GarageId: appointment.Id,
    };
    console.log("data", data);
    dispatch(createAppointment(data))
      .then(() => {
        navigate("/appointment-saved");
      })
      .catch((error) => alert(error));
  };

  const getDayNameInHebrew = (englishName) => {
    switch (englishName) {
      case "Sunday":
        return "ראשון";
      case "Monday":
        return "שני";
      case "Tuesday":
        return "שלישי";
      case "Wednesday":
        return "רביעי";
      case "thursday":
        return "חמישי";
      case "Friday":
        return "שישי";
      case "saturday":
        return "שבת";
    }
  };

  return (
    <div>
      <div className="row">
        {!showSpinner ? (
          <>
            {appointments.map((appointment, index) => {
              let dateOfAppointment = new Date(appointment.Datetime);
              let todayDate = new Date();
              let difference =
                dateOfAppointment.getTime() - todayDate.getTime();
              let TotalDays = Math.ceil(difference / (1000 * 3600 * 24)) - 1;
              let daysLeftText = null;
              switch (TotalDays) {
                case 0:
                  daysLeftText = "היום";
                  break;
                case 1:
                  daysLeftText = "מחר";
                  break;
                case 2:
                  daysLeftText = "מחרתיים";
                  break;
                default:
                  daysLeftText = `בעוד ${TotalDays} ימים`;
                  break;
              }

              return (
                <Accordion
                  key={index}
                  className="accordion-card"
                  //   defaultActiveKey="1"
                >
                  <Card>
                    <Card.Header>
                      <div className="col-sm-5">
                        <Card.Title>{appointment.Name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          מרחק: {appointment.Distance} ק"מ
                        </Card.Subtitle>
                        <Card.Text>
                          תאריך:{" "}
                          {moment(appointment.Datetime).format("DD/MM/YYYY")}
                        </Card.Text>
                        <Card.Text>
                          יום:{" "}
                          {getDayNameInHebrew(
                            moment(appointment.Datetime).format("dddd")
                          )}
                        </Card.Text>
                        <Card.Text>
                          שעה: {moment(appointment.Datetime).format("HH:mm")}
                        </Card.Text>
                      </div>
                      {/* <div className="col-sm-5">בעוד {TotalDays} ימים</div> */}
                      <div className="col-sm-2 flex">
                        {/* <p>הזמנת תור</p> */}
                        {/* <p>
                          הזמנת תור <i className="fas fa-angle-double-left"></i>
                        </p> */}
                      </div>

                      <CustomToggle
                        eventKey="0"
                        setIsToggleOpen={setIsToggleOpen}
                      >
                        {isToggleOpen ? "סגור" : "הזמן עכשיו!"}
                      </CustomToggle>

                      <div class="ribbon ribbon-top-left">
                        <span>*{daysLeftText}*</span>
                      </div>
                    </Card.Header>

                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        <Form onSubmit={(e) => submitForm(e, appointment)}>
                          <PersonalDetails
                            id={id}
                            setId={setId}
                            firstName={firstName}
                            setFirstName={setFirstName}
                            lastName={lastName}
                            setLastName={setLastName}
                            phone={phone}
                            setPhone={setPhone}
                            email={email}
                            setEmail={setEmail}
                            carNumber={carNumber}
                            setCarNumber={setCarNumber}
                          />
                        </Form>
                        <Button type="submit">שלח</Button>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  {/* <Accordion.Item eventKey="0">
                    <Accordion.Header>
                  
                    </Accordion.Header>
                    <Accordion.Body>
                     
                      </Form>
                    </Accordion.Body>
                  </Accordion.Item> */}
                </Accordion>
              );
            })}
          </>
        ) : (
          <Spinner text="מחשב תורים קרובים" />
        )}
      </div>
    </div>
  );
};

export default RecommendedAppointment;

function CustomToggle({ children, eventKey, setIsToggleOpen }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    setIsToggleOpen((prevState) => !prevState)
  );

  return (
    <button
      type="button"
      //   style={{ backgroundColor: "pink" }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}
