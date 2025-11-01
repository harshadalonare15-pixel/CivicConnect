import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import StatCard from '../shared/StatCard';
import IssueListItem from './IssueListItem';
import DepartmentPerfBar from './DepartmentPerfBar';
import { FiTrendingUp } from 'react-icons/fi';
import { BiTask, BiCheckCircle, BiErrorCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (!storedUserInfo) {
            navigate('/login');
        }
    }, [navigate]);

  const fetchIssues = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        setLoading(false);
        return;
      }
      const response = await fetch('/api/issues', {
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
  }, [navigate]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  const totalReports = issues.length;
  const pendingReports = issues.filter(issue => issue.status === 'Pending').length;
  const inProgressReports = issues.filter(issue => issue.status === 'In Progress').length;
  const resolvedToday = issues.filter(issue => {
    const today = new Date();
    const issueDate = new Date(issue.createdAt);
    return issue.status === 'Resolved' &&
           issueDate.getDate() === today.getDate() &&
           issueDate.getMonth() === today.getMonth() &&
           issueDate.getFullYear() === today.getFullYear();
  }).length;

  const issuesByCategory = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {});

  const departmentPerformance = issues.reduce((acc, issue) => {
    if (issue.department && issue.status === 'Resolved') {
      acc[issue.department] = (acc[issue.department] || 0) + 1;
    }
    return acc;
  }, {});

  const recentIssues = issues.slice(0, 4); // Display top 4 recent issues

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold">Dashboard Overview</h4>
        <small className="text-muted">Last updated: {new Date().toLocaleTimeString()}</small>
      </div>

      <Row className="g-4 mb-5">
        <Col lg={3} md={6}>
          <StatCard title="Total Reports" value={totalReports} icon={<FiTrendingUp />} iconBg="#e3f2fd" />
        </Col>
        <Col lg={3} md={6}>
          <StatCard title="Pending" value={pendingReports} icon={<BiErrorCircle />} iconBg="#ffebee" />
        </Col>
        <Col lg={3} md={6}>
          <StatCard title="In Progress" value={inProgressReports} icon={<BiTask />} iconBg="#fff3e0" />
        </Col>
        <Col lg={3} md={6}>
          <StatCard title="Resolved Today" value={resolvedToday} icon={<BiCheckCircle />} iconBg="#e8f5e8" />
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-white border-bottom-0">
              <h5 className="mb-0 fw-bold text-primary">Recent Issues</h5>
            </Card.Header>
            <Card.Body>
              {recentIssues.length > 0 ? (
                recentIssues.map(issue => (
                  <IssueListItem
                    key={issue._id}
                    title={issue.description}
                    status={issue.status.toLowerCase()}
                    priority="medium" // Assuming a default priority for now
                    time={new Date(issue.createdAt).toLocaleDateString()} // Display creation date
                  />
                ))
              ) : (
                <p>No recent issues.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-white border-bottom-0">
              <h5 className="mb-0 fw-bold text-primary">Department Performance</h5>
            </Card.Header>
            <Card.Body>
              {Object.entries(departmentPerformance).length > 0 ? (
                Object.entries(departmentPerformance).map(([department, resolvedCount]) => (
                  <DepartmentPerfBar
                    key={department}
                    name={department}
                    performance={totalReports > 0 ? (resolvedCount / totalReports) * 100 : 0} // Simple performance metric
                  />
                ))
              ) : (
                <p>No department performance data.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header className="bg-white border-bottom-0">
          <h5 className="mb-0 fw-bold text-primary">Issues by Category</h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {Object.entries(issuesByCategory).length > 0 ? (
              Object.entries(issuesByCategory).map(([category, count]) => (
                <Col xl={2} lg={3} md={4} sm={6} key={category}>
                  <StatCard title={category} value={count} />
                </Col>
              ))
            ) : (
              <Col><p>No issues by category data.</p></Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
