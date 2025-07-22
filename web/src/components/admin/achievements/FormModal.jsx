import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';

export default function FormModal({ open, onClose, onSubmit, loading, title, submitLabel, fields, children }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                {fields}
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={loading}>Cancel</Button>
                <Button onClick={onSubmit} color="primary" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : submitLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
