import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Link } from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" sx={{
      backgroundColor: 'white',
      boxShadow: 'none',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Toolbar>
        <Typography
          variant="h4"
          component={RouterLink}
          to="/"
          sx={{
            fontWeight: 600,
            fontSize: '2.5rem',
            background: 'linear-gradient(45deg, black, #FF8E53)',
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
          to="/blog"
          sx={{
            ml: 3,
            color: 'black',
            textDecoration: location.pathname === '/blog' ? 'underline' : 'none',
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
          <Button
            color="black"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: 'grey',
              },
              borderRadius: '20px',
              px: 2
            }}
          >
           Sign in
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
