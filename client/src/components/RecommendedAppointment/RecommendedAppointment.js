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
  const [isUserSubmittedForm, setIsUserSubmittedForm] = useState(false)
  const [showSpinner, setShowSpinner] = useState(true);
  const [showGarages, setShowGarages] = useState(false)
  const [selectedGarages, setSelectedGarages] = useState([])
  const [selectedGarage, setSelectedGarage] = useState([])

  const moment = extendMoment(Moment);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //redux states
  const appointments = useSelector((state) => state.appointmentReducer.appointments);
  const garages = useSelector((state) => state.garagesReducer.garages);


  useEffect(() => {
    if (garages.length == 0)
      navigate('/')
  }, [garages])

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
      )
        .catch(err => {
          // setShowSpinner(false)
          alert(err)
        })
    }

    //when didn't allow - get first free Appointment
    else {
      dispatch(getFirstFreeAppointment({ Garages: selectedGarages }))
        .catch(err => {
          // setShowSpinner(false)
          alert(err)
        })
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
    setShowSpinner(true)
    setIsUserSubmittedForm(true)

    // console.log(id);
    const data = {
      User: {
        FirstName: firstName,
        LastName: lastName,
        Phone: phone,
        Email: email,
        TZ: id
      },
      CarNumber: carNumber,
      Datetime: appointment.Datetime,
      GarageId: appointment.Id,
    };
    // console.log("data", data);
    dispatch(createAppointment(data))
      .then(() => {
        setShowSpinner(false)
        setIsUserSubmittedForm(false)

        navigate("/appointment-saved");
      })
      .catch((error) => {
        setShowSpinner(false)
        setIsUserSubmittedForm(false)

        alert(error)
      });
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

    //html button tag
    let tagOfParent = document.getElementsByClassName(`button${id}`)[0];

    //when button was unmarked - mark it
    if (tagOfParent.className.includes("selected-recommended-button"))
      tagOfParent.classList.remove("selected-recommended-button")
    //when button was marked - umnarked it
    else
      tagOfParent.classList.add("selected-recommended-button")

    let updatedSelectedGarages = selectedGarages;

    //when user marked a grarage name
    if (updatedSelectedGarages.some(u => u == id.toString()))
      updatedSelectedGarages = updatedSelectedGarages.filter(u => u != id.toString())
    //when user unmarked a grarage name 
    else
      updatedSelectedGarages.push(id.toString())

    setSelectedGarages(updatedSelectedGarages)

    debounceFindFind(updatedSelectedGarages)

  }


  //Serach after 1 second of typing
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

  const handleModalShow = (id) => {
    setSelectedGarage(garages.filter(g => g._id == id))
    setModalShow(true)
  }

  return (
    <MDBAnimation type="fadeIn" delay="0.5s">

      <div className="flex">
        {showGarages &&
          <div className="flex">
            <p style={{ paddingLeft: "20px", fontSize: "large", margin: "0" }}>סינון לפי מוסך:</p>

            {
              garages.map(garage => {


                let classNameOfButton = ""
                if (selectedGarages.some(s => s == garage._id))
                  classNameOfButton = "recommended-button selected-recommended-button"
                else
                  classNameOfButton = "recommended-button"

                return <React.Fragment key={garage._id}>

                  <div
                    className={`button${garage._id} ${classNameOfButton}`}
                  >
                    <button
                      // style={{ border, color, background }}
                      id={garage._id}
                      value={garage.Name}
                      onClick={handleSelectedGarages}>{garage.Name}

                    </button>


                  </div>
                  <i className="fas fa-question-circle" onClick={() => handleModalShow(garage._id)}></i>

                </React.Fragment>
              })
            }

          </div>
        }
      </div>
      {console.log('selectedGarage', selectedGarage)}
      {
        modalShow &&
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          idOfGarage={selectedGarage[0]._id}
          garages={garages}
        />
      }
      <br />
      <div className="row">
        {(!showSpinner && garages.length > 0) ? (
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
                            <div className="nine">
                              <h2>
                                {appointment.Name}

                                <span>
                                  {appointment.Address}, {appointment.City}
                                </span>
                              </h2>
                            </div>

                            <div className="row">
                              <div className="col-sm-4">
                                {
                                  isUserAllowedLocation &&
                                  <div className="mb-2 font-weight-bold">
                                    מרחק: {appointment.Distance} ק"מ
                                  </div>
                                }
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
                            <Button type="submit">שליחה</Button>
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
          <Spinner text={isUserSubmittedForm ? "" : "מחשב תורים קרובים"} />
        ) : (
          <Spinner text={isUserSubmittedForm ? "" : "מחשב את התור הקרוב ביותר"} />
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
