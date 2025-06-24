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

const healthStatusOptions = [
  { value: 'GOOD', label: 'Good' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'BAD', label: 'Bad' },
];

export default function AddDailyRecordModal({ open, onClose, onSubmit }) {
  const [cigaretteSmoke, setCigaretteSmoke] = useState('');
  const [cravingLevel, setCravingLevel] = useState('');
  const [healthStatus, setHealthStatus] = useState('GOOD');
  const [recordDate, setRecordDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      cigarette_smoke: Number(cigaretteSmoke),
      craving_level: Number(cravingLevel),
      health_status: healthStatus,
      record_date: new Date(recordDate).toISOString(),
    });
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
      <DialogTitle>Add Daily Record</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Cigarettes Smoked"
            type="number"
            value={cigaretteSmoke}
            onChange={(e) => setCigaretteSmoke(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0 }}
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
          />
          <TextField
            label="Health Status"
            select
            value={healthStatus}
            onChange={(e) => setHealthStatus(e.target.value)}
            fullWidth
            margin="normal"
            required
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 