import React from 'react';
import './AchievementBadge.css';

const AchievementBadge = ({ name, unlocked }) => {
  return (
    <div className={`achievement-badge ${unlocked ? 'unlocked' : ''}`}>
      <div className="icon"></div>
      <small>{name}</small>
      {unlocked && <small className="unlocked-text">Unlocked</small>}
    </div>
  );
};

export default AchievementBadge;
