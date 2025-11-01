import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const AddDepartmentModal = ({ show, handleClose, onAdd }) => {
  const [name, setName] = useState('');
  const [head, setHead] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ name, head, email, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Department added successfully!');
        setName('');
        setHead('');
        setEmail('');
        setPhone('');
        onAdd(data); // Pass new department back to parent
        handleClose();
      } else {
        setError(data.msg || 'Failed to add department');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Department</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="departmentName">
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter department name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="departmentHead">
            <Form.Label>Department Head</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter department head's name"
              value={head}
              onChange={(e) => setHead(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="departmentEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter department email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="departmentPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter department phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Add Department
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDepartmentModal;
