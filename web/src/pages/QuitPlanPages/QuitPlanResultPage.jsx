import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';

const renderObject = (obj) => {
  if (!obj || typeof obj !== 'object') return String(obj);
  if (Array.isArray(obj)) {
    return obj.length === 0 ? 'None' : obj.map((item, idx) => (
      <Box key={idx} sx={{ ml: 2, mb: 1 }}>{renderObject(item)}</Box>
    ));
  }
  return (
    <Box sx={{ ml: 2, mb: 1 }}>
      {Object.entries(obj).map(([key, value]) => (
        <Box key={key} sx={{ mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">{key}</Typography>
          <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>{renderObject(value)}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const QuitPlanResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          Quit Plan Result
        </Typography>
        {result ? (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}><Typography variant="subtitle2">statusCode</Typography><Typography>{result.statusCode}</Typography></Grid>
              <Grid item xs={12} sm={4}><Typography variant="subtitle2">msg</Typography><Typography>{result.msg}</Typography></Grid>
              <Grid item xs={12} sm={4}><Typography variant="subtitle2">timestamp</Typography><Typography>{result.timestamp}</Typography></Grid>
            </Grid>
            <Box mt={3}>
              <Typography variant="h6">Data</Typography>
              {renderObject(result.data)}
            </Box>
          </Box>
        ) : (
          <Typography color="error">No result data found. Please create a quit plan first.</Typography>
        )}
        <Button sx={{ mt: 3 }} variant="contained" onClick={() => navigate('/quit-plan')}>Back to Create</Button>
      </Paper>
    </Box>
  );
};

export default QuitPlanResultPage; 