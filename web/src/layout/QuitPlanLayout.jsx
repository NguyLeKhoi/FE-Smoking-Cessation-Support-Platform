import React from 'react';
import { Box, Paper, Typography, Container } from '@mui/material';

const QuitPlanLayout = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', py: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, boxShadow: 6 }}>
          <Typography variant="h3" fontWeight={800} align="center" mb={3} color="primary">
            Quit Plan
          </Typography>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default QuitPlanLayout; 