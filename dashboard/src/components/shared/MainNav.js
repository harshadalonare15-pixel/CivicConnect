import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { RiDashboardLine, RiFileList2Line, RiBuildingLine, RiBarChartLine } from 'react-icons/ri';

const MainNav = () => {
  return (
    <div className="d-flex justify-content-center mb-4">
      <Nav variant="pills" defaultActiveKey="/" className="main-nav">
        <Nav.Item>
          <Nav.Link as={NavLink} to="/" end className="d-flex align-items-center">
            <RiDashboardLine className="me-2" size={20} />
            <span className="fw-medium">Dashboard</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/issues" className="d-flex align-items-center">
            <RiFileList2Line className="me-2" size={20} />
            <span className="fw-medium">Issues</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/departments" className="d-flex align-items-center">
            <RiBuildingLine className="me-2" size={20} />
            <span className="fw-medium">Departments</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/analytics" className="d-flex align-items-center">
            <RiBarChartLine className="me-2" size={20} />
            <span className="fw-medium">Analytics</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default MainNav;
