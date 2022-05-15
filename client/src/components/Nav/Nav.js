import React, { useState } from 'react'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'
import './nav.css'
const MyNav = () => {
    const [isActive1, setIsActive1] = useState(false)
    const [isActive2, setIsActive2] = useState(false)
    const navigate = useNavigate()
    const pushTo = (path) => {
        navigate(path)
    }
    return (
        <Nav
            activeKey="/"
        >
            <Nav.Item>
                <Nav.Link onClick={() => {
                    setIsActive1(!isActive1)
                    setIsActive2(false)
                    pushTo("/")
                }} className={isActive1 ? "active-nav-item" : ""}>קביעת תור</Nav.Link>
            </Nav.Item>

            <Nav.Item>
                <Nav.Link onClick={() => {
                    setIsActive1(false)
                    setIsActive2(!isActive2)
                    pushTo("/location")
                }} className={isActive2 ? "active-nav-item" : ""}> המלצה לפי מיקום</Nav.Link>

            </Nav.Item>
            {/* <Nav.Item>
                <Nav.Link eventKey="link-2">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                    Disabled
                </Nav.Link>
            </Nav.Item> */}
            <h2>EasyTest</h2>
        </Nav >
    )
}

export default MyNav