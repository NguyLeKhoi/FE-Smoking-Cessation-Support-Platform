import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box} from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header = ({ authStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (pathname) => location.pathname === pathname;

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
            textDecoration: 'none', // Remove underline
            display: 'flex',
            alignItems: 'center',
            gap: 0.7,
            px: 2, // Add padding
            py: 1, // Add padding
            borderRadius: '8px', // Add rounded corners
            bgcolor: isActive('/') ? '#1c2833' : 'transparent', // Darker background if active
            color: isActive('/') ? '#00b0ff' : 'white', // Blue text if active, white otherwise
            '&:hover': {
              opacity: 0.8,
              'img': {
                transform: 'translateY(-5px)'
              },
              // Apply hover background only if not active
              bgcolor: !isActive('/') && '#3a475c',
            }
          }}
        >
          <img src="icon/icons8-home-64.png" alt="Home Icon" style={{ width: '40px', height: '40px', verticalAlign: 'middle', transition: 'transform 0.3s ease-in-out' }} />
          Home
        </Typography>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/blog"
          sx={{
            ml: 3,
            textDecoration: 'none', // Remove underline
            display: 'flex',
            alignItems: 'center',
            gap: 0.7,
            px: 2, // Add padding
            py: 1, // Add padding
            borderRadius: '8px', // Add rounded corners
            bgcolor: isActive('/blog') ? '#1c2833' : 'transparent', // Darker background if active
            color: isActive('/blog') ? '#00b0ff' : 'white', // Blue text if active, white otherwise
            '&:hover': {
              opacity: 0.8,
              'img': {
                transform: 'translateY(-5px)'
              },
              // Apply hover background only if not active
              bgcolor: !isActive('/blog') && '#3a475c',
            }
          }}
        >
          <img src="icon/icons8-newspaper-64.png" alt="Blog Icon" style={{ width: '30px', height: '30px', verticalAlign: 'middle', transition: 'transform 0.3s ease-in-out' }} />
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
                bgcolor: '#00b0ff', // Vibrant blue background
                color: 'white', // White text color
                borderRadius: '8px', // More rounded corners
                px: 3,
                py: 1,
                boxShadow: '0 4px 0 #007ac1', // Custom box shadow for 3D effect
                '&:hover': {
                  bgcolor: '#0091ea', // Slightly darker blue on hover
                  boxShadow: '0 2px 0 #007ac1', // Adjust shadow on hover
                  transform: 'translateY(2px)', // Move button down slightly on hover
                },
                '&:active': {
                  boxShadow: '0 0 0 #007ac1', // Remove shadow when pressed
                  transform: 'translateY(4px)', // Move button down further when pressed
                },
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
