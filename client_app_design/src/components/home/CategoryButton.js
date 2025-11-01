import React from 'react';
import './CategoryButton.css';

const CategoryButton = ({ icon, name, reports, onClick }) => {
  return (
    <div className="category-button" onClick={onClick}>
      <div className="icon-wrapper">{icon}</div>
      <small>{name}</small>
      <small className="text-muted">{reports} reports</small>
    </div>
  );
};

export default CategoryButton;
