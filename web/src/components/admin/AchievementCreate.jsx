import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, CircularProgress } from '@mui/material';
import achievementsService from '../../services/achievementsService';

export default function AchievementCreate({ onCreate, trigger }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        image_url: '',
        achievement_type: '',
        threshold_value: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setForm({
            name: '',
            description: '',
            image_url: '',
            achievement_type: '',
            threshold_value: '',
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await achievementsService.createAchievement(form);
            onCreate && onCreate(res.data);
            handleClose();
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {trigger ? React.cloneElement(trigger, { onClick: handleOpen }) : (
                <Button variant="contained" color="primary" onClick={handleOpen}>Add Achievement</Button>
            )}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Create Achievement</DialogTitle>
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
                    <Button onClick={handleClose} color="inherit" disabled={loading}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
