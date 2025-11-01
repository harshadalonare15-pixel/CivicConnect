import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import StatCard from '../shared/StatCard';
import DepartmentCard from './DepartmentCard';
import AddDepartmentModal from './AddDepartmentModal'; // Import new modal
import { useNavigate } from 'react-router-dom';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false); // State for add department modal
  const navigate = useNavigate();

  const fetchDepartmentsAndIssues = useCallback(async () => {
    console.log('Fetching departments and issues...');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        console.log('No token found, redirecting to login.');
        return;
      }

      const headers = { 'x-auth-token': token };

      // Fetch all departments
      const deptRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/departments`, { headers });
      const deptData = await deptRes.json();
      if (deptRes.ok) {
        setDepartments(deptData);
        console.log('Fetched departments:', deptData);
      } else {
        setError(deptData.msg || 'Failed to fetch departments');
        console.error('Error fetching departments:', deptData.msg);
      }

      // Fetch all issues to calculate stats per department
      const issuesRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/issues`, { headers });
      const issuesData = await issuesRes.json();
      if (issuesRes.ok) {
        setAllIssues(issuesData);
        console.log('Fetched all issues:', issuesData);
      } else {
        setError(issuesData.msg || 'Failed to fetch all issues');
        console.error('Error fetching all issues:', issuesData.msg);
      }

    } catch (err) {
      console.error('Error in fetchDepartmentsAndIssues:', err);
      setError('Server error');
    } finally {
      setLoading(false);
      console.log('Finished fetching departments and issues. Loading set to false.');
    }
  }, [navigate]);

  useEffect(() => {
    fetchDepartmentsAndIssues();
  }, [fetchDepartmentsAndIssues]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading departments and issues...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const totalDepartments = departments.length;
  const totalIssues = allIssues.length;
  const activeIssues = allIssues.filter(issue => issue.status !== 'Resolved').length;
  const resolvedToday = allIssues.filter(issue => {
    const today = new Date();
    const issueDate = new Date(issue.createdAt);
    return issue.status === 'Resolved' &&
           issueDate.getDate() === today.getDate() &&
           issueDate.getMonth() === today.getMonth() &&
           issueDate.getFullYear() === today.getFullYear();
  }).length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Department Management</h4>
        <Button variant="primary" onClick={() => setShowAddDepartmentModal(true)}>Add Department</Button>
      </div>

      <Row className="mb-4">
        <Col><StatCard title="Total Departments" value={totalDepartments} /></Col>
        <Col><StatCard title="Total Issues" value={totalIssues} /></Col>
        <Col><StatCard title="Active Issues" value={activeIssues} /></Col>
        <Col><StatCard title="Resolved Today" value={resolvedToday} /></Col>
      </Row>

      <Row className="mt-4">
        {departments.length > 0 ? (
          departments.map(dept => {
            const deptIssues = allIssues.filter(issue => issue.department === dept._id);
            const deptActive = deptIssues.filter(issue => issue.status !== 'Resolved').length;
            const deptResolved = deptIssues.filter(issue => issue.status === 'Resolved').length;
            const deptTotal = deptIssues.length;
            // Placeholder for avgTime and performance, as this requires more complex logic
            const avgTime = 'N/A';
            const performance = 'N/A';

            return (
              <Col md={6} key={dept._id}>
                <DepartmentCard
                  department={dept}
                  active={deptActive}
                  resolved={deptResolved}
                  total={deptTotal}
                  avgTime={avgTime}
                  performance={performance}
                />
              </Col>
            );
          })
        ) : (
          <Col><Alert variant="info">No departments found. Click 'Add Department' to create one.</Alert></Col>
        )}
      </Row>

      <AddDepartmentModal
        show={showAddDepartmentModal}
        handleClose={() => setShowAddDepartmentModal(false)}
        onAdd={() => {
          setShowAddDepartmentModal(false);
          fetchDepartmentsAndIssues(); // Refresh departments after adding new one
        }}
      />
    </div>
  );
};

export default Departments;
