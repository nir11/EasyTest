import React, { useEffect } from "react";
import { MDBInput, MDBRow, MDBCol } from "mdbreact";

const PersonalDetails = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  email,
  setEmail,
  carNumber,
  setCarNumber,
  confirmForm,
  setConfirmForm,
}) => {
  return (
    <MDBRow>
      <MDBCol sm="12">
        <h2>פרטים אישיים</h2>
        <MDBInput
          label="* מספר רכב"
          outline
          group
          type={"number"}
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value)}
          icon="car"
          required
        />
      </MDBCol>

      <MDBCol sm="6">
        <MDBInput
          label="* שם פרטי"
          outline
          group
          type={"text"}
          className="form-control"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          icon="user"
          required
        />
      </MDBCol>

      <MDBCol sm="6">
        <MDBInput
          label="* שם משפחה"
          outline
          group
          type={"text"}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          icon="user"
          required
        />
      </MDBCol>

      <MDBCol sm="6">
        <MDBInput
          label="* טלפון"
          outline
          group
          type={"tel"}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon="phone"
          required
        />
      </MDBCol>

      <MDBCol sm="6">
        <MDBInput
          label="* דואר אלקטרוני"
          outline
          group
          type={"email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon="envelope"
          required
        />
      </MDBCol>

      <MDBCol className="confirm-form-container">
        <input
          type="checkbox"
          checked={confirmForm}
          onChange={() => setConfirmForm((prevState) => !prevState)}
        />{" "}
        <span onClick={() => setConfirmForm((prevState) => !prevState)}>
          אני מאשר/ת שמירה של פרטיי לצורך עדכונים
        </span>
      </MDBCol>
    </MDBRow>
  );
};
export default PersonalDetails;
