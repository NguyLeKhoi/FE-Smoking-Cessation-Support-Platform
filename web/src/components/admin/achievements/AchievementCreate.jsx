import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import achievementsService from '../../../services/achievementsService';
import mediaService from '../../../services/mediaService';
import FormModal from './FormModal';

export const achievement_type = {
    ABSTINENCE_DAYS: 'abstinence_days',
    MONEY_SAVED: 'money_saved',
    HEALTH_MILESTONE: 'health_milestone',
    COMMUNITY_SUPPORT: 'community_support',
    APP_USAGE: 'app_usage',
    RELAPSE_FREE_STREAK: 'relapse_free_streak',
};

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
    const [uploading, setUploading] = useState(false);

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
                onChange={(e) => {
                    const { value } = e.target;
                    if (value === '') {
                        setForm((prev) => ({ ...prev, threshold_value: '' }));
                    } else if (!isNaN(Number(value))) {
                        let num = Math.max(0, Math.min(50, Number(value)));
                        setForm((prev) => ({ ...prev, threshold_value: String(num) }));
                    }
                }}
                onBlur={() => {
                    setForm((prev) => ({
                        ...prev,
                        threshold_value:
                            prev.threshold_value === ''
                                ? ''
                                : String(Math.max(0, Math.min(50, Number(prev.threshold_value)))),
                    }));
                }}
                fullWidth
                required
                type="text"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
        <>
            {trigger ? React.cloneElement(trigger, { onClick: handleOpen }) : (
                <Button variant="contained" color="primary" onClick={handleOpen}>Add Achievement</Button>
            )}
            <FormModal
                open={open}
                onClose={handleClose}
                onSubmit={handleSubmit}
                loading={loading}
                title="Create Achievement"
                submitLabel="Create"
                fields={formFields}
            />
        </>
    );
}
