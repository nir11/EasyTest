import React from 'react'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'

const MyNav = () => {
    const navigate = useNavigate()
    const pushTo = (path) => {
        navigate(path)
    }
    return (
        <Nav
            activeKey="/"
        >
            <Nav.Item>
                <Nav.Link onClick={() => pushTo("/")}>קביעת תור</Nav.Link>
            </Nav.Item>

            <Nav.Item>
                <Nav.Link onClick={() => pushTo("/location")}> המלצה לפי מיקום</Nav.Link>

            </Nav.Item>
            {/* <Nav.Item>
                <Nav.Link eventKey="link-2">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                    Disabled
                </Nav.Link>
            </Nav.Item> */}
        </Nav >
    )
}

export default MyNav