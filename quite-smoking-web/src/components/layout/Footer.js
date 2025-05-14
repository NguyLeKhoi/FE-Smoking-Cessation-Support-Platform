import { Box, Typography, Container } from '@mui/material';

const Footer = () => (
  <Box 
    component="footer" 
    sx={{ 
      mt: 'auto',
      py: 3,
      backgroundColor: '#1a1a1a',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}
  >
    <Container maxWidth="lg">
      <Typography 
        variant="body2" 
        sx={{ 
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        &copy; {new Date().getFullYear()} Smoke Free. All rights reserved.
      </Typography>
    </Container>
  </Box>
);

export default Footer;
