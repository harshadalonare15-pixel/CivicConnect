import React from 'react';
import { Badge } from 'react-bootstrap';
import './NearbyIssueItem.css'; // Import the new CSS

const NearbyIssueItem = ({ title, distance, status }) => {
  const statusVariant = {
    Pending: 'warning',
    'In Progress': 'primary',
    Resolved: 'success'
  };

  return (
    <div className="nearby-issue-item d-flex justify-content-between align-items-center"> {/* Added class */}
      <div>
        <h6>{title}</h6>
        <small className="text-muted">{distance}</small>
      </div>
      <Badge bg={statusVariant[status]}>{status}</Badge>
    </div>
  );
};

export default NearbyIssueItem;
