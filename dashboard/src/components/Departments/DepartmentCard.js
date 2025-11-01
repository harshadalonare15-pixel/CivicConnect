import React from 'react';
import { Card, ProgressBar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiPhone } from 'react-icons/fi';

const DepartmentCard = ({ department, active, resolved, total, avgTime, performance }) => {
  console.log('DepartmentCard received department:', department);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/departments/${department.name}`);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <Card.Title as="h5">{department.name}</Card.Title>
          {performance !== 'N/A' && <small className="text-muted">{performance}% Performance</small>}
        </div>
        <Card.Subtitle className="mb-2 text-muted">Head: {department.head}</Card.Subtitle>
        <Card.Text>
          <FiMail className="me-1" />{department.email}<br />
          <FiPhone className="me-1" />{department.phone}
        </Card.Text>
        <div className="d-flex justify-content-around my-3 text-center">
          <div><strong>{active}</strong><br /><small>Active</small></div>
          <div><strong>{resolved}</strong><br /><small>Resolved</small></div>
          <div><strong>{avgTime}</strong><br /><small>Avg Time</small></div>
        </div>
        {performance !== 'N/A' && <ProgressBar now={performance} className="mb-3"/>}
        <div className="d-flex justify-content-end">
          <Button variant="outline-primary" size="sm" onClick={handleViewDetails}>View Details</Button>
          <Button variant="primary" size="sm" className="ms-2" onClick={() => navigate(`/issues?department=${department.name}`)}>View Issues</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DepartmentCard;
