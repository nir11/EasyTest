import { MDBCol, MDBInput, MDBRow } from "mdbreact";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Spinner from "../../components/Spinner/Spinner";
import Api from "../../utils/Api";
import "./manager.scss";
import { UserAppointmentCard } from "./UserAppointmentCard/user-appointment-card";

export const Manager = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wrongLoginDetails, setWrongLoginDetails] = useState(false);
  const [garageAppointments, setGarageAppointments] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const savedLoginDetails = JSON.parse(localStorage.getItem("loginDetails"));
    if (savedLoginDetails) login(savedLoginDetails);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getGarageAppointments();
    }
  }, [isLoggedIn]);

  const login = (details) => {
    if (
      details.username.toLocaleLowerCase() === "admin" &&
      details.password.toLocaleLowerCase() === "pilot2023"
    ) {
      if (wrongLoginDetails) setWrongLoginDetails(false);
      setIsLoggedIn(true);
      if (rememberMe)
        localStorage.setItem("loginDetails", JSON.stringify(details));
    } else {
      setWrongLoginDetails(true);
    }
  };

  const logout = () => {
    setLoginDetails({
      username: "",
      password: "",
    });
    setIsLoggedIn(false);
    localStorage.removeItem("loginDetails");
  };

  const getGarageAppointments = async () => {
    const garageId = "627e21090e5f3b0a0df6d274";
    try {
      setShowSpinner(true);
      const res = await Api.get(`/appointments/garage/${garageId}`);
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
          <div className="appointments-header-container">
            <span className="appointments-header">
              מ.מ.מ בדיקות רכב ורישוי - תורים קרובים
            </span>

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
