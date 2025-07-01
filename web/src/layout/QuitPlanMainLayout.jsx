import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Box, IconButton, Modal, Paper, Typography, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { isAuthenticated, logout } from '../services/authService';
import { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import quitPlanService from '../services/quitPlanService';
import Tooltip from '@mui/material/Tooltip';
import smokingService from '../services/smokingService';

export default function QuitPlanMainLayout({ children, showHeader = true, showFooter = true, onPlanCreated }) {
  const [authStatus, setAuthStatus] = useState(isAuthenticated());
  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [planType, setPlanType] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [hasSmokingHabit, setHasSmokingHabit] = useState(true);
  const navigate = useNavigate();

  // Function to handle logout and update auth status
  const handleLogout = async () => {
    await logout();
    setAuthStatus(false);
  };

  const handleOpenModal = async () => {
    setModalOpen(true);
    // Kiểm tra smoking habit khi mở modal
    try {
      const habits = await smokingService.getMySmokingHabits();
      setHasSmokingHabit(Array.isArray(habits) && habits.length > 0);
    } catch {
      setHasSmokingHabit(true); // fallback: không hiện nút quiz nếu lỗi
    }
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setReason('');
    setPlanType('standard');
    setError('');
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await quitPlanService.createQuitPlan({ reason, plan_type: planType });
      if (onPlanCreated) await onPlanCreated();
      handleCloseModal();
      navigate('/quit-plan', { state: { result: response.data } });
      
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create quit plan';
      // Nếu lỗi là chưa có smoking habit thì chuyển sang nút quiz
      if (errorMsg.toLowerCase().includes('smoking habit for user not found')) {
        setHasSmokingHabit(false);
        setError('');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Toaster />
        {showHeader && (
          <Box style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1100,
            backgroundColor: 'background.paper',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}>
            <Header authStatus={authStatus} onLogout={handleLogout} />
          </Box>
        )}
        <Box component="main" sx={{ flexGrow: 1, paddingTop: showHeader ? '64px' : 0 }}>
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child, { setHasActivePlan })
              : child
          )}
        </Box>
        {/* Create Quit Plan Button */}
        <Tooltip title={hasActivePlan ? 'You already have an active plan' : 'Create new quit plan'}>
          <span>
            <IconButton
              aria-label="create quit plan"
              onClick={handleOpenModal}
              disabled={!!hasActivePlan}
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 1200,
                bgcolor: '#3f332b',
                color: 'white',
                '&:hover': { bgcolor: '#5f5349' },
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                width: 56,
                height: 56,
                opacity: hasActivePlan ? 0.5 : 1,
                pointerEvents: hasActivePlan ? 'none' : 'auto',
              }}
            >
              <AddIcon fontSize="large" />
            </IconButton>
          </span>
        </Tooltip>
        {/* Modal for creating a new quit plan */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="create-quit-plan-modal"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
            <Typography id="create-quit-plan-modal" variant="h6" fontWeight={700} mb={2}>
              Create New Quit Plan
            </Typography>
            {/* Nếu chưa có smoking habit thì hiện nút quiz, ẩn form tạo plan */}
            {!hasSmokingHabit ? (
              <>
                <Button
                  variant="contained"
                  sx={{ width: '100%', fontWeight: 700, bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#222' } }}
                  onClick={() => { setModalOpen(false); navigate('/smoking-quiz'); }}
                >
                  Take Smoking Quiz
                </Button>
                <Typography variant="body2" color="text.secondary" align="center" mt={2}>
                  Take the smoking quiz to continue creating your quit plan.
                </Typography>
              </>
            ) : (
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
                  select
                  label="Plan Type"
                  value={planType}
                  onChange={e => setPlanType(e.target.value)}
                  fullWidth
                  required
                  margin="normal"
                  SelectProps={{ native: true }}
                >
                  <option value="standard">standard</option>
                  <option value="aggressive">aggressive</option>
                  <option value="slow">slow</option>
                </TextField>
                <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2, width: '100%' }}>
                  {loading ? 'Creating...' : 'Create Quit Plan'}
                </Button>
              </form>
            )}
            {error && <Typography color="error" mt={2}>{error}</Typography>}
          </Paper>
        </Modal>
        {showFooter && <Footer />}
      </Box>
    </>
  );
} 