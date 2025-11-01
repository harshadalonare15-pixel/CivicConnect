import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const DepartmentPerfBar = ({ name, performance }) => {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between">
        <h6>{name}</h6>
        <small>{performance}%</small>
      </div>
      <ProgressBar now={performance} />
    </div>
  );
};

export default DepartmentPerfBar;
