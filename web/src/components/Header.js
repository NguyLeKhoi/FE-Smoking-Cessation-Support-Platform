import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box} from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header = ({ authStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" sx={{
      bgcolor: '#2c3e50', // Dark background color
      boxShadow: 'none',
      borderBottom: '1px solid #3a3a3a' // Darker border color
    }}>
      <Toolbar sx={{ minHeight: 80, display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="h4"
          component={RouterLink}
          to="/"
          sx={{
            fontWeight: 600,
            fontSize: '3rem',
            color: '#FFDB58', // Change to Mustard Yellow color for logo
            textDecoration: 'none',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          {/* SMOKE FREE */}
        </Typography>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            ml: 3,
            color: 'white', // Change back to white text color
            textDecoration: location.pathname === '/' ? 'underline' : 'none',
            textDecorationColor: 'white', // Change back to white underline
            '&:hover': {
              opacity: 0.8,
              'img': { // Apply hover effect to the image inside Typography
                transform: 'translateY(-5px)' // Move image up on hover
              }
            }
          }}
        >
          <img src="icon/icons8-home-64.png" alt="Home Icon" style={{ width: '40px', height: '40px', verticalAlign: 'middle', transition: 'transform 0.3s ease-in-out' }} /> {/* Add custom Home Icon */}
          Home
        </Typography>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/blog"
          sx={{
            ml: 3,
            color: 'white', // Change back to white text color
            textDecoration: location.pathname === '/blog' ? 'underline' : 'none',
            textDecorationColor: 'white', // Change back to white underline
            '&:hover': {
              opacity: 0.8,
              'img': { // Apply hover effect to the image inside Typography
                transform: 'translateY(-5px)' // Move image up on hover
              }
            },
            display: 'flex', // Use flexbox to align icon and text
            alignItems: 'center', // Vertically align items
            gap: 0.7 // Add a small gap between icon and text
          }}
        >
          <img src="icon/icons8-newspaper-64.png" alt="Blog Icon" style={{ width: '30px', height: '30px', verticalAlign: 'middle', transition: 'transform 0.3s ease-in-out' }} /> {/* Add custom Blog Icon */}
          Blog
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              color: '#FFDB58',
              fontWeight: 800,
            }}
          >
            Quitify
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {authStatus ? (
            <IconButton color="inherit" component={RouterLink} to="/profile" sx={{ color: 'white', fontSize: '2rem' }}>
              <AccountCircle />
            </IconButton>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              sx={{
                bgcolor: '#00b0ff', // Keep blue button from login
                '&:hover': {
                  bgcolor: '#0091ea', // Keep darker blue on hover
                },
                borderRadius: '4px',
                px: 3,
                py: 1,
                color: 'white', // Keep white text on button
              }}
            >
             Sign in
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
