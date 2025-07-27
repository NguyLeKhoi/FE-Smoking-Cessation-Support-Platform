import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    Divider,
    Alert,
    CircularProgress,
    Switch,
    FormControlLabel,
    Chip,
    Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import SaveIcon from '@mui/icons-material/Save';
import notificationService from '../../services/notificationService';
import { toast } from 'react-toastify';
import ProfileSidebar from './ProfileSidebar';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        transform: 'translateY(-2px)',
    },
}));

function NotificationsPage() {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const [settings, setSettings] = useState({
        type: 'reminder',
        frequency: 'DAILY',
        preferred_time: '05:00'
    });

    const notificationTypes = [
        { value: 'reminder', label: 'Reminder Notifications', description: 'Daily reminders to stay on track' },
    ];

    const frequencyOptions = [
        { value: 'DAILY', label: 'Daily' },
        { value: 'WEEKLY', label: 'Weekly' },
    ];

    useEffect(() => {
        // No need to fetch notification settings on component mount
    }, []);

    const handleSettingChange = (field) => (event) => {
        setSettings(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const scheduleData = {
                enabled: notificationsEnabled,
                type: settings.type,
                frequency: settings.frequency,
                preferred_time: settings.preferred_time
            };

            await notificationService.saveNotificationSchedule(scheduleData);

            setSuccess('Notification settings saved successfully!');
            toast.success('Notification settings updated successfully!');
        } catch (error) {
            console.error('Error saving notification settings:', error);
            setError('Failed to save notification settings');
            toast.error('Failed to save notification settings');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.paper' }}>
            <ProfileSidebar userData={null} />
            <Box sx={{ flex: 1, maxWidth: 800, mx: 'auto', mt: 6, mb: 6, width: '100%' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary', textAlign: 'start' }}>
                    Notification Settings
                </Typography>

                <Paper elevation={0} sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'visible',
                    width: '100%'
                }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {success}
                        </Alert>
                    )}

                    <StyledCard sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                {notificationsEnabled ? (
                                    <NotificationsActiveIcon sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                                ) : (
                                    <NotificationsOffIcon sx={{ color: 'text.secondary', mr: 2, fontSize: 28 }} />
                                )}
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#3f332b' }}>
                                        Enable Notifications
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Receive notifications to help you stay on track with your quit journey
                                    </Typography>
                                </Box>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={notificationsEnabled}
                                            onChange={handleToggleNotifications}
                                            color="primary"
                                        />
                                    }
                                    label=""
                                    sx={{ ml: 'auto' }}
                                />
                            </Box>

                            {notificationsEnabled && (
                                <>
                                    <Divider sx={{ my: 3 }} />

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Notification Type</InputLabel>
                                                <Select
                                                    value={settings.type}
                                                    onChange={handleSettingChange('type')}
                                                    label="Notification Type"
                                                >
                                                    {notificationTypes.map((type) => (
                                                        <MenuItem key={type.value} value={type.value}>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                    {type.label}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {type.description}
                                                                </Typography>
                                                            </Box>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Frequency</InputLabel>
                                                <Select
                                                    value={settings.frequency}
                                                    onChange={handleSettingChange('frequency')}
                                                    label="Frequency"
                                                >
                                                    {frequencyOptions.map((freq) => (
                                                        <MenuItem key={freq.value} value={freq.value}>
                                                            {freq.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Preferred Time"
                                                type="time"
                                                value={settings.preferred_time}
                                                onChange={handleSettingChange('preferred_time')}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                                <Stack direction="row" spacing={1}>
                                                    <Chip
                                                        label={`Type: ${settings.type}`}
                                                        color="primary"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                    <Chip
                                                        label={`Frequency: ${settings.frequency}`}
                                                        color="secondary"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                    <Chip
                                                        label={`Time: ${settings.preferred_time}`}
                                                        color="default"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </Stack>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                        </CardContent>
                    </StyledCard>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => { }} 
                            disabled={saving}
                            sx={{
                                borderColor: '#3f332b',
                                color: '#3f332b',
                                '&:hover': {
                                    borderColor: '#000000',
                                    backgroundColor: 'rgba(63, 51, 43, 0.04)',
                                },
                            }}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSaveSettings}
                            disabled={saving || !notificationsEnabled}
                            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                            sx={{
                                bgcolor: '#000000',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: '#000000cd',
                                },
                                '&:disabled': {
                                    bgcolor: '#cccccc',
                                    color: '#666666',
                                },
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default NotificationsPage;
