import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/shared/Header';
import HomeScreen from './screens/HomeScreen';
import MyReportsScreen from './screens/MyReportsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CitySelectionScreen from './screens/CitySelectionScreen';
import PrivateRoute from './components/shared/PrivateRoute';
import InitialRouteHandler from './components/shared/InitialRouteHandler';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<InitialRouteHandler />} />
          <Route path="/city-selection" element={<CitySelectionScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route
            path="/app/*"
            element={
              <PrivateRoute>
                <Header />
                <div className="screen-content">
                  <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/my-reports" element={<MyReportsScreen />} />
                    <Route path="/leaderboard" element={<LeaderboardScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                  </Routes>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;