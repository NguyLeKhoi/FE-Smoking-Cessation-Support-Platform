import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Alert, CircularProgress, Paper } from '@mui/material';
import { sendCoachCode } from '../../services/authService';

export default function AdminCoach() {
  // State cho gửi mã xác thực
  const [email, setEmail] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');

  // Gửi mã xác thực
  const handleSendCode = async (e) => {
    e.preventDefault();
    setSendLoading(true);
    setSendError('');
    setSendSuccess('');
    try {
      await sendCoachCode({ email, callbackUrl });
      setSendSuccess('Verification code sent successfully!');
      setCodeSent(true);
    } catch (err) {
      setSendError(typeof err === 'string' ? err : (err?.message || 'Failed to send code'));
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h5" fontWeight={900} mb={2} color="#111">Coach Verification</Typography>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0', bgcolor: '#fafbfc' }}>
        <Typography variant="h6" fontWeight={700} mb={2}>Send Verification Code to Coach Email</Typography>
        <form onSubmit={handleSendCode}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField label="Coach Email" name="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required type="email" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Callback URL" name="callbackUrl" value={callbackUrl} onChange={e => setCallbackUrl(e.target.value)} fullWidth required placeholder="https://your-frontend.com/verify" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={sendLoading} sx={{ fontWeight: 700, borderRadius: 1, boxShadow: 'none', mt: 2 }}>
                {sendLoading ? <CircularProgress size={22} /> : 'Send Code'}
              </Button>
            </Grid>
          </Grid>
          {sendError && <Alert severity="error" sx={{ mt: 2 }}>{sendError}</Alert>}
          {sendSuccess && <Alert severity="success" sx={{ mt: 2 }}>{sendSuccess}</Alert>}
        </form>
      </Paper>
    </Box>
  );
} 