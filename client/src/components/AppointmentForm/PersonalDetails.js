import React from 'react'
import { MDBInput, MDBRow, MDBCol } from "mdbreact";

const PersonalDetails = ({
    id, setId,
    firstName, setFirstName,
    lastName, setLastName,
    phone, setPhone,
    email, setEmail,
    carNumber, setCarNumber }) => {

    return (
        <MDBRow>

            <MDBCol sm="12">
                <h2>פרטים אישיים</h2>
                <MDBInput label="* תעודת זהות" outline
                    group type={"number"}
                    value={id}
                    onChange={e => setId(e.target.value)}
                    icon="#"
                    required
                />
            </MDBCol>

            <MDBCol sm="6">
                <MDBInput label="* שם פרטי" outline
                    group type={"text"}
                    className='form-control'
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    icon="user"
                    required
                />
            </MDBCol>

            <MDBCol sm="6">
                <MDBInput label="* שם משפחה" outline
                    group type={"text"}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    icon="user"
                    required
                />
            </MDBCol>

            <MDBCol sm="6">
                <MDBInput label="* טלפון" outline
                    group type={"tel"}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    icon="phone"
                    required
                />
            </MDBCol>

            <MDBCol sm="6">
                <MDBInput label="* דואר אלקטרוני" outline
                    group type={"email"}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    icon="envelope"
                    required
                />
            </MDBCol>

            <MDBCol sm="12">
                <MDBInput label="* מספר רכב" outline
                    group type={"number"}
                    value={carNumber}
                    onChange={e => setCarNumber(e.target.value)}
                    icon="car"
                    required
                />
            </MDBCol>

        </MDBRow>
    )
}
export default PersonalDetails