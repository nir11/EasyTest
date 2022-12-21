import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

//redux
import { createAppointment } from "../../redux/appointment/appointment-actions";
import { getGarages } from "../../redux/garages/garages-actions";

//components
import Spinner from "../Spinner.js/Spinner";
import PersonalDetails from "./PersonalDetails";
import Modal from "../Modal/Modal";

//scss
import "./form.scss";
import AppointmentDatePicker from "./AppointmentDatePicker";

//utilis
import { validateEmail, validatePhone } from "../../utils/validations";

const AppointmentForm = ({ appointmentId }) => {
  //form fields
  const [city, setCity] = useState("");
  const [selectedGagrageId, setSelectedGagrageId] = useState("");
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [isGarageSelected, setIsGarageSelected] = useState(false);

  //helper fields
  const [appointmentDateTime, setAppointmentDateTime] = useState(new Date());
  const [load, setLoad] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [isUserSelectedDate, setIsUserSelectedDate] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [selectedGagrage, setSelectedGagrage] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const garages = useSelector((state) => state.garagesReducer.garages);

  //load garaged when page rendered
  useEffect(() => {
    dispatch(getGarages())
      .then((res) => {
        sessionStorage.setItem(
          "garages",
          JSON.stringify(
            res.garages.sort((a, b) => a.Name.localeCompare(b.Name))
          )
        );
      })
      .catch(() => {
        setErrorMessage("אירעה שגיאה!");
      });
  }, []);

  //get garages from serevr and remove loading state
  useEffect(() => {
    if (garages.length > 0) setLoad(false);
  }, [garages]);

  const submitForm = (e) => {
    e.preventDefault();

    if (!validation()) return;

    setShowSpinner(true);
    const data = {
      User: {
        FirstName: firstName,
        LastName: lastName,
        Phone: phone,
        Email: email,
      },
      CarNumber: carNumber,
      Datetime: appointmentDateTime,
      GarageId: selectedGagrageId,
      OldAppointmentToDelete: appointmentId,
    };
    // console.log("data", data);
    dispatch(createAppointment(data))
      .then(() => {
        setShowSpinner(false);
        navigate("/appointment-saved");
      })
      .catch((error) => {
        setErrorMessage("אירעה שגיאה!");
      });
  };

  const validation = () => {
    const appointmentMinutes = parseInt(
      moment(appointmentDateTime).format("mm")
    );

    if (![0, 15, 30, 45].includes(appointmentMinutes)) {
      // alert("לא נבח תור");
      setValidationError("לא נבחר תור");
      return;
    }
    if (!isUserSelectedDate) {
      // alert("אנא בחר/י מועד תור");
      setValidationError("אנא בחר/י מועד תור");
      return;
    }
    if (!validatePhone(phone)) {
      // alert("טלפון לא חוקי");
      setValidationError("טלפון לא חוקי");
      return;
    }
    if (!validateEmail(email)) {
      // alert("אימייל לא חוקי");
      setValidationError("אימייל לא חוקי");
      return;
    }

    return true;
  };

  return (
    <div>
      {errorMessage != "" && <p className="errror-message">{errorMessage}</p>}

      {!load && !showSpinner ? (
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

            <label>בחר/י מכון</label>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <select
                disabled={!city}
                className="form-control"
                onChange={(e) => {
                  if (e.target.value != 0) {
                    setSelectedGagrageId(e.target.value);
                    setSelectedGagrage(
                      garages.filter((g) => g._id == e.target.value)
                    );
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
              {selectedGagrageId.length > 0 && (
                <>
                  <i
                    className="fas fa-question-circle"
                    onClick={() => setModalShow(true)}
                  ></i>
                  <Modal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    idOfGarage={selectedGagrageId}
                    garages={garages}
                  />
                </>
              )}
            </Form.Group>

            <label>בחר/י מועד תור</label>
            <AppointmentDatePicker
              selectedGagrage={selectedGagrage}
              setAppointmentDateTime={setAppointmentDateTime}
              appointmentDateTime={appointmentDateTime}
              setIsUserSelectedDate={setIsUserSelectedDate}
              isUserSelectedDate={isUserSelectedDate}
              disabled={!isGarageSelected}
            />

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

            <Button type="submit" className="submit-button">
              שליחה
            </Button>

            {validationError != "" && (
              <p
                className="errror-message text-center"
                style={{ marginTop: "10px" }}
              >
                {validationError}
              </p>
            )}
          </Form>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default AppointmentForm;
