import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Paper, Typography, TextField, Button, Box, Divider } from '@mui/material';

/**
 * Modal for creating a new quit plan.
 *
 * Props:
 * @param {boolean} open - Whether the modal is open.
 * @param {function} onClose - Function to call when closing the modal.
 * @param {function} onSubmit - Function to call with ({ reason, planType }) when submitting the form.
 * @param {boolean} loading - Whether the form is submitting.
 * @param {string} error - Error message to display.
 * @param {boolean} hasSmokingHabit - If false, show quiz prompt instead of form.
 * @param {function} onTakeQuiz - Function to call when user wants to take the smoking quiz.
 * @param {string} initialReason - Initial value for the reason input.
 * @param {string} initialPlanType - Initial value for the plan type select.
 */
export default function CreateQuitPlanModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  error = '',
  hasSmokingHabit = true,
  onTakeQuiz,
  initialReason = '',
  initialPlanType = 'standard',
}) {
  const [reason, setReason] = useState(initialReason);
  const [planType, setPlanType] = useState(initialPlanType);

  useEffect(() => {
    setReason(initialReason);
  }, [initialReason, open]);

  useEffect(() => {
    setPlanType(initialPlanType);
  }, [initialPlanType, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ reason, planType });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-quit-plan-modal"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2 },
          maxWidth: 750,
          width: '98%',
          borderRadius: 4,
          boxShadow: 8,
          bgcolor: '#fafbfc',
          position: 'relative',
        }}
      >
        <Typography id="create-quit-plan-modal" variant="h5" fontWeight={900} mb={1.2} align="center" letterSpacing={1}>
          Create New Quit Plan
        </Typography>
        {/* Plan type descriptions at the top */}
        <Paper elevation={0} sx={{ bgcolor: '#f5f7fa', p: 1.2, mb: 1.5, borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Plan Type Descriptions
          </Typography>
          <Box pl={0.5}>
            <Box
              role="button"
              tabIndex={0}
              aria-label="Select Slow Plan"
              onClick={() => setPlanType('slow')}
              onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') setPlanType('slow'); }}
              sx={{
                mb: 1.2,
                p: 1.2,
                borderRadius: 2,
                bgcolor: planType === 'slow' ? 'rgba(25, 118, 210, 0.07)' : 'transparent',
                border: planType === 'slow' ? '1.5px solid #1976d2' : '1.5px solid transparent',
                borderColor: planType === 'slow' ? '#1976d2' : 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
                outline: planType === 'slow' ? '2px solid #1976d2' : 'none',
                '&:hover': { background: 'rgba(25, 118, 210, 0.08)', borderColor: '#1976d2' },
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: planType === 'slow' ? '#1976d2' : 'text.secondary', opacity: planType === 'slow' ? 1 : 0.5 }}
                gutterBottom
              >
                <b>Slow:</b> A gentle, gradual approach to quitting. This plan allows for a slower reduction in cigarette use, making it ideal for those who prefer to take their time and adjust at a comfortable pace. Recommended if you have a long history of smoking or want to minimize withdrawal symptoms.
              </Typography>
            </Box>
            <Divider sx={{ my: 0.7 }} />
            <Box
              role="button"
              tabIndex={0}
              aria-label="Select Standard Plan"
              onClick={() => setPlanType('standard')}
              onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') setPlanType('standard'); }}
              sx={{
                mb: 1.2,
                p: 1.2,
                borderRadius: 2,
                bgcolor: planType === 'standard' ? 'rgba(56, 142, 60, 0.07)' : 'transparent',
                border: planType === 'standard' ? '1.5px solid #388e3c' : '1.5px solid transparent',
                borderColor: planType === 'standard' ? '#388e3c' : 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
                outline: planType === 'standard' ? '2px solid #388e3c' : 'none',
                '&:hover': { background: 'rgba(56, 142, 60, 0.08)', borderColor: '#388e3c' },
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: planType === 'standard' ? '#388e3c' : 'text.secondary', opacity: planType === 'standard' ? 1 : 0.5 }}
                gutterBottom
              >
                <b>Standard:</b> This plan offers a balanced approach to quitting smoking. You will gradually reduce your cigarette intake with steady support and achievable milestones. Recommended for most users who want a structured, supportive, and sustainable path to quitting.
              </Typography>
            </Box>
            <Divider sx={{ my: 0.7 }} />
            <Box
              role="button"
              tabIndex={0}
              aria-label="Select Aggressive Plan"
              onClick={() => setPlanType('aggressive')}
              onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') setPlanType('aggressive'); }}
              sx={{
                mb: 0.5,
                p: 1.2,
                borderRadius: 2,
                bgcolor: planType === 'aggressive' ? 'rgba(255, 152, 0, 0.07)' : 'transparent',
                border: planType === 'aggressive' ? '1.5px solid #ff9800' : '1.5px solid transparent',
                borderColor: planType === 'aggressive' ? '#ff9800' : 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
                outline: planType === 'aggressive' ? '2px solid #ff9800' : 'none',
                '&:hover': { background: 'rgba(255, 152, 0, 0.10)', borderColor: '#ff9800' },
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: planType === 'aggressive' ? '#ff9800' : 'text.secondary', opacity: planType === 'aggressive' ? 1 : 0.5 }}
                gutterBottom
              >
                <b>Aggressive:</b> The fastest and most challenging plan. Designed for those who want to quit as soon as possible, this plan features rapid reduction and stricter daily limits. Best for highly motivated individuals who are ready for a tough but rewarding journey.
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Divider sx={{ mb: 1.2 }} />
        {!hasSmokingHabit ? (
          <>
            <Button
              variant="contained"
              sx={{ width: '100%', fontWeight: 700, bgcolor: '#000', color: '#fff', py: 1.5, fontSize: 18, borderRadius: 2, '&:hover': { bgcolor: '#222' } }}
              onClick={onTakeQuiz}
            >
              Take Smoking Quiz
            </Button>
            <Typography variant="body2" color="text.secondary" align="center" mt={2}>
              Take the smoking quiz to continue creating your quit plan.
            </Typography>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              fullWidth
              required
              margin="normal"
              helperText="Describe your main motivation for quitting smoking."
              sx={{ mb: 1.2, bgcolor: 'white', borderRadius: 2 }}
            />
            <TextField
              select
              label="Plan Type"
              value={planType}
              onChange={e => setPlanType(e.target.value)}
              fullWidth
              required
              margin="normal"
              SelectProps={{ native: true }}
              sx={{ mb: 1.2, bgcolor: 'white', borderRadius: 2 }}
            >
              <option value="slow" style={{ color: '#1976d2' }}>Slow - Gradual reduction, gentler pace</option>
              <option value="standard" style={{ color: '#388e3c' }}>Standard - Balanced reduction and support</option>
              <option value="aggressive" style={{ color: '#ff9800' }}>Aggressive - Fastest reduction, more challenging</option>
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 1.2, width: '100%', py: 1, fontSize: 16, borderRadius: 2, fontWeight: 700, boxShadow: 2 }}
            >
              {loading ? 'Creating...' : 'Create Quit Plan'}
            </Button>
          </form>
        )}
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </Paper>
    </Modal>
  );
}

CreateQuitPlanModal.propTypes = {
  /**
   * Whether the modal is open.
   */
  open: PropTypes.bool.isRequired,
  /**
   * Function to call when closing the modal.
   */
  onClose: PropTypes.func.isRequired,
  /**
   * Function to call with ({ reason, planType }) when submitting the form.
   */
  onSubmit: PropTypes.func,
  /**
   * Whether the form is submitting.
   */
  loading: PropTypes.bool,
  /**
   * Error message to display.
   */
  error: PropTypes.string,
  /**
   * If false, show quiz prompt instead of form.
   */
  hasSmokingHabit: PropTypes.bool,
  /**
   * Function to call when user wants to take the smoking quiz.
   */
  onTakeQuiz: PropTypes.func,
  /**
   * Initial value for the reason input.
   */
  initialReason: PropTypes.string,
  /**
   * Initial value for the plan type select.
   *   - 'standard': Balanced reduction and support.
   *   - 'aggressive': Fastest reduction, for those who want to quit as soon as possible.
   *   - 'slow': Gradual reduction, for those who prefer a gentle pace.
   */
  initialPlanType: PropTypes.oneOf(['standard', 'aggressive', 'slow']),
}; 