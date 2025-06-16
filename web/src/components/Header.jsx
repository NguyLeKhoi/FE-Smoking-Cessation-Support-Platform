import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Badge } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AnimatedUnderline } from './animated/AnimatedUnderline';
import motivationService from '../services/motivationService';
import toast from 'react-hot-toast';
import NotificationsDropdown from './NotificationsDropdown';

const Header = ({ authStatus }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNotificationClick = () => {
    setIsDropdownOpen((prev) => !prev);
    if (!isDropdownOpen) {
      markAllNotificationsAsRead();
    }
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => ({ ...n, read: true }))
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const fetchMotivationMessage = async () => {
      const lastMotivationToastTimestamp = sessionStorage.getItem('lastMotivationToastTimestamp');
      const twoHoursInMs = 7200000; // 2 hours
      const currentTime = new Date().getTime();

      let shouldShowToast = true;

      if (lastMotivationToastTimestamp) {
        const timeElapsed = currentTime - parseInt(lastMotivationToastTimestamp, 10);
        if (timeElapsed < twoHoursInMs) {
          shouldShowToast = false; // Less than 2 hours, don't show toast
        }
      }

      if (shouldShowToast) {
        try {
          const data = await motivationService.getMotivationMessage();
          if (data && data.data && data.data.message) {
            const fullMessage = data.data.message;
            let messageText = fullMessage;
            let timestampText = ''; // Set timestamp to empty as per previous request

            // Regex to find and extract the timestamp pattern at the very end
            // This regex will now handle the common case of HH:MM:SS MM/DD/YYYY and remove the preceding 'and' or 'at' if present
            const timestampExtractionRegex = /(?:\s*(?:and|at)?\s*)?(\d{1,2}:\d{2}:\d{2}\s\d{1,2}\/\d{1,2}\/\d{4})$/;
            const match = fullMessage.match(timestampExtractionRegex);

            if (match) {
              messageText = fullMessage.replace(match[0], '').trim();
              // timestampText remains empty as per user's request to remove it from display
            }

            // Add to notifications state for the dropdown
            setNotifications((prevNotifications) => [
              { id: Date.now(), message: messageText, timestamp: timestampText, read: false },
              ...prevNotifications,
            ]);

            toast.custom((t) => (
              <div
                onClick={() => toast.dismiss(t.id)}
                style={{
                  background: '#333',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  maxWidth: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '8px', textAlign: 'center' }}>
                  Zerotine Motivation Message
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>{messageText}</span>
                </div>
              </div>
            ), {
              duration: 7000,
              position: 'top-center',
            });
            sessionStorage.setItem('lastMotivationToastTimestamp', currentTime.toString());
          }
        } catch (error) {
          console.error('Failed to fetch motivation message:', error);
          toast.error('Failed to load motivation message', {
            duration: 4000,
            position: 'top-center',
          });
        }
      }
    };

    fetchMotivationMessage();

    const intervalId = setInterval(fetchMotivationMessage, 7200000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: '#ffffff',
          boxShadow: scrolled ? '0px 1px 8px -1px rgba(0,0,0,0.01), 0px 4px 5px 0px rgba(0,0,0,0.07), 0px 1px 10px 0px rgba(0,0,0,0.06)' : 'none',
          transition: 'box-shadow 0.3s ease',
          width: '100%',
          zIndex: 1100
        }}
      >
        <Toolbar sx={{ minHeight: 80, display: 'flex', alignItems: 'center' }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#000000',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Zerotine
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0.5 }} />

          <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <AnimatedUnderline>
              <Typography
                variant="h6"
                sx={{
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover img': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <img
                  src="icon/icons8-home-64.png"
                  alt="Home Icon"
                  style={{
                    width: '40px',
                    height: '40px',
                    verticalAlign: 'middle',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                />
                Home
              </Typography>
            </AnimatedUnderline>
          </Box>

          <Box component={RouterLink} to="/blog" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', ml: 3 }}>
            <AnimatedUnderline>
              <Typography
                variant="h6"
                sx={{
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover img': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <img
                  src="icon/icons8-newspaper-64.png"
                  alt="Blog Icon"
                  style={{
                    width: '30px',
                    height: '30px',
                    verticalAlign: 'middle',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                />
                Blog
              </Typography>
            </AnimatedUnderline>
          </Box>

          <Box component={RouterLink} to="/membership-plans" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', ml: 3 }}>
            <AnimatedUnderline>
              <Typography
                variant="h6"
                sx={{
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover img': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <img
                  src="icon/icons8-membership-64.png"
                  alt="Membership Icon"
                  style={{
                    width: '30px',
                    height: '30px',
                    verticalAlign: 'middle',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                />
                Membership
              </Typography>
            </AnimatedUnderline>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {authStatus ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleNotificationClick}
                  sx={{ color: '#3f332b', fontSize: '2rem' }}
                >
                  <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                {isDropdownOpen && (
                  <NotificationsDropdown
                    notifications={notifications}
                    onClose={() => setIsDropdownOpen(false)}
                    onMarkAllAsRead={markAllNotificationsAsRead}
                  />
                )}
                <IconButton color="inherit" component={RouterLink} to="/profile" sx={{ color: '#3f332b', fontSize: '2rem' }}>
                  <AccountCircle />
                </IconButton>
              </>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                variant="contained"
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  boxShadow: '0 4px 0 ',
                  '&:hover': {
                    bgcolor: 'black',
                    boxShadow: '0 2px 0 #000000',
                    transform: 'translateY(2px)',
                  },
                  '&:active': {
                    boxShadow: '0 0 0 #000000',
                    transform: 'translateY(4px)',
                  },
                }}
              >
                Sign in
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
