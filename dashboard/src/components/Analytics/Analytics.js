import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Button, Dropdown, Spinner, Alert } from 'react-bootstrap';
import StatCard from '../shared/StatCard';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import TopCitizenList from './TopCitizenList';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [issuesOverTime, setIssuesOverTime] = useState([]);
  const [topCitizens, setTopCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = { 'x-auth-token': token };

      // Fetch category counts
      const categoryRes = await fetch(`/api/issues/category-counts`, { headers });
      const categoryData = await categoryRes.json();
      if (categoryRes.ok) setCategoryCounts(categoryData);
      else setError(categoryData.msg || 'Failed to fetch category counts');

      // Fetch status counts
      const statusRes = await fetch(`/api/issues/status-counts`, { headers });
      const statusData = await statusRes.json();
      if (statusRes.ok) setStatusCounts(statusData);
      else setError(statusData.msg || 'Failed to fetch status counts');

      // Fetch issues over time
      const timeRes = await fetch(`/api/issues/issues-over-time`, { headers });
      const timeData = await timeRes.json();
      if (timeRes.ok) setIssuesOverTime(timeData);
      else setError(timeData.msg || 'Failed to fetch issues over time');

      // Fetch top citizens
      const citizensRes = await fetch(`/api/users/top-citizens`, { headers });
      const citizensData = await citizensRes.json();
      if (citizensRes.ok) setTopCitizens(citizensData);
      else setError(citizensData.msg || 'Failed to fetch top citizens');

    } catch (err) {
      console.error(err);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // Calculate total reports
  const totalReports = statusCounts.reduce((sum, item) => sum + item.count, 0);
  const resolvedReports = statusCounts.find(item => item._id === 'Resolved')?.count || 0;
  const resolutionRate = totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(2) : 0;

  // Placeholder for Avg Response Time and Active Citizens
  const avgResponseTime = 'N/A';
  const activeCitizens = 'N/A';

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Analytics & Insights</h4>
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              Last 7 Days
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/">Last 7 Days</Dropdown.Item>
              <Dropdown.Item href="#/">Last 30 Days</Dropdown.Item>
              <Dropdown.Item href="#/">Last 90 Days</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="primary" className="ms-2">Export Report</Button>
        </div>
      </div>

      <Row>
        <Col><StatCard title="Total Reports" value={totalReports} /></Col>
        <Col><StatCard title="Resolution Rate" value={`${resolutionRate}%`} /></Col>
        <Col><StatCard title="Avg Response Time" value={avgResponseTime} /></Col>
        <Col><StatCard title="Active Citizens" value={activeCitizens} /></Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}><LineChart data={issuesOverTime} /></Col>
        <Col md={6}><PieChart data={categoryCounts} /></Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}><BarChart data={statusCounts} /></Col>
        <Col md={6}><TopCitizenList data={topCitizens} /></Col>
      </Row>
    </div>
  );
};

export default Analytics;
