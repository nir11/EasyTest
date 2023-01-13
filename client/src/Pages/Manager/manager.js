import { MDBCol, MDBInput, MDBRow } from "mdbreact";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import Api from "../../utils/Api";
import "./manager.scss";
import { UserAppointmentCard } from "./UserAppointmentCard/user-appointment-card";
import Modal from "../../components/Modal/Modal";

export const Manager = () => {
  const garages = useSelector((state) => state.garagesReducer.garages);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wrongLoginDetails, setWrongLoginDetails] = useState(false);
  const [garageAppointments, setGarageAppointments] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [garageModal, setGarageModal] = useState({
    open: false,
    id: "",
  });

  useEffect(() => {
    const savedLoginDetails = localStorage.getItem("autologin");
    if (savedLoginDetails) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setSelectedGarage(
        garages.find((g) => g._id == "627e25e505b3fc112c864013") // בסט טסט
      );
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && selectedGarage) getGarageAppointments();
  }, [selectedGarage]);

  const login = async (details) => {
    try {
      setShowSpinner(true);
      const data = {
        username: details.username,
        password: details.password,
      };
      const res = await Api.post(`/users/login`, data);
      if (res.data) {
        if (wrongLoginDetails) setWrongLoginDetails(false);
        setIsLoggedIn(true);
        if (rememberMe) localStorage.setItem("autologin", true);
      } else {
        setWrongLoginDetails(true);
      }
    } catch (e) {
      setWrongLoginDetails(true);
    }
  };

  const logout = () => {
    setLoginDetails({
      username: "",
      password: "",
    });
    setIsLoggedIn(false);
    localStorage.removeItem("autologin");
  };

  const getGarageAppointments = async () => {
    try {
      setShowSpinner(true);
      const res = await Api.get(`/appointments/garage/${selectedGarage._id}`);
      if (res.data) {
        setGarageAppointments(res.data.appointments);
        setShowSpinner(false);
      } else {
        alert("error");
        setShowSpinner(false);
      }
    } catch (e) {}
  };

  return (
    <div className="manager-container">
      {!isLoggedIn && (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            login(loginDetails);
          }}
          className="login-container"
        >
          <MDBRow>
            <MDBCol sm="15">
              <MDBInput
                label="* שם משתמש"
                outline
                group
                type={"text"}
                className="form-control"
                value={loginDetails.username}
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, username: e.target.value })
                }
                icon="user"
                required
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol sm="15">
              <MDBInput
                label="* סיסמה"
                outline
                group
                type={"password"}
                value={loginDetails.password}
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, password: e.target.value })
                }
                icon="lock"
                required
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol sm="15" className="remember-me-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prevState) => !prevState)}
              />{" "}
              <span
                className="text"
                onClick={() => setRememberMe((prevState) => !prevState)}
              >
                זכור אותי
              </span>
            </MDBCol>
          </MDBRow>
          <Button type="submit" className="submit-button">
            התחברות
          </Button>
          {wrongLoginDetails && (
            <p
              className="errror-message text-center"
              style={{ marginTop: "10px" }}
            >
              אחד מהפרטים אינו נכון
            </p>
          )}
        </Form>
      )}

      {isLoggedIn && (
        <>
          {garageModal.open && (
            <Modal
              show={garageModal.open}
              onHide={() =>
                setGarageModal({
                  open: false,
                  id: "",
                })
              }
              idOfGarage={garageModal.id}
              garages={garages}
            />
          )}
          <div className="flex recommended-appointment-wrapper">
            <div className="flex">
              <p
                style={{
                  paddingLeft: "20px",
                  fontSize: "large",
                  margin: "0",
                }}
              >
                סינון לפי מכון:
              </p>

              {selectedGarage &&
                garages.map((garage) => {
                  return (
                    <div key={garage._id}>
                      <div
                        className={`button${garage._id} ${
                          selectedGarage._id === garage._id
                            ? "recommended-button selected-recommended-button"
                            : "recommended-button"
                        }`}
                      >
                        <button
                          id={garage._id}
                          value={garage.Name}
                          onClick={() => setSelectedGarage(garage)}
                        >
                          {garage.Name}
                        </button>
                      </div>
                      <i
                        className="fas fa-question-circle"
                        onClick={() =>
                          setGarageModal({
                            open: true,
                            id: garage._id,
                          })
                        }
                      ></i>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="appointments-header-container">
            {selectedGarage && (
              <span className="appointments-header">{selectedGarage.Name}</span>
            )}

            <Button variant="dark" className="logout" onClick={logout}>
              התנתקות
            </Button>
          </div>

          {showSpinner && <Spinner />}

          {!showSpinner &&
            garageAppointments.length > 0 &&
            garageAppointments.map((appointment) => {
              return (
                <UserAppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  getGarageAppointments={getGarageAppointments}
                />
              );
            })}

          {!showSpinner && garageAppointments.length === 0 && (
            <h5 className="no-appointments">לא קיימים תורים</h5>
          )}
        </>
      )}
    </div>
  );
};
