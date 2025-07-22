import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, CircularProgress } from '@mui/material';
import achievementsService from '../../services/achievementsService';

export default function AchievementUpdate({ open, onClose, onUpdate, initialValues = {} }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        image_url: '',
        achievement_type: '',
        threshold_value: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialValues) {
            setForm({
                name: initialValues.name || '',
                description: initialValues.description || '',
                image_url: initialValues.image_url || '',
                achievement_type: initialValues.achievement_type || '',
                threshold_value: initialValues.threshold_value || '',
            });
        }
    }, [initialValues, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!initialValues.id) return;
        setLoading(true);
        try {
            const res = await achievementsService.updateAchievement(initialValues.id, form);
            onUpdate && onUpdate(res.data);
            onClose && onClose();
        } catch (err) {
            // Optionally show error
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Update Achievement</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        minRows={2}
                        required
                    />
                    <TextField
                        label="Image URL"
                        name="image_url"
                        value={form.image_url}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Achievement Type"
                        name="achievement_type"
                        value={form.achievement_type}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Threshold Value"
                        name="threshold_value"
                        value={form.threshold_value}
                        onChange={handleChange}
                        fullWidth
                        required
                        type="number"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={loading}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
