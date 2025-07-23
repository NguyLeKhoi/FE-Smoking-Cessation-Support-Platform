import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Button } from '@mui/material';
import LoadingPage from '../LoadingPage';
import { styled } from '@mui/material/styles';
import leaderBoardService from '../../services/leaderBoardService';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';
import NavigationButtonGroup from '../../components/homePage/NavigationButtonGroup';

const navigationItems = [
    { id: 'total_score', label: 'Total Score' },
    { id: 'money_saved', label: 'Money Saved' },
    { id: 'relapse_free_streak', label: 'Relapse-Free Streak' },
    { id: 'community_support', label: 'Community Support' },
];

const StyledNavButton = styled(Button)(({ theme, active }) => ({
    borderRadius: '12px',
    padding: '12px 24px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 500,
    margin: theme.spacing(0, 1, 1, 0),
    transition: 'all 0.3s ease',
    backgroundColor: active ? theme.palette.primary.main : '#fff',
    color: active ? '#fff' : theme.palette.primary.main,
    boxShadow: active ? theme.shadows[4] : theme.shadows[2],
    '&:hover': {
        backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[100],
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[6],
    },
}));

function renderLeaderboardTable(entries, label) {
    if (!Array.isArray(entries) || entries.length === 0) {
        return <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>No data available for {label}.</Box>;
    }
    return (
        <TableContainer sx={{ mb: 4 }}>
            <Table>
                <TableBody>
                    {entries.map((entry, idx) => {
                        const rank = entry.rank ?? idx + 1;
                        let rankIcon = null;
                        if (rank === 1) {
                            rankIcon = (
                                <img
                                    src="https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/icons/icons8-first-place-ribbon-64-zq79sb21lipd9sjibdi2t7kws.png"
                                    alt="First Place"
                                    style={{ width: 45, height: 45 }}
                                />
                            );
                        } else if (rank === 2) {
                            rankIcon = (
                                <img
                                    src="https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/icons/icons8-second-place-ribbon-64-cyj2xco1hq7vdnxvme8rb12nk.png"
                                    alt="Second Place"
                                    style={{ width: 45, height: 45 }}
                                />
                            );
                        } else if (rank === 3) {
                            rankIcon = (
                                <img
                                    src="https://smk-cessation-bucket.s3.us-east-1.amazonaws.com/icons/icons8-third-place-ribbon-64-hoszh14mxnufi8zxsgz0q36xr.png"
                                    alt="Third Place"
                                    style={{ width: 45, height: 45 }}
                                />
                            );
                        }
                        return (
                            <TableRow key={entry.id || idx}>
                                <TableCell align="center" sx={{ width: 100, minWidth: 50, maxWidth: 100 }}>
                                    {rankIcon || rank}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar style={{ width: 52, height: 52 }} src={entry.avatar} alt={entry.username || entry.first_name || 'User'} />
                                        <span>{entry.first_name || ''} {entry.last_name || ''}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">{entry.score ?? 0}XP</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const LeaderBoardPage = () => {
    const [leaderboards, setLeaderboards] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeType, setActiveType] = useState('money_saved');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await leaderBoardService.getLeaderboard();
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

    const currentNav = navigationItems.find(item => item.id === activeType);
    const currentEntries = leaderboards[activeType];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.paper' }}>
            <ProfileSidebar userData={null} />
            <Box sx={{ flex: 1, maxWidth: 1000, mx: 'auto', mt: 6, mb: 6, width: '100%' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary', textAlign: 'start' }}>
                    Leaderboards
                </Typography>
                <Paper elevation={0} sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 3, border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'visible',
                    width: '100%'
                }}>
                    <Box sx={{ width: '100%', overflowX: { xs: 'auto', md: 'visible' } }}>
                        <NavigationButtonGroup
                            navigationItems={navigationItems}
                            activeSlide={activeType}
                            handleSlideChange={setActiveType}
                            StyledNavButton={StyledNavButton}
                        />
                    </Box>
                    {loading ? (
                        <LoadingPage />
                    ) : error ? (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>{error}</Box>
                    ) : (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, mt: 3 }}>{currentNav?.label}</Typography>
                            {renderLeaderboardTable(currentEntries, currentNav?.label)}
                        </>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default LeaderBoardPage;
