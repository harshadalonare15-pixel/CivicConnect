import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlineUnorderedList, AiOutlineTrophy, AiOutlineUser } from 'react-icons/ai';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <Nav className="bottom-nav">
      <Nav.Item>
        <Nav.Link as={NavLink} to="/app/" end>
          <AiOutlineHome />
          <small>Home</small>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/app/my-reports">
          <AiOutlineUnorderedList />
          <small>My Reports</small>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/app/leaderboard">
          <AiOutlineTrophy />
          <small>Leaderboard</small>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/app/profile">
          <AiOutlineUser />
          <small>Profile</small>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default BottomNav;
