import React, { useEffect, useState } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  createAppointment,
  getFirstFreeAppointment,
  getRecommendedAppointments,
} from "../../redux/appointment/appointment-actions";

import Moment from "moment";
import { extendMoment } from "moment-range";

import { MDBAnimation } from "mdbreact";
import {
  Card,
  Accordion,
  Button,
  Form,
  useAccordionButton,
} from "react-bootstrap";

import "./RecommendedAppointment.scss";

import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner.js/Spinner";
import PersonalDetails from "../AppointmentForm/PersonalDetails";

import Modal from "../Modal/Modal";
import _ from "lodash";

const RecommendedAppointment = ({
  lat,
  lng,
  isUserAllowedLocation,
  isSharingLocationTested,
}) => {

  //form states
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  //helper fields
  const [modalShow, setModalShow] = React.useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [showGarages, setShowGarages] = useState(false)
  const [selectedGarages, setSelectedGarages] = useState([])
  const moment = extendMoment(Moment);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //redux states
  const appointments = useSelector((state) => state.appointmentReducer.appointments);
  const garages = useSelector((state) => state.garagesReducer.garages);

  useEffect(() => {
    console.log("lat", lat);
    console.log("lng", lng);
    console.log({ isUserAllowedLocation });

    //when user allowed location on browser - get Appointments based on location
    if (isUserAllowedLocation) {
      dispatch(
        getRecommendedAppointments({
          Latitude: lat,
          Longitude: lng,
        })
      );
    }

    //when didn't allow - get first free Appointment
    else {
      dispatch(getFirstFreeAppointment({ Garages: selectedGarages }));
    }
  }, [isSharingLocationTested]);

  useEffect(() => {
    if (appointments.length) {
      setShowSpinner(false)
      setShowGarages(true)
    }
  }, [appointments]);

  const submitForm = (e, appointment) => {
    e.preventDefault();

    // console.log(id);
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
    // console.log("data", data);
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
      case "Thursday":
        return "חמישי";
      case "Friday":
        return "שישי";
      case "Saturday":
        return "שבת";
    }
  };

  const handleSelectedGarages = e => {
    e.preventDefault();

    const { id } = e.target

    console.log(id);

    let updatedSelectedGarages = selectedGarages;

    if (updatedSelectedGarages.some(u => u == id.toString())) {
      console.log("has");
      updatedSelectedGarages = updatedSelectedGarages.filter(u => u != id.toString())
    }
    else
      updatedSelectedGarages.push(id.toString())

    console.log('updatedSelectedGarages', updatedSelectedGarages);

    setSelectedGarages(updatedSelectedGarages)

    debounceFindFind(updatedSelectedGarages)

  }


  //Serach after 0.5 second of typing
  const debounceFindFind = _.debounce((updatedSelectedGarages) => {
    setShowSpinner(true)

    //when user allowed location on browser - get Appointments based on location
    if (isUserAllowedLocation) {
      dispatch(
        getRecommendedAppointments({
          Latitude: lat,
          Longitude: lng,
          Garages: updatedSelectedGarages
        })
      )
        .then(() => setShowSpinner(false))

    }

    // when didn't allow - get first free Appointment
    else {
      dispatch(getFirstFreeAppointment({ Garages: updatedSelectedGarages }))
        .then(() => setShowSpinner(false))
    }
  }, 1000);

  return (
    <MDBAnimation type="fadeIn" delay="0.5s">

      <div className="flex">
        {showGarages &&
          <div className="flex-column">
            <h2 className="text-center">סינון תורים קרובים לפי מוסכים</h2>

            {
              garages.map(garage => {

                let border = "";
                let color = "";
                let background = "";

                if (selectedGarages.some(s => s == garage._id)) {
                  border = "3px solid black"
                  color = 'black';
                  background = "#c5a9a9"
                }
                else
                  background = "#fff"

                return <Button
                  variant="white"
                  style={{ border, color, background }}
                  className="btn"
                  key={garage._id}
                  id={garage._id}
                  value={garage.Name}
                  onClick={handleSelectedGarages}>{garage.Name}
                </Button>
              })
            }

          </div>
        }
      </div>
      <br />
      <div className="row">
        {!showSpinner && garages.length > 0 ? (
          <div>

            {appointments.map((appointment, index) => {
              // console.log("appointment.Datetime", appointment.Datetime);
              let dateOfAppointment = new Date(appointment.Datetime);
              let todayDate = new Date();
              let difference =
                dateOfAppointment.getTime() - todayDate.getTime();
              let TotalDays = Math.ceil(difference / (1000 * 3600 * 24)) - 1;
              // console.log({ TotalDays });
              let daysLeftText = null;
              switch (TotalDays) {
                case 0:
                  if (dateOfAppointment.getDate() === todayDate.getDate()) {
                    daysLeftText = "היום";
                  } else {
                    daysLeftText = "מחר";
                  }
                  break;
                case 1:
                  if (dateOfAppointment.getDate() === todayDate.getDate() + 1) {
                    daysLeftText = "מחר";
                  } else {
                    daysLeftText = "מחרתיים";
                  }
                  break;
                case 2:
                  if (dateOfAppointment.getDate() === todayDate.getDate() + 2) {
                    daysLeftText = "מחרתיים";
                  } else {
                    daysLeftText = `בעוד ${TotalDays} ימים`;
                  }
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
                      <div>
                        <div className="row">
                          <div className="col-sm-12">
                            {/* <Card.Title>{appointment.Name}</Card.Title>
                            <Card.Subtitle className="mb-2 font-weight-bold">

                              מרחק: {appointment.Distance} ק"מ
                            </Card.Subtitle> */}

                            <div className="nine">
                              <h2>
                                {appointment.Name}



                                <i className="fas fa-question-circle" onClick={() => setModalShow(true)} style={{ fontSize: '20pt', paddingRight: '10px' }}></i>
                                <Modal
                                  show={modalShow}
                                  onHide={() => setModalShow(false)}
                                  idOfGarage={garages.filter(g => g.Name == appointment.Name)[0]._id}
                                  garages={garages}
                                />

                                <span>
                                  {appointment.Address}, {appointment.City}
                                </span>
                              </h2>
                            </div>

                            <div className="row">
                              <div className="col-sm-4">
                                <div className="mb-2 font-weight-bold">
                                  מרחק: {appointment.Distance} ק"מ
                                </div>
                                יום&nbsp;
                                {getDayNameInHebrew(
                                  moment(appointment.Datetime).format("dddd")
                                )}{" "}
                                | &nbsp;
                                {moment(appointment.Datetime).format("HH:mm")} |
                                &nbsp;
                                {moment(appointment.Datetime).format(
                                  "DD/MM/YYYY"
                                )}
                              </div>

                              <div className="customToggle-button col-sm-4">
                                <CustomToggle
                                  eventKey="0"
                                  setIsToggleOpen={setIsToggleOpen}
                                >
                                  {isToggleOpen ? "סגור" : "הזמן עכשיו!"}
                                </CustomToggle>


                              </div>
                              <div className="customToggle-button col-sm-4"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="ribbon ribbon-top-left">
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
                          <div style={{ textAlign: "center" }}>
                            <Button type="submit">שלח</Button>
                          </div>
                        </Form>
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
          </div>
        ) : isUserAllowedLocation ? (
          <Spinner text="מחשב תורים קרובים" />
        ) : (
          <Spinner text="מחשב את התור הקרוב ביותר" />
        )}
      </div>
    </MDBAnimation>
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
