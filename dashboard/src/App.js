import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopNav from './components/shared/TopNav';
import MainNav from './components/shared/MainNav';
import Dashboard from './components/Dashboard/Dashboard';
import Issues from './components/Issues/Issues';
import Departments from './components/Departments/Departments';
import Analytics from './components/Analytics/Analytics';
import DepartmentDetailScreen from './screens/DepartmentDetailScreen';
import LoginScreen from './screens/LoginScreen';
import PrivateRoute from './components/shared/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <TopNav />
                <main className="main-content container">
                  <MainNav />
                  <div className="p-4">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/issues" element={<Issues />} />
                      <Route path="/departments" element={<Departments />} />
                      <Route path="/departments/:departmentName" element={<DepartmentDetailScreen />} />
                      <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                  </div>
                </main>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;