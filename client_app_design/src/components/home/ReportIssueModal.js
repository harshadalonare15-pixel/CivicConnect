import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, InputGroup, Badge } from 'react-bootstrap';
import { FiCamera, FiVideo, FiMapPin } from 'react-icons/fi'; // Added icons

const ReportIssueModal = ({ show, handleClose, defaultCategory }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(defaultCategory || 'Roads');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [truthfulnessDeclaration, setTruthfulnessDeclaration] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
    }
  }, [defaultCategory]);

  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Unable to retrieve current location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'photos') {
      if (photos.length + files.length > 5) {
        setError('You can upload a maximum of 5 photos.');
        return;
      }
      setPhotos((prev) => [...prev, ...files]);
    } else if (type === 'videos') {
      if (videos.length + files.length > 2) {
        setError('You can upload a maximum of 2 videos.');
        return;
      }
      // Basic size validation (10MB = 10 * 1024 * 1024 bytes)
      const largeVideos = files.filter(file => file.size > 10 * 1024 * 1024);
      if (largeVideos.length > 0) {
        setError('Videos must be less than 10MB each.');
        return;
      }
      setVideos((prev) => [...prev, ...files]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');
    setError('');
    setSuccess('');

    if (!truthfulnessDeclaration) {
      setError('Please confirm the declaration of truthfulness.');
      console.log('Truthfulness not declared');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      if (!token) {
        setError('Authentication token not found. Please log in.');
        console.log('Authentication token missing.');
        return;
      }

      console.log('Description:', description);
      console.log('Category:', category);
      console.log('Location:', location);
      console.log('Truthfulness Declaration:', truthfulnessDeclaration);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          description,
          category,
          location,
          truthfulnessDeclaration,
        }),
      });
      console.log('Fetch response:', response);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setSuccess('Issue reported successfully!');
        setDescription('');
        setCategory('Roads');
        setLocation('');
        setPhotos([]);
        setVideos([]);
        setTruthfulnessDeclaration(false);
        handleClose(); // Close modal on success
      } else {
        setError(data.msg || 'Failed to report issue');
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Server error');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Report a Civic Issue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="location">
            <Form.Label><FiMapPin className="me-1" /> Location <span className="text-danger">*</span></Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter your location or get current location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <Button variant="outline-secondary" onClick={getGeoLocation}>
                <FiMapPin className="me-1" /> Get Current Location
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category <span className="text-danger">*</span></Form.Label>
            <Form.Select value={category} onChange={(e) => {
              const selectedValue = String(e.target.value);
              console.log('setCategory called with:', selectedValue);
              setCategory(selectedValue);
            }}>
              <option value="Roads">Roads</option>
              <option value="Waste">Waste</option>
              <option value="Lights">Lights</option>
              <option value="Construction">Construction</option>
              <option value="Environment">Environment</option>
              <option value="Water">Water</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe the problem in detail (e.g., large pothole on MG Road, near bus stop, causing traffic issues)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiCamera className="me-1" /> Upload Photos (Max 5)</Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg,image/png,image/gif"
              multiple
              onChange={(e) => handleFileChange(e, 'photos')}
            />
            <div className="mt-2 d-flex flex-wrap">
              {photos.map((file, index) => (
                <Badge key={index} bg="secondary" className="me-2 mb-2">
                  {file.name}
                </Badge>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FiVideo className="me-1" /> Upload Videos (Max 2, 10MB each)</Form.Label>
            <Form.Control
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv"
              multiple
              onChange={(e) => handleFileChange(e, 'videos')}
            />
            <div className="mt-2 d-flex flex-wrap">
              {videos.map((file, index) => (
                <Badge key={index} bg="secondary" className="me-2 mb-2">
                  {file.name}
                </Badge>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="truthfulnessDeclaration">
            <Form.Check
              type="checkbox"
              label={
                <span>
                  <span className="fw-bold">Declaration of Truthfulness</span><br />
                  I hereby confirm that the information and evidence provided in this complaint is true and accurate to the best of my knowledge. I understand that filing false complaints may result in penalties.
                </span>
              }
              checked={truthfulnessDeclaration}
              onChange={(e) => setTruthfulnessDeclaration(e.target.checked)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Submit Complaint
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReportIssueModal;
