import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Avatar } from '@mui/material';
import leaderBoardService from '../../services/leaderBoardService';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';

const LEADERBOARD_TYPES = [
    { key: 'money_saved', label: 'Money Saved' },
    { key: 'total_score', label: 'Total Score' },
    { key: 'relapse_free_streak', label: 'Relapse-Free Streak' },
];

const COMMUNITY_SUPPORT = { key: 'community_support', label: 'Community Support' };

function renderLeaderboardTable(entries, label) {
    if (!Array.isArray(entries) || entries.length === 0) {
        return <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>No data available for {label}.</Box>;
    }
    return (
        <TableContainer sx={{ mb: 4 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Avatar</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entries.map((entry, idx) => (
                        <TableRow key={entry.id || idx}>
                            <TableCell>{entry.rank ?? idx + 1}</TableCell>
                            <TableCell>
                                <Avatar src={entry.avatar} alt={entry.username || entry.first_name || 'User'} />
                            </TableCell>
                            <TableCell>{entry.first_name || ''} {entry.last_name || ''} ({entry.username || 'User'})</TableCell>
                            <TableCell align="right">{entry.score ?? 0}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const LeaderBoardPage = () => {
    const [leaderboards, setLeaderboards] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await leaderBoardService.getLeaderboard();
                // Accept data.data or data directly
                let lb = {};
                if (data && typeof data === 'object') {
                    lb = data.data || data;
                }
                setLeaderboards(lb);
            } catch (err) {
                setError('Failed to load leaderboard.');
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <ProfileSidebar userData={null} />
            <Box sx={{ flex: 1, maxWidth: 700, mx: 'auto', mt: 6, mb: 6 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary', textAlign: 'start' }}>
                    Leaderboards
                </Typography>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>{error}</Box>
                    ) : (
                        <>
                            {LEADERBOARD_TYPES.map(lb => (
                                <Box key={lb.key}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, mt: 3 }}>{lb.label}</Typography>
                                    {renderLeaderboardTable(leaderboards[lb.key], lb.label)}
                                </Box>
                            ))}
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, mt: 3 }}>{COMMUNITY_SUPPORT.label}</Typography>
                                {renderLeaderboardTable(leaderboards[COMMUNITY_SUPPORT.key], COMMUNITY_SUPPORT.label)}
                            </Box>
                        </>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default LeaderBoardPage;
