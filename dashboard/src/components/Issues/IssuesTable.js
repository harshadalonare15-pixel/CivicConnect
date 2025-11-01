import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { FiEye, FiUserPlus } from 'react-icons/fi'; // Import new icons

const IssuesTable = ({ issues, onViewDetails, onAssignDepartmentClick }) => {
  const statusVariant = {
    pending: 'warning',
    'in progress': 'primary',
    resolved: 'success'
  };

  const priorityVariant = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  };

  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Issue</th>
          <th>Location</th> {/* New Location column */}
          <th>Category</th>
          <th>Citizen</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Department</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {issues.map(issue => (
          <tr key={issue._id}>
            <td>{issue._id.substring(0, 7)}...</td>
            <td>{issue.description}</td>
            <td>{issue.location}</td> {/* Display issue location */}
            <td>{issue.category}</td>
            <td>{issue.user ? `${issue.user.name} (${issue.user.email})` : 'N/A'}</td>
            <td><Badge bg={statusVariant[issue.status.toLowerCase()]}>{issue.status}</Badge></td>
            <td><Badge bg={issue.priority ? priorityVariant[issue.priority.toLowerCase()] : 'secondary'}>{issue.priority || 'N/A'}</Badge></td>
            <td>{issue.department ? issue.department.name : 'Unassigned'}</td>
            <td>
              <Button variant="outline-info" size="sm" className="me-1" onClick={() => onViewDetails(issue)}>
                <FiEye />
              </Button>
              {!issue.department && (
                <Button variant="outline-primary" size="sm" onClick={() => onAssignDepartmentClick(issue)}>
                  <FiUserPlus />
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default IssuesTable;
