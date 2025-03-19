import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import apiService from '../services/apiService';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setErrorMessage('Username and password fields are required.');
        return;
      }

      const credentials = { username, password };
      const response = await apiService.login(credentials);

      if (response && response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        onLogin();
        navigate('/');
      } else {
        setErrorMessage('Login failed, please check your username and password.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Giriş başarısız.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" justifyContent="center" mb={2}>
        <img src="/images/logo.png" alt="Logo" style={{ height: '100px', marginTop: 20 }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: darkMode ? 'background.default' : '#fff',
          color: darkMode ? 'text.primary' : '#000',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ marginBottom: 2 }}
        >
          Login
        </Button>
        {errorMessage && (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Login;
