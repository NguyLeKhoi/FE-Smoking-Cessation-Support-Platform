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
    Stack,
    Avatar,
    IconButton,
    Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScheduleIcon from '@mui/icons-material/Schedule';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import notificationService from '../../services/notificationService';
import { toast } from 'react-toastify';
import ProfileSidebar from './ProfileSidebar';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
    '&:hover': {
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
        transform: 'translateY(-4px)',
    },
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#000000',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
        width: 32,
        height: 32,
        margin: 0,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#999',
            )}" d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#e0e0e0',
        borderRadius: 34 / 2,
    },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
    borderRadius: '12px',
    fontWeight: 500,
    '& .MuiChip-label': {
        padding: '8px 12px',
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
        {
            value: 'reminder',
            label: 'Reminder Notifications',
            description: 'Daily reminders to stay on track',
            icon: <NotificationsIcon sx={{ fontSize: 20, mr: 1 }} />
        },
    ];

    const frequencyOptions = [
        { value: 'DAILY', label: 'Daily', icon: <ScheduleIcon sx={{ fontSize: 20, mr: 1 }} /> },
        { value: 'WEEKLY', label: 'Weekly', icon: <ScheduleIcon sx={{ fontSize: 20, mr: 1 }} /> },
    ];

    useEffect(() => {
        // No need to fetch notification settings on component mount
        const getNotiScheduleSetting = async () => {
            const response = await notificationService.getNotificationSchedules();
            if (response.data) {
                setSettings((prev) => ({
                    ...prev,
                    ...response.data,
                }));
            }
        };
        getNotiScheduleSetting();
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
            <Box sx={{ flex: 1, maxWidth: 900, mx: 'auto', mt: 6, mb: 6, width: '100%', px: 3 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" sx={{
                        fontWeight: 800,
                        color: 'text.primary',
                        textAlign: 'start',
                        mb: 1,
                        background: 'linear-gradient(135deg, #3f332b 0%, #000000 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Notification Settings
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                        Customize your notification preferences to stay motivated on your quit journey
                    </Typography>
                </Box>

                <Paper elevation={0} sx={{
                    p: 4,
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'visible',
                    width: '100%',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <StyledCard sx={{ mb: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                <Avatar sx={{
                                    bgcolor: notificationsEnabled ? 'primary.main' : 'grey.300',
                                    width: 56,
                                    height: 56,
                                    mr: 3,
                                    transition: 'all 0.3s ease'
                                }}>
                                    {notificationsEnabled ? (
                                        <NotificationsActiveIcon sx={{ fontSize: 28 }} />
                                    ) : (
                                        <NotificationsOffIcon sx={{ fontSize: 28, color: 'grey.600' }} />
                                    )}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                                        Enable Notifications
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        Receive personalized notifications to help you stay on track with your quit journey
                                    </Typography>
                                </Box>
                                <FormControlLabel
                                    control={
                                        <StyledSwitch
                                            checked={notificationsEnabled}
                                            onChange={handleToggleNotifications}
                                        />
                                    }
                                    label=""
                                    sx={{ ml: 2 }}
                                />
                            </Box>

                            {notificationsEnabled && (
                                <>
                                    <Divider sx={{ my: 4, opacity: 0.3 }} />

                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                                        Notification Preferences
                                    </Typography>

                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel sx={{ fontWeight: 500 }}>Notification Type</InputLabel>
                                                <Select
                                                    value={settings.type}
                                                    onChange={handleSettingChange('type')}
                                                    label="Notification Type"
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    {notificationTypes.map((type) => (
                                                        <MenuItem key={type.value} value={type.value}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                {type.icon}
                                                                <Box>
                                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                        {type.label}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {type.description}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel sx={{ fontWeight: 500 }}>Frequency</InputLabel>
                                                <Select
                                                    value={settings.frequency}
                                                    onChange={handleSettingChange('frequency')}
                                                    label="Frequency"
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    {frequencyOptions.map((freq) => (
                                                        <MenuItem key={freq.value} value={freq.value}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                {freq.icon}
                                                                {freq.label}
                                                            </Box>
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
                                                    sx: { fontWeight: 500 }
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                                sx={{ borderRadius: 2 }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                height: '100%',
                                                justifyContent: 'center'
                                            }}>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    <StyledChip
                                                        label={`Type: ${settings.type}`}
                                                        color="primary"
                                                        variant="outlined"
                                                        size="medium"
                                                    />
                                                    <StyledChip
                                                        label={`Frequency: ${settings.frequency}`}
                                                        color="secondary"
                                                        variant="outlined"
                                                        size="medium"
                                                    />
                                                    <StyledChip
                                                        label={`Time: ${settings.preferred_time}`}
                                                        color="default"
                                                        variant="outlined"
                                                        size="medium"
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
                        <Tooltip title="Reset to default settings">
                            <Button
                                variant="outlined"
                                onClick={() => { }}
                                disabled={saving}
                                startIcon={<RefreshIcon />}
                                sx={{
                                    borderColor: '#3f332b',
                                    color: '#3f332b',
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    '&:hover': {
                                        borderColor: '#000000',
                                        backgroundColor: 'rgba(63, 51, 43, 0.04)',
                                        transform: 'translateY(-1px)',
                                    },
                                }}
                            >
                                Reset
                            </Button>
                        </Tooltip>
                        <Button
                            variant="contained"
                            onClick={handleSaveSettings}
                            disabled={saving || !notificationsEnabled}
                            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                            sx={{
                                bgcolor: '#000000',
                                color: 'white',
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: '#000000cd',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                },
                                '&:disabled': {
                                    bgcolor: '#cccccc',
                                    color: '#666666',
                                    transform: 'none',
                                    boxShadow: 'none',
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
