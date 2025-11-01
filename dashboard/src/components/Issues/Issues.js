import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Dropdown, Alert, InputGroup, FormControl } from 'react-bootstrap';
import StatCard from '../shared/StatCard';
import IssuesTable from './IssuesTable';
import IssueDetailsModal from './IssueDetailsModal'; // Import new modal
import { FiFilter, FiSearch } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false); // State for new modal
  const [selectedIssueForDetails, setSelectedIssueForDetails] = useState(null); // State for new modal
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterDepartment, setFilterDepartment] = useState('All Departments');
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const departmentFromUrl = queryParams.get('department');
    const statusFromUrl = queryParams.get('status');

    if (departmentFromUrl) {
      setFilterDepartment(departmentFromUrl);
    } else {
      setFilterDepartment('All Departments');
    }

    if (statusFromUrl) {
      setFilterStatus(statusFromUrl);
    } else {
      setFilterStatus('All Status');
    }
  }, [location.search]);

  const fetchIssues = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        setLoading(false);
        return;
      }
      let url = `${process.env.REACT_APP_API_BASE_URL}/api/issues`;
      const params = new URLSearchParams();

      if (filterStatus !== 'All Status') {
        params.append('status', filterStatus);
      }

      if (filterDepartment !== 'All Departments') {
        params.append('department', filterDepartment);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
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
        setError(data.msg || 'Failed to fetch issues');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  }, [filterStatus, filterDepartment, searchTerm, navigate]); // Add searchTerm to dependencies

  useEffect(() => {
    fetchIssues();
  }, [filterStatus, filterDepartment, searchTerm, fetchIssues]); // Add searchTerm to dependencies

  const handleViewDetails = (issue) => {
    setSelectedIssueForDetails(issue);
    setShowDetailsModal(true);
  };

  const handleAssignDepartmentClick = (issue) => {
    setSelectedIssueForDetails(issue);
    setShowDetailsModal(true);
    // The modal itself will handle showing the assign department form
  };

  const totalIssues = issues.length;
  const pendingIssues = issues.filter(issue => issue.status.toLowerCase() === 'pending').length;
  const inProgressIssues = issues.filter(issue => issue.status.toLowerCase() === 'in progress').length;
  const resolvedIssues = issues.filter(issue => issue.status.toLowerCase() === 'resolved').length;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container-fluid">
      <h4 className="mb-4">Issue Management</h4>
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><FiSearch /></InputGroup.Text>
            <FormControl
              placeholder="Search by ID, title, or citizen name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Dropdown className="w-100">
            <Dropdown.Toggle variant="outline-secondary" id="status-dropdown" className="w-100">
              <FiFilter /> {filterStatus}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilterStatus('All Status')}>All Status</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterStatus('Pending')}>Pending</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterStatus('In Progress')}>In Progress</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilterStatus('Resolved')}>Resolved</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={3}>
          <Dropdown className="w-100">
            <Dropdown.Toggle variant="outline-secondary" id="department-dropdown" className="w-100">
              <FiFilter /> {filterDepartment}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterDepartment('All Departments')}>All Departments</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterDepartment('Public Works')}>Public Works</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterDepartment('Health')}>Health</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterDepartment('Education')}>Education</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterDepartment('Transportation')}>Transportation</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterDepartment('Unassigned')}>Unassigned</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={3}>
          <StatCard title="Total Issues" value={totalIssues} />
        </Col>
        <Col md={3}>
          <StatCard title="Pending" value={pendingIssues} />
        </Col>
        <Col md={3}>
          <StatCard title="In Progress" value={inProgressIssues} />
        </Col>
        <Col md={3}>
          <StatCard title="Resolved" value={resolvedIssues} />
        </Col>
      </Row>
      <Row>
        <Col>
          <IssuesTable
            issues={issues}
            onViewDetails={handleViewDetails}
            onAssignDepartmentClick={handleAssignDepartmentClick}
          />
        </Col>
      </Row>
      <IssueDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        issue={selectedIssueForDetails}
        onUpdate={() => {
          setShowDetailsModal(false);
          fetchIssues(); // Refresh issues after update
        }}
      />
    </div>
  );
};

export default Issues;
