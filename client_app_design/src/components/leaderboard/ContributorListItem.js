import React from 'react';

const ContributorListItem = ({ rank, name, points, level }) => {
  return (
    <div className="d-flex align-items-center mb-3">
      <div className="me-3">#{rank}</div>
      <div className="me-3">AV</div>
      <div>
        <h6>{name}</h6>
        <small className="text-muted">{points} points - {level}</small>
      </div>
    </div>
  );
};

export default ContributorListItem;
