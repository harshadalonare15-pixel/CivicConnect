import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { FiUserPlus, FiMap } from 'react-icons/fi';

const IssueDetailsModal = ({ show, handleClose, issue, onUpdate }) => {
  const [status, setStatus] = useState('');
  const [departmentId, setDepartmentId] = useState(''); // Store department ID
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDepartmentAssign, setShowDepartmentAssign] = useState(false);

  const fetchDepartments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/departments`, {
        headers: { 'x-auth-token': token },
      });
      const data = await response.json();
      if (response.ok) {
        setAvailableDepartments(data);
      } else {
        setError(data.msg || 'Failed to fetch departments');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    if (issue) {
      setStatus(issue.status);
      // Set departmentId if issue.department is an object (populated) or a string (ID)
      if (issue.department) {
        setDepartmentId(typeof issue.department === 'object' ? issue.department._id : issue.department);
      } else {
        setDepartmentId('');
      }
      setShowDepartmentAssign(!issue.department); // Show assign if department is null/undefined
    }
  }, [issue]);

  const handleStatusUpdate = async (newStatus) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/issues/${issue._id}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Status updated successfully!');
        onUpdate(data); // Pass updated issue back to parent
        setStatus(newStatus);
      } else {
        setError(data.msg || 'Failed to update status');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleDepartmentAssign = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!departmentId) {
      setError('Please select a department.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/issues/${issue._id}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ department: departmentId }), // Send department ID
      });

      const data = await response.json();

      if (response.ok) {
        const assignedDept = availableDepartments.find(dept => dept._id === departmentId);
        setSuccess(`Issue assigned to ${assignedDept ? assignedDept.name : 'Unknown'} department!`);
        onUpdate(data); // Pass updated issue back to parent
        setShowDepartmentAssign(false);
      } else {
        setError(data.msg || 'Failed to assign department');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleViewOnMap = () => {
    // Implement map view logic here, e.g., open a new tab with Google Maps
    if (issue?.location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${issue.location}`, '_blank');
    }
  };

  const assignedDepartmentName = issue?.department ? (typeof issue.department === 'object' ? issue.department.name : availableDepartments.find(dept => dept._id === issue.department)?.name || 'N/A') : 'Not Assigned';

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Issue Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {issue && (
          <div>
            <p><strong>Issue ID:</strong> {issue._id?.substring(0, 7)}...</p>
            <p><strong>Title:</strong> {issue.description}</p>
            <p><strong>Category:</strong> {issue.category}</p>
            <p><strong>Reported By:</strong> {issue.user ? `${issue.user.name} (${issue.user.email})` : 'N/A'}</p>
            <p><strong>Location:</strong> {issue.location}</p>
            <p><strong>Reported On:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
            <p><strong>Current Status:</strong> {status}</p>
            <p><strong>Assigned Department:</strong> {assignedDepartmentName}</p>

            {showDepartmentAssign && (
              <Form onSubmit={handleDepartmentAssign} className="mb-3">
                <Form.Group controlId="assignDepartment">
                  <Form.Label>Assign Department</Form.Label>
                  <InputGroup>
                    <Form.Select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      required
                    >
                      <option value="">Select Department</option>
                      {availableDepartments.map(dept => (
                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                      ))}
                    </Form.Select>
                    <Button variant="primary" type="submit">
                      <FiUserPlus className="me-1" /> Assign
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Form>
            )}

            <div className="d-flex justify-content-between mt-4">
              <div>
                <Button variant="success" onClick={() => handleStatusUpdate('Resolved')} className="me-2">Mark Resolved</Button>
                <Button variant="warning" onClick={() => handleStatusUpdate('In Progress')} className="me-2">Mark In Progress</Button>
                <Button variant="danger" onClick={() => handleStatusUpdate('Pending')}>Mark Pending</Button>
              </div>
              <Button variant="info" onClick={handleViewOnMap}>
                <FiMap className="me-1" /> View on Map
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default IssueDetailsModal;
