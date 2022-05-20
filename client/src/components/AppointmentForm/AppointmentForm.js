import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getGarages } from "../../redux/garages/garages-actions";
import MyDatePicker from "./DatePicker";
import PersonalDetails from "./PersonalDetails";

import { MDBInput } from "mdbreact";

import { createAppointment } from "../../redux/appointment/appointment-actions";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner.js/Spinner";

import "./form.scss";
import Modal from "../Modal/Modal";

const AppointmentForm = () => {

  //form fields
  const [city, setCity] = useState("");
  const [selectedGagrage, setSelectedGagrage] = useState("");
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [isGarageSelected, setIsGarageSelected] = useState(false);

  const [appointmentDateTime, setAppointmentDateTime] = useState(new Date());
  const [load, setLoad] = useState(true)
  const [showSpinner, setShowSpinner] = useState(true);
  const [isUserSelectedDate, setIsUserSelectedDate] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);



  const dispatch = useDispatch();
  const navigate = useNavigate();
  const garages = useSelector((state) => state.garagesReducer.garages);

  useEffect(() => {
    dispatch(getGarages())
      .then((res) => {
        sessionStorage.setItem("garages", JSON.stringify(res.garages.sort((a, b) => a.Name.localeCompare(b.Name))))
      })
  }, []);

  useEffect(() => {
    if (garages.length > 0) setLoad(false);
  }, [garages]);

  const submitForm = (e) => {
    e.preventDefault();

    if (!isUserSelectedDate) alert("אנא בחר/י מועד תור");
    else {
      setShowSpinner(true);
      const data = {
        User: {
          FirstName: firstName,
          LastName: lastName,
          Phone: phone,
          Email: email,
          TZ: id,
        },
        CarNumber: carNumber,
        Datetime: appointmentDateTime,
        GarageId: selectedGagrage,
      };
      console.log("data", data);
      dispatch(createAppointment(data))
        .then(() => {
          setShowSpinner(false);
          navigate("/appointment-saved");
        })
        .catch((error) => alert(error));
    }
  };

  return (
    <div>
      {/* <h2>בחירת מוסך</h2> */}
      {!load && (
        <>
          <Form onSubmit={submitForm}>


            <label>בחר/י עיר</label>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <select
                className="form-control"
                required
                onChange={(e) => setCity(e.target.value)}
              >
                <option value={""}></option>
                <option value={"ירושלים"}>ירושלים</option>
              </select>
            </Form.Group>
            <label>בחר/י מוסך</label>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <select
                disabled={!city}
                className="form-control"
                onChange={(e) => {
                  if (e.target.value != 0) {
                    setSelectedGagrage(e.target.value);
                    if (!isGarageSelected) setIsGarageSelected(true);
                  }
                }}
                required
              >
                <option value={0}></option>
                {garages != undefined &&
                  garages.map((garage) => {
                    return (
                      <option key={garage._id} value={garage._id}>
                        {garage.Name}
                      </option>
                    );
                  })}
              </select>
              {
                selectedGagrage.length > 0 &&
                <>
                  <i className="fas fa-question-circle" onClick={() => setModalShow(true)}></i>
                  <Modal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    idOfGarage={selectedGagrage}
                    garages={garages}
                  />
                </>
              }


            </Form.Group>


            <label>בחר/י מועד תור</label>
            <MyDatePicker
              selectedGagrage={garages.filter((g) => g._id == selectedGagrage)}
              setAppointmentDateTime={setAppointmentDateTime}
              appointmentDateTime={appointmentDateTime}
              setIsUserSelectedDate={setIsUserSelectedDate}
              isUserSelectedDate={isUserSelectedDate}
              disabled={!isGarageSelected}
            />
            {/* <br /> <br /> */}
            {/* <p>{`${appointmentDateTime}`}</p> */}
            <hr />
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

            <Button variant="white" type="submit">
              סיום
            </Button>
          </Form>
        </>
      )}
    </div>
  );
};

export default AppointmentForm;
