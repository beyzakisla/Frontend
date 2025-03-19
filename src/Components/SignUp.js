import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  Paper,
} from '@mui/material';
import apiService from '../services/apiService';

const SignUp = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      // Error Handling
      if (!username || !password) {
        setErrorMessage('Username and password fields are required.');
        return;
      }

      if (username.length < 3 || username.length > 20) {
        setErrorMessage('Username must be between 3 and 20 characters.');
        return;
      }

      if (!email) {
        setErrorMessage('Email field is required.');
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      const userData = { username, password, email, name, surname };
      const response = await apiService.register(userData);
      if (response) {
        onSignup();
        navigate('/login');
      } else {
        setErrorMessage('An error occurred during registration.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Registration failed.');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Paper 
  elevation={4} 
  sx={{ 
    padding: 4, 
    borderRadius: 3, 
    width: '100%', 
    backgroundColor: 'background.default', 
    color: 'text.primary' 
  }}
>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <Box component="form">
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, padding: 1 }}
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
