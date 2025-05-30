<<<<<<< HEAD
import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import { useState } from 'react';
=======
import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
>>>>>>> 7169748a9dd019619328d42dbbd4668458178070

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname === '/' ? 0 : 1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate('/');
    } else if (newValue === 1) {
      navigate('/blog');
    }
  };

  return (
    <AppBar position="static" sx={{
      backgroundColor: 'white',
      boxShadow: 'none',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="black"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
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
           For employees
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
