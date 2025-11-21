import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../assets/img/logo.png';

import {Button, InputGroup, Form} from "react-bootstrap";

function Navigation() {
    return (
        <Navbar expand="lg" className="brand-navbar">
            <Container fluid>
                <div className="d-flex justify-content-between align-items-center w-100">

                    {/* Logo and Brand */}
                    <div className="d-flex align-items-center">
                        <img
                            src={logo}
                            alt="GameAble Logo"
                            height="40" // adjust size
                            className="d-inline-block align-top"
                        />
                        <Navbar.Brand href="/" className="title">GameAble</Navbar.Brand>
                    </div>

                    {/*Centre Field*/}
                    <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 mx-4">

                        {/* Search Form */}
                        <div className="flex-grow-1 d-flex justify-content-center">
                            <Form>
                                <InputGroup>
                                    <Form.Group className="search-field" controlId="search-field">
                                        <Form.Control type="search" placeholder="Search games..." />
                                    </Form.Group>
                                    <Button className="search-button" variant="link" type="submit">
                                        <svg
                                            className="search-icon"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                        >
                                            <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
                                        </svg>
                                    </Button>
                                </InputGroup>
                            </Form>
                        </div>

                        {/* Navigation Links */}
                        <div className="d-flex justify-content-center">
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="navbar-nav">
                                    <Nav.Link href="/wishlist" className="wishlist">Wishlist</Nav.Link>
                                    <Nav.Link href="/profile" className="profile">Profile</Nav.Link>
                                    <Nav.Link href="/settings" className="settings">Settings</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </div>
                    </div>

                    {/* Auth Section: Greeting + Logout Icon */}
                    <div className="auth-section d-flex align-items-center">
                        <div className="auth-section d-flex align-items-center">
                            <span className="user-greeting">Hello, User</span>
                            <Button className="auth-section auth-button" aria-label="Logout" variant="link" type="button">
                                <svg
                                    className="logout-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    aria-hidden="true"
                                    focusable="false"
                                >
                                    <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-11H5a2 2 0 00-2 2v6h2V4h14v16H5v-6H3v6a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </Navbar>

    );
}

export default Navigation;