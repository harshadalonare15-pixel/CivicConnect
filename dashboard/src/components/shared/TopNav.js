import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { SlLogout } from "react-icons/sl";
import { IoIosArrowDown, IoMdNotificationsOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="top-nav px-4 py-3">
      <Navbar.Brand href="#home" className="fw-bold d-flex align-items-center">
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
          CC
        </div>
        <div>
          <div className="fs-5">CivicConnect</div>
          <div style={{fontSize: '12px', fontWeight: 'normal', color: '#6c757d'}}>Pune <IoIosArrowDown /></div>
        </div>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto d-flex align-items-center">
          <Nav.Link href="#notifications" className="me-3 position-relative">
            <IoMdNotificationsOutline size={24} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '10px'}}>
              3
            </span>
          </Nav.Link>
          <Nav.Link href="#link" className="me-3 fw-medium">Change City</Nav.Link>
          <Button variant="outline-primary" size="sm" className='d-flex align-items-center px-3 py-2' onClick={handleLogout}>
            <SlLogout className='me-2'/>
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNav;
