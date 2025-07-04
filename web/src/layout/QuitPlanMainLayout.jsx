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
import CreateQuitPlanModal from '../components/quit-plans/CreateQuitPlanModal';

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

  const handleOpenModal = () => {
    setModalOpen(true);
    setHasSmokingHabit(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setReason('');
    setPlanType('standard');
    setError('');
  };

  const handleCreatePlan = async ({ reason, planType }) => {
    setLoading(true);
    setError('');
    try {
      const response = await quitPlanService.createQuitPlan({ reason, plan_type: planType });
      if (onPlanCreated) await onPlanCreated();
      handleCloseModal();
      navigate('/quit-plan', { state: { result: response.data } });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create quit plan');
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
        <CreateQuitPlanModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreatePlan}
          loading={loading}
          error={error}
          hasSmokingHabit={hasSmokingHabit}
          onTakeQuiz={() => { setModalOpen(false); navigate('/smoking-quiz'); }}
          initialReason={reason}
          initialPlanType={planType}
        />
        {showFooter && <Footer />}
      </Box>
    </>
  );
} 