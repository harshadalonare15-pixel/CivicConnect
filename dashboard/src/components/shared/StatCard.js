import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, value, change, icon, iconBg }) => {
  return (
    <Card className="stat-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title as="h6">{title}</Card.Title>
            <Card.Text as="h4" className="fw-bold">{value}</Card.Text>
            {change && <small>{change}</small>}
          </div>
          <div className="icon-wrapper" style={{ backgroundColor: iconBg }}>
            {icon}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
