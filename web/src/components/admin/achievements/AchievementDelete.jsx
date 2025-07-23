import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';
import achievementsService from '../../../services/achievementsService';

export default function AchievementDelete({ open, onClose, onDelete, achievement }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!achievement?.id) return;
        setLoading(true);
        try {
            await achievementsService.deleteAchievement(achievement.id);
            onDelete && onDelete(achievement.id);
            onClose && onClose();
        } catch (err) {
            // Optionally show error
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Delete Achievement</DialogTitle>
            <DialogContent dividers>
                <Typography>
                    Are you sure you want to delete the achievement <b>{achievement?.name}</b>?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={loading}>Cancel</Button>
                <Button onClick={handleConfirm} color="error" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
