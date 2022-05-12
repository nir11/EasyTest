import React from 'react'
import { Nav } from 'react-bootstrap'

const MyNav = () => {
    return (
        <Nav
            activeKey="/"
        >
            <Nav.Item>
                <Nav.Link href="/">בית</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/location">מיקום</Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
                <Nav.Link eventKey="link-2">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                    Disabled
                </Nav.Link>
            </Nav.Item> */}
        </Nav>
    )
}

export default MyNav