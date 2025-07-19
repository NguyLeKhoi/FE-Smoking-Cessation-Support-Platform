import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText } from '@mui/material';
import smokingService from '../../services/smokingService';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';
import { fetchCurrentUser } from '../../services/userService';

const SmokingHabitPage = () => {
    const [habit, setHabit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [habitRes, userRes] = await Promise.all([
                    smokingService.getMySmokingHabits(),
                    fetchCurrentUser()
                ]);
                setHabit(habitRes.data || habitRes);
                setUserData(userRes.data || userRes);
            } catch (e) {
                setError('Failed to load your smoking habit data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const content = (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    My Smoking Habit
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="Cigarettes per pack" secondary={habit?.cigarettes_per_pack} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Price per pack" secondary={`$${habit?.price_per_pack}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Cigarettes per day" secondary={habit?.cigarettes_per_day} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Smoking years" secondary={habit?.smoking_years} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Triggers" secondary={Array.isArray(habit?.triggers) ? habit.triggers.join(', ') : habit?.triggers} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Health issues" secondary={habit?.health_issues} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Daily cost" secondary={`$${habit?.daily_cost}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Last updated" secondary={habit?.created_at ? new Date(habit.created_at).toLocaleString() : ''} />
                    </ListItem>
                </List>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>AI Feedback</Typography>
                    <Paper elevation={0} sx={{ bgcolor: 'section.light', p: 2, borderRadius: 2 }}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{habit?.ai_feedback}</Typography>
                    </Paper>
                </Box>
            </Paper>
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
                <ProfileSidebar userData={userData} />
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
                <ProfileSidebar userData={userData} />
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <ProfileSidebar userData={userData} />
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                color: 'text.primary',
                overflowY: 'auto'
            }}>
                {content}
            </Box>
        </Box>
    );
};

export default SmokingHabitPage;
