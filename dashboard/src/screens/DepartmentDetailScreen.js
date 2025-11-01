import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';
import IssuesTable from '../components/Issues/IssuesTable';
import IssueDetailsModal from '../components/Issues/IssueDetailsModal'; // Import new modal

const DepartmentDetailScreen = () => {
  const { departmentName } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false); // State for new modal
  const [selectedIssueForDetails, setSelectedIssueForDetails] = useState(null); // State for new modal

  const fetchDepartmentIssues = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        setLoading(false);
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/issues?department=${departmentName}`, {
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setIssues(data);
      } else {
        setError(data.msg || 'Failed to fetch department issues');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  }, [departmentName, navigate]);

  useEffect(() => {
    fetchDepartmentIssues();
  }, [departmentName, fetchDepartmentIssues]);

  const handleViewDetails = (issue) => {
    setSelectedIssueForDetails(issue);
    setShowDetailsModal(true);
  };

  const handleAssignDepartmentClick = (issue) => {
    setSelectedIssueForDetails(issue);
    setShowDetailsModal(true);
  };

  const handleUpdateIssue = () => {
    setShowDetailsModal(false);
    fetchDepartmentIssues(); // Refresh issues after update
  };

  if (loading) {
    return <Container><p>Loading department issues...</p></Container>;
  }

  if (error) {
    return <Container><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Issues for {departmentName} Department</h4>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back to Departments</Button>
      </div>

      {issues.length > 0 ? (
        <IssuesTable
          issues={issues}
          onViewDetails={handleViewDetails}
          onAssignDepartmentClick={handleAssignDepartmentClick}
        />
      ) : (
        <Alert variant="info">No issues found for this department.</Alert>
      )}

      {selectedIssueForDetails && (
        <IssueDetailsModal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          issue={selectedIssueForDetails}
          onUpdate={handleUpdateIssue}
        />
      )}
    </Container>
  );
};

export default DepartmentDetailScreen;
