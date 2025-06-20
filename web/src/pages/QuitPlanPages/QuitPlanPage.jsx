import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import quitPlanService from '../../services/quitPlanService';

const QuitPlanPage = () => {
  const [reason, setReason] = useState('');
  const [planType, setPlanType] = useState('standard');
  const [createdPlan, setCreatedPlan] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCreatedPlan(null);
    try {
      const response = await quitPlanService.createQuitPlan({ reason, plan_type: planType });
      console.log('Quit plan creation response:', response);
      setCreatedPlan(response.data);
      navigate('/quit-plan/result', { state: { result: response.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quit plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Quit Plan
      </Typography>
      {!createdPlan && (
        <Paper sx={{ p: 3, mb: 3, maxWidth: 400 }}>
          <form onSubmit={handleCreatePlan}>
            <TextField
              label="Reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Plan Type"
              value={planType}
              onChange={e => setPlanType(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
              {loading ? 'Creating...' : 'Create Quit Plan'}
            </Button>
          </form>
          {error && <Typography color="error" mt={2}>{error}</Typography>}
        </Paper>
      )}
      {createdPlan && (
        <Paper sx={{ p: 3, maxWidth: 600 }}>
          <Typography variant="h5" fontWeight={600} mb={2}>Quit Plan Created Successfully!</Typography>
          <Grid container spacing={2}>
            {Object.entries(createdPlan).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Typography variant="subtitle2" color="text.secondary">{key}</Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                  {Array.isArray(value) ? JSON.stringify(value, null, 2) : String(value)}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default QuitPlanPage; 