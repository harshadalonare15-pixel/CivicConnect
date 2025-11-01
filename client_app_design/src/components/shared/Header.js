import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlineUnorderedList, AiOutlineTrophy, AiOutlineUser } from 'react-icons/ai';
import './Header.css';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="app-header">
      <Container>
        <Navbar.Brand as={NavLink} to="/">CivicConnect</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/app/" end>
              <AiOutlineHome className="me-1" /> Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/app/my-reports">
              <AiOutlineUnorderedList className="me-1" /> My Reports
            </Nav.Link>
            <Nav.Link as={NavLink} to="/app/leaderboard">
              <AiOutlineTrophy className="me-1" /> Leaderboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/app/profile">
              <AiOutlineUser className="me-1" /> Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;