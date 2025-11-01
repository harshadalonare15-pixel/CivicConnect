import React from 'react';
import { ListGroup, Card } from 'react-bootstrap';

const TopCitizenList = ({ data }) => {
  return (
    <Card>
      <Card.Body>
        <h5>Top Contributing Citizens</h5>
        <ListGroup variant="flush">
          {data.length > 0 ? (
            data.map((citizen, index) => (
              <ListGroup.Item key={citizen.userId} className="d-flex justify-content-between align-items-center">
                {index + 1}. {citizen.fullName}
                <span>{citizen.issueCount} reports</span>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No top citizens to display.</ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default TopCitizenList;
