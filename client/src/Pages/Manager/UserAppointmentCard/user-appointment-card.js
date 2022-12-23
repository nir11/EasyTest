import moment from "moment";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { DeleteAppointmentModal } from "../../../components/DeleteAppointmentModal/delete-appointment-modal";
import "./user-appointment-card.scss";

export const UserAppointmentCard = ({ appointment, getGarageAppointments }) => {
  const [deleteAppointmentModalOpen, setDeleteAppointmentModalOpen] =
    useState(false);

  return (
    <div className="user-appointment-card-container">
      {deleteAppointmentModalOpen && (
        <DeleteAppointmentModal
          show={deleteAppointmentModalOpen}
          appointment={appointment}
          confirm={() => {
            setDeleteAppointmentModalOpen(false);
            getGarageAppointments();
          }}
          cancel={() => setDeleteAppointmentModalOpen(false)}
        />
      )}
      <div className="header">
        <div className="progress-container">
          {/* <div className="progress-second-step"></div> */}
          <p className="progress-text">
            {moment(appointment.Datetime).format("HH:mm DD/MM/YYYY")}
          </p>
          <p className="progress-text">{appointment.PathName}</p>
        </div>
      </div>
      <hr />
      <div className="footer">
        <h5 style={{ fontWeight: "bold" }}>
          {appointment.User.FirstName} {appointment.User.LastName}
        </h5>

        <table style={{ width: "100%" }}>
          <tr>
            <td>דואר אלקטרוני:</td>
            <td>{appointment.User.Email}</td>
          </tr>
          <tr>
            <td>טלפון:</td>
            <td>{appointment.User.Phone}</td>
          </tr>
          <tr>
            <td>מספר רכב:</td>
            <td>{appointment.CarNumber}</td>
          </tr>
        </table>
        <br />

        <Button
          variant="danger"
          className="submit-button"
          onClick={() => setDeleteAppointmentModalOpen(true)}
        >
          מחיקה
        </Button>
      </div>
    </div>
  );
};
