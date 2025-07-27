import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  Slider,
  Stack,
  Alert,
  LinearProgress,
} from '@mui/material';

export default function AddDailyRecordModal({ 
  open, 
  onClose, 
  onSubmit, 
  limitCigarettesPerDay,
  loading = false,
}) {
  const [cigaretteSmoke, setCigaretteSmoke] = useState('');
  const [cravingLevel, setCravingLevel] = useState(5);
  const [error, setError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setCigaretteSmoke('');
      setCravingLevel(5);
      setError('');
    }
  }, [open]);

  const validate = () => {
    if (!cigaretteSmoke || isNaN(cigaretteSmoke) || cigaretteSmoke < 0) {
      setError('Please enter a valid number of cigarettes');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || loading) return;
    
    const now = new Date();
    const payload = {
      cigarette_smoke: Number(cigaretteSmoke),
      craving_level: Number(cravingLevel),
      health_status: 'NORMAL', // Default to normal
      record_date: now.toISOString(),
    };
    
    onSubmit(payload);
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while loading
    setCigaretteSmoke('');
    setCravingLevel(5);
    setError('');
    onClose();
  };

  // Calculate progress for the limit indicator
  const progress = limitCigarettesPerDay > 0 && cigaretteSmoke 
    ? Math.min(100, (Number(cigaretteSmoke) / limitCigarettesPerDay) * 100) 
    : 0;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontSize: '1.5rem', 
        fontWeight: 'bold',
        pb: 1,
        position: 'relative',
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <span>Saving your record...</span>
          </Box>
        ) : 'Add Today\'s Record'}
      </DialogTitle>
      
      {loading && <LinearProgress />}
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {limitCigarettesPerDay !== undefined && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Daily Limit: {limitCigarettesPerDay} cigarettes
                </Typography>
              </Box>
            )}

            <Box>
              <Typography gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
                How many cigarettes did you smoke today?
              </Typography>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                value={cigaretteSmoke}
                onChange={(e) => setCigaretteSmoke(e.target.value)}
                error={!!error}
                helperText={error}
                InputProps={{ 
                  inputProps: { 
                    min: 0, 
                    step: 1,
                    style: { textAlign: 'center', fontSize: '1.2rem' }
                  },
                  disabled: loading,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                  },
                }}
              />
              
              {limitCigarettesPerDay > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Progress: {cigaretteSmoke || 0} / {limitCigarettesPerDay}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={progress >= 100 ? 'error' : 'text.secondary'}
                      fontWeight={progress >= 100 ? 'bold' : 'normal'}
                    >
                      {Math.round(progress)}% of daily limit
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    color={progress >= 100 ? 'error' : 'primary'}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                      }
                    }} 
                  />
                  {progress >= 100 && (
                    <Alert severity="warning" sx={{ mt: 1, borderRadius: 1 }}>
                      You've reached your daily limit!
                    </Alert>
                  )}
                </Box>
              )}
            </Box>

            <Box>
              <Typography gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
                How strong is your craving? (1-10)
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={cravingLevel}
                  onChange={(e, newValue) => setCravingLevel(newValue)}
                  min={1}
                  max={10}
                  step={1}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 5, label: '5' },
                    { value: 10, label: '10' },
                  ]}
                  valueLabelDisplay="auto"
                  disabled={loading}
                  sx={{
                    '& .MuiSlider-markLabel': {
                      transform: 'translateY(20px)',
                    },
                  }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mt: -1,
                  px: 0.5,
                }}>
                  <Typography variant="caption" color="text.secondary">Not at all</Typography>
                  <Typography variant="caption" color="text.secondary">Extremely</Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'medium',
              textTransform: 'none',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || !!error}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Save Record'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 