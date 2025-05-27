import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import { useState } from 'react';

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
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, black, #FF8E53)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mr: 4
            }}
          >
            SMOKE FREE
          </Typography>
          <Tabs 
            value={value} 
            onChange={handleChange}
            sx={{ 
              '& .MuiTab-root': {
                color: 'black',
                '&.Mui-selected': {
                  color: '#FF8E53',
                },
              },
            }}
          >
            <Tab label="Home" />
            <Tab label="Blog" />
          </Tabs>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
