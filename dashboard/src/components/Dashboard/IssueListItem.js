import React from 'react';
import { Badge } from 'react-bootstrap';

const IssueListItem = ({ title, status, priority, time }) => {
  const statusVariant = {
    pending: 'warning',
    'in-progress': 'primary',
    resolved: 'success'
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h6>{title}</h6>
        <Badge bg={statusVariant[status]} className="me-2">{status}</Badge>
      </div>
      <small className="text-muted">{time}</small>
    </div>
  );
};

export default IssueListItem;
