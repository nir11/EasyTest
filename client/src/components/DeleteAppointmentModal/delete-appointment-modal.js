import moment from "moment";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Api from "../../utils/Api";
import "../Modal/modal.scss";

export const DeleteAppointmentModal = ({
  show,
  appointment,
  confirm,
  cancel,
  ...props
}) => {
  const [isDeleteDone, setIsDeleteDone] = useState(false);

  const deleteAppointent = async () => {
    try {
      const res = await Api.delete(`appointments/${appointment._id}`);
      if (res.data) {
        setIsDeleteDone(true);
      } else {
        alert("error");
      }
    } catch (e) {}
  };

  return (
    <Modal
      show
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ minHeight: "400px" }}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ color: "black" }}
        >
          <p>מחיקת תור קיים</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: "center" }}>
        {!isDeleteDone ? (
          <>
            <span>המערכת תמחק את התור שנקבע עבור</span>{" "}
            <>
              <b style={{ fontWeight: "Bold" }}>
                {`${appointment.User.FirstName} ${appointment.User.LastName}`}
              </b>
              <p>
                למכון{" "}
                <b style={{ fontWeight: "Bold" }}>{appointment.GarageName}</b>{" "}
                בתאריך{" "}
                <b style={{ fontWeight: "Bold" }}>
                  {moment(appointment.Datetime).format("DD/MM")}
                </b>{" "}
                בשעה{" "}
                <b style={{ fontWeight: "Bold" }}>
                  {moment(appointment.Datetime).format("HH:mm")}
                </b>
              </p>
              <p>האם ברצונך להמשיך?</p>
            </>
          </>
        ) : (
          <p>התור נמחק בהצלחה</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!isDeleteDone ? (
          <>
            <Button onClick={deleteAppointent}>אישור</Button>
            <Button onClick={cancel}>ביטול</Button>
          </>
        ) : (
          <Button onClick={confirm}>המשך</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
