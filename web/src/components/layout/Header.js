import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header = () => {
  const navigate = useNavigate();
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
