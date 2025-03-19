import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Menu, MenuItem, IconButton,Typography } from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLoginClick = () => {
    navigate("/login"); 
    setTimeout(() => {
      window.location.reload(); 
    }, 1); 
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        background: darkMode ? '#000' : '#000', // Navbar siyah olacak
        color: '#e0e0e0',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        borderBottom: `1px solid #444`,
        borderRadius: '10px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo Section */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <img
          src="/images/logo.png"
          alt="AquAI Logo"
          style={{
            height: '40px',
            objectFit: 'contain',
          }}
        />
      </Link>

      {/* Navigation Links */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Home and Analysis Links */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: '#fff',
            position: 'relative',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 500,
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': {
                borderBottom: `2px solid ${darkMode ? '#fff' : '#343a40'}`,
                color: darkMode ? '#ddd' : '#212529',
              },
            }}
          >
            <HomeOutlinedIcon fontSize="small" />
            Home
          </Typography>
        </Link>
        <Link
          to="/analysis"
          style={{
            textDecoration: 'none',
            color: '#fff',
            position: 'relative',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 500,
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': {
                borderBottom: `2px solid ${darkMode ? '#fff' : '#343a40'}`,
                color: darkMode ? '#ddd' : '#212529',
              },
            }}
          >
            <InsightsOutlinedIcon fontSize="small" />
            Analysis
          </Typography>
        </Link>

        {/* Dropdown Menu */}
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleMenuClick}
            sx={{
              color: '#e0e0e0',
            }}
          >
            <AccountCircleIcon fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {!isAuthenticated && (
              <>
                <MenuItem onClick={handleLoginClick}>Login</MenuItem>
                <MenuItem onClick={() => navigate('/signup')}>Signup</MenuItem>
              </>
            )}
            {isAuthenticated && (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            )}
          </Menu>
          <IconButton
          onClick={toggleDarkMode}
          sx={{
            backgroundColor: darkMode ? '#1976d2' : '#90caf9',
            color: '#fff',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: darkMode ? '#115293' : '#42a5f5',
            },
            fontSize: '1.2rem', 
            width: '32px', 
            height: '32px', 
          }}
        >
          {darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
          
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
