import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import achievementsService from '../../services/achievementsService';
import mediaService from '../../services/mediaService';
import FormModal from './FormModal';

export const achievement_type = {
    ABSTINENCE_DAYS: 'abstinence_days',
    MONEY_SAVED: 'money_saved',
    HEALTH_MILESTONE: 'health_milestone',
    COMMUNITY_SUPPORT: 'community_support',
    APP_USAGE: 'app_usage',
    RELAPSE_FREE_STREAK: 'relapse_free_streak',
};

export default function AchievementUpdate({ open, onClose, onUpdate, initialValues = {} }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        image_url: '',
        achievement_type: '',
        threshold_value: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('images', file);
        setUploading(true);
        try {
            const res = await mediaService.uploadImages(formData);
            if (res.data && res.data[0] && res.data[0].url) {
                setForm((prev) => ({ ...prev, image_url: res.data[0].url }));
            }
        } catch (err) {
        } finally {
            setUploading(false);
        }
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

    const formFields = (
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
            <FormControl fullWidth required>
                <InputLabel id="achievement-type-label">Achievement Type</InputLabel>
                <Select
                    labelId="achievement-type-label"
                    label="Achievement Type"
                    name="achievement_type"
                    value={form.achievement_type}
                    onChange={handleChange}
                >
                    {Object.values(achievement_type).map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Threshold Value"
                name="threshold_value"
                value={form.threshold_value}
                onChange={handleChange}
                fullWidth
                required
                type="number"
                min={0}
                max={50}
            />

            <Box>
                <Button variant="contained" component="label" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                    />
                </Button>
                {form.image_url && (
                    <Box mt={1}>
                        <img src={form.image_url} alt="Preview" style={{ maxWidth: 120, maxHeight: 120 }} />
                    </Box>
                )}
            </Box>
        </Box>
    );

    return (
        <FormModal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
            title="Update Achievement"
            submitLabel="Save"
            fields={formFields}
        />
    );
}
