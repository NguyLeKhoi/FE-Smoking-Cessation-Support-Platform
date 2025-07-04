import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import Lottie from 'lottie-react';
import typingCatAnimation from '../../assets/animations/typing-cat-animation.json';

const healthStatusOptions = [
  { value: 'GOOD', label: 'Good' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'BAD', label: 'Bad' },
];

export default function AddDailyRecordModal({ open, onClose, onSubmit, limitCigarettesPerDay }) {
  const [cigaretteSmoke, setCigaretteSmoke] = useState('');
  const [cravingLevel, setCravingLevel] = useState('');
  const [healthStatus, setHealthStatus] = useState('GOOD');
  const [recordDate, setRecordDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      cigarette_smoke: Number(cigaretteSmoke),
      craving_level: Number(cravingLevel),
      health_status: healthStatus,
      record_date: new Date(recordDate).toISOString(),
    };
    console.log('Add Daily Record payload:', payload);
    onSubmit(payload);
  };

  const handleClose = () => {
    setCigaretteSmoke('');
    setCravingLevel('');
    setHealthStatus('GOOD');
    setRecordDate(new Date().toISOString().slice(0, 10));
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      {typeof limitCigarettesPerDay !== 'undefined' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          margin: '32px 0 0 0',
        }}>
          <div style={{
            background: '#fff3e0',
            border: '2px solid #ff9800',
            borderRadius: 16,
            padding: '16px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            boxShadow: '0 2px 12px rgba(255,152,0,0.08)',
            marginBottom: 12,
            width: '100%',
            maxWidth: 320,
          }}>
            <Lottie
              animationData={typingCatAnimation}
              loop
              autoplay
              style={{ width: 90, height: 90, marginBottom: 0 }}
            />
            <span style={{
              color: '#d84315', fontWeight: 900, fontSize: 22, textAlign: 'center', marginTop: 4, letterSpacing: 0.5
            }}>
              Limit per day: <span style={{ fontSize: 26 }}>{limitCigarettesPerDay}</span>
            </span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 3, pt: 1, pb: 0 }}>
          <TextField
            label="Cigarettes Smoked"
            type="number"
            value={cigaretteSmoke}
            onChange={(e) => setCigaretteSmoke(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0 }}
            sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2 }}
          />
          <TextField
            label="Craving Level (1-10)"
            type="number"
            value={cravingLevel}
            onChange={(e) => setCravingLevel(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 1, max: 10 }}
            sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2 }}
          />
          <TextField
            label="Health Status"
            select
            value={healthStatus}
            onChange={(e) => setHealthStatus(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2 }}
          >
            {healthStatusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Record Date"
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            disabled
            sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 1 }}>
          <Button onClick={handleClose} sx={{ fontWeight: 700, px: 3, py: 1, borderRadius: 2 }}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ fontWeight: 900, px: 4, py: 1.2, borderRadius: 2, ml: 2 }}>Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 