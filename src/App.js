import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import AnalysisPage from './Components/AnalysisPage';
import Mainpage from './Components/Mainpage';
import LakeDetailPage from './Components/LakeDetailPage';
import apiService from './services/apiService';
import { Alert, Container, Button } from '@mui/material';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentication Handlers
  const handleLogin = useCallback(() => {
    const token = apiService.getToken();
    if (token) {
      if (apiService.isTokenExpired(token)) {
        apiService.refreshToken().then(() => setIsAuthenticated(true));
      } else {
        apiService.verifyToken().then(() => setIsAuthenticated(true));
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    apiService.logout();
    setIsAuthenticated(false);
  }, []);

  // Private Route Component
  const PrivateRoute = ({ element }) => (
    isAuthenticated ? element : (
      <Container maxWidth="sm" style={{ marginTop: '20px', textAlign: 'center' }}>
        <Alert severity="error" variant="outlined">
          You must be logged in to access this page.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '10px' }}
          onClick={() => window.location.href = '/login'}
        >
          Go to Login Page
        </Button>
      </Container>
    )
  );

  // Effect to Check Token
  useEffect(() => {
    if (apiService.getToken()) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div style={{
      backgroundImage: (window.location.pathname === '/login' || window.location.pathname === '/signup') ? "url('/images/background.webp?v=1')" : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100vw',
      position: 'relative'
    }}>
      {(window.location.pathname === '/login' || window.location.pathname === '/signup') && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1
        }}></div>
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Router>
          <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/" /> : <SignUp onSignup={handleLogin} />}
            />
            <Route
              path="/analysis"
              element={<PrivateRoute element={<AnalysisPage />} />}
            />
            <Route
              path="/lake/:lakeId"
              element={<PrivateRoute element={<LakeDetailPage />} />}
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
