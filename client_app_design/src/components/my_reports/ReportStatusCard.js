import React from 'react';
import { Card, ProgressBar, Badge, Button } from 'react-bootstrap';
import { FiMessageSquare } from 'react-icons/fi';
import './ReportStatusCard.css';

const ReportStatusCard = ({ issue, location, status, progress, assignedTo }) => {
  const statusVariant = {
    Pending: 'warning',
    'In Progress': 'primary',
    Resolved: 'success'
  };

  return (
    <Card className="mb-3 report-status-card">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <Card.Title as="h6">{issue}</Card.Title>
          <Badge bg={statusVariant[status]}>{status}</Badge>
        </div>
        <Card.Subtitle className="mb-2 text-muted">{location}</Card.Subtitle>
        <Card.Text as="small">Assigned to: {assignedTo}</Card.Text>
        
        <div className="mt-3">
          <ProgressBar now={progress} label={`${progress}%`} visuallyHidden />
          <div className="stepper-wrapper mt-3">
            <div className={`step ${progress >= 0 ? 'completed' : ''}`}>Submitted</div>
            <div className={`step ${progress >= 50 ? 'completed' : ''}`}>Assigned</div>
            <div className={`step ${progress >= 60 ? 'completed' : ''}`}>In Progress</div>
            <div className={`step ${progress === 100 ? 'completed' : ''}`}>Resolved</div>
          </div>
        </div>

        <Button variant="outline-primary" className="w-100 mt-3"><FiMessageSquare className="me-2"/>Chat with Officer</Button>
      </Card.Body>
    </Card>
  );
};

export default ReportStatusCard;
