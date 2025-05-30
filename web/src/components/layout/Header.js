import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box} from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { isAuthenticated } from '../../services/authService';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isAuthenticated();

  return (
    <AppBar position="static" sx={{
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
      backdropFilter: 'blur(5px)', // Apply a blur effect
      WebkitBackdropFilter: 'blur(5px)', // For Safari support
      boxShadow: 'none',
      borderBottom: '1px solid #CD5656'
    }}>
      <Toolbar>
        <Typography
          variant="h4"
          component={RouterLink}
          to="/"
          sx={{
            fontWeight: 600,
            fontSize: '2.5rem',
            background: 'linear-gradient(45deg, #AF3E3E, #CD5656)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          SMOKE FREE
        </Typography>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            ml: 3,
            color: '#AF3E3E',
            textDecoration: location.pathname === '/' ? 'underline' : 'none',
            textDecorationColor: '#AF3E3E',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          Home
        </Typography>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/blog"
          sx={{
            ml: 3,
            color: '#AF3E3E',
            textDecoration: location.pathname === '/blog' ? 'underline' : 'none',
            textDecorationColor: '#AF3E3E',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          Blog
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="black">
            <NotificationsIcon />
          </IconButton>
          {loggedIn ? (
            <IconButton color="#AF3E3E" component={RouterLink} to="/profile">
              <AccountCircle />
            </IconButton>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              sx={{
                backgroundColor: '#AF3E3E',
                color: '#EAEBD0',
                '&:hover': {
                  backgroundColor: '#CD5656',
                },
                borderRadius: '20px',
                px: 2
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
