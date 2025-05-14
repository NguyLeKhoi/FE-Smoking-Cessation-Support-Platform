import React from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <TextField fullWidth label="Email" margin="normal" />
        <TextField fullWidth label="Password" type="password" margin="normal" />
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>Login</Button>
      </Box>
    </Container>
  );
}
