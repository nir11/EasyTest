import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

//redux
import {
  createAppointment,
  updateAppointment,
} from "../../redux/appointment/appointment-actions";
import { getGarages } from "../../redux/garages/garages-actions";

//components
import Spinner from "../Spinner/Spinner";
import PersonalDetails from "./PersonalDetails";
import Modal from "../Modal/Modal";

//scss
import "./form.scss";
import AppointmentDatePicker from "./AppointmentDatePicker";

//utilis
import { validateEmail, validatePhone } from "../../utils/validations";
import { DeleteAppointmentModal } from "../DeleteAppointmentModal/delete-appointment-modal";
import Api from "../../utils/Api";

const AppointmentForm = ({ editAppointmentId }) => {
  //form fields
  const [city, setCity] = useState("ירושלים");
  const [selectedGagrageId, setSelectedGagrageId] = useState("");
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [isGarageSelected, setIsGarageSelected] = useState(false);

  //helper fields
  const [appointmentDateTime, setAppointmentDateTime] = useState(
    new Date(2023, 0, 8)
  );
  const [load, setLoad] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [isUserSelectedDate, setIsUserSelectedDate] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [selectedGagrage, setSelectedGagrage] = useState([]);
  const [editAppointment, setEditAppointment] = useState({});
  const [deleteAppointmentModalOpen, setDeleteAppointmentModalOpen] =
    useState(false);
  const [confirmForm, setConfirmForm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const garages = useSelector((state) => state.garagesReducer.garages);

  //load garaged when page rendered
  useEffect(() => {
    dispatch(getGarages())
      .then((res) => {
        setSelectedGagrage(res.garages);
        setSelectedGagrageId(res.garages[0]._id);
        setIsGarageSelected(true);
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
    if (editAppointmentId) {
      getExistingAppointment();
    }
  }, []);

  const getExistingAppointment = async () => {
    try {
      setShowSpinner(true);
      setLoad(true);
      const res = await Api.get(`appointments/${editAppointmentId}`);
      console.log({ res });
      if (res.data) {
        setEditAppointment(res.data.appointment);
        setCarNumber(res.data.appointment.CarNumber);
        setFirstName(res.data.appointment.User.FirstName);
        setLastName(res.data.appointment.User.LastName);
        setPhone(res.data.appointment.User.Phone);
        setEmail(res.data.appointment.User.Email);
        setIsGarageSelected(true);
        setSelectedGagrage(res.data.appointment.Garage._id);
        setSelectedGagrageId(res.data.appointment.Garage._id);
        // setAppointmentDateTime(new Date(res.data.appointment.Datetime));
        setIsUserSelectedDate(true);
        setShowSpinner(false);
        setLoad(false);
      } else {
        navigate("../");
      }
    } catch (e) {
      navigate("../");
    }
  };

  //get garages from serevr and remove loading state
  useEffect(() => {
    if (garages.length > 0) setLoad(false);
  }, [garages]);

  const submitForm = (e) => {
    e.preventDefault();
    if (!validation()) return;
    if (editAppointmentId) updateExistedAppointment();
    else createNewAppointment();
  };

  const updateExistedAppointment = async () => {
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
    };
    // console.log("data", data);
    dispatch(updateAppointment(editAppointmentId, data))
      .then(() => {
        setShowSpinner(false);
        navigate("/appointment-saved");
      })
      .catch((error) => {
        setErrorMessage("אירעה שגיאה!");
      });
  };

  const createNewAppointment = () => {
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
    if (!confirmForm) {
      // alert("אנא אשר/י שמירה של פרטי הטופס");
      setValidationError("אנא אשר/י שמירה של פרטי הטופס");
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
      {deleteAppointmentModalOpen && (
        <DeleteAppointmentModal
          show={deleteAppointmentModalOpen}
          appointment={editAppointment}
          confirm={() => {
            setEditAppointment({});
            setDeleteAppointmentModalOpen(false);
            navigate("../");
          }}
          cancel={() => setDeleteAppointmentModalOpen(false)}
        />
      )}

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
                value={"ירושלים"}
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
                value={selectedGagrageId}
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
              editAppointmentMode={editAppointmentId}
              editAppointment={editAppointment}
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
              confirmForm={confirmForm}
              setConfirmForm={setConfirmForm}
            />

            {validationError != "" && (
              <p
                className="errror-message text-center"
                style={{ marginTop: "10px" }}
              >
                {validationError}
              </p>
            )}

            {editAppointmentId ? (
              <div className="appointment-form-buttons-container">
                <Button type="submit" className="submit-button">
                  שמירה
                </Button>
                <Button
                  variant="danger"
                  className="submit-button"
                  onClick={() => setDeleteAppointmentModalOpen(true)}
                >
                  מחיקה
                </Button>
              </div>
            ) : (
              <Button type="submit" className="submit-button">
                שליחה
              </Button>
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
