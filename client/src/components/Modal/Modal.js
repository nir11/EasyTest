import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Map from '../Map/Map'
import './modal.scss'

const MyModal = (props) => {

    //map fields
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [zoom, setZoom] = useState(20)
    const [garageName, setGarageName] = useState("")
    const [selectedGarage, setSelectedGarage] = useState({})

    useEffect(() => {
        props.garages.filter(g => g._id == props.idOfGarage).map(s => {
            setLat(Number(s.Latitude))
            setLng(Number(s.Longitude))
            setGarageName(s.Name)
            setSelectedGarage(s)
        })
    }, [props.garages, props.idOfGarage])



    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>{
                selectedGarage.Name != undefined &&
                <Modal.Title id="contained-modal-title-vcenter" style={{ color: "black" }}>
                    <div className="nine">
                        <h2>
                            {selectedGarage.Name}
                            <span>
                                {selectedGarage.Address}, {selectedGarage.City}
                            </span>
                        </h2>

                        <div className='flex' style={{ justifyContent: " space-evenly" }}>
                            <a
                                href={`https://www.google.com/search?q=${selectedGarage.Name.replace("", "+")}`}
                                target="_blank">
                                <i className="fab fa-google" title={`https://www.google.com/search?q=${selectedGarage.Name.replace("", "+")}`}></i>
                            </a>

                            <a
                                href={`tel:${selectedGarage.Phone}`} >
                                <i className="fas fa-phone" title={selectedGarage.Phone}></i>
                            </a>

                        </div>
                    </div>

                </Modal.Title>
            }

            </Modal.Header>
            <Modal.Body>

                <div className='modal-map'>
                    <Map
                        lat={lat}
                        setLat={setLat}
                        lng={lng}
                        setLng={setLng}
                        idOfGarage={props.idOfGarage}
                        zoom={zoom}
                        setZoom={setZoom}
                        showInfoWindow={true}
                        containerStyleModal={{
                            width: '100%',
                            height: '500px'
                        }}
                    />
                </div>


            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>סגירה</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default MyModal