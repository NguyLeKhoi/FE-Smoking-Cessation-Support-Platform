import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';

export default function StatisticsCard({ stats, loading, error }) {
    if (loading) {
        return (
            <Grid container spacing={3} sx={{ mb: 3, mt: 1 }} justifyContent="center">
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                        <Typography variant="body1">Loading statistics...</Typography>
                    </Box>
                </Grid>
            </Grid>
        );
    }
    if (error) {
        return (
            <Grid container spacing={3} sx={{ mb: 3, mt: 1 }} justifyContent="center">
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                        <Typography variant="body1" color="error">{error}</Typography>
                    </Box>
                </Grid>
            </Grid>
        );
    }

    const cards = stats ? [
        {
            label: 'Total Users',
            value: stats.totalUsers ?? '-',
            icon: <GroupIcon sx={{ fontSize: 32, color: '#222' }} />,
        },
        {
            label: 'Total Coaches',
            value: stats.totalCoaches ?? '-',
            icon: <AssignmentIcon sx={{ fontSize: 32, color: '#222' }} />,
        },
        {
            label: 'Total Members',
            value: stats.totalMembers ?? '-',
            icon: <ListAltIcon sx={{ fontSize: 32, color: '#222' }} />,
        },
        {
            label: 'Revenue from Memberships',
            value: typeof stats.revenueFromMemberships === 'number' ? `$${stats.revenueFromMemberships.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
            icon: <TrendingUpIcon sx={{ fontSize: 32, color: '#222' }} />,
        },
        {
            label: 'Total Money Saved',
            value: typeof stats.totalMoneySaved === 'number' ? `$${stats.totalMoneySaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
            icon: <TrendingUpIcon sx={{ fontSize: 32, color: '#222' }} />,
        },
        {
            label: 'Cigarettes Not Smoked',
            value: stats.totalCigarettesNotSmoked ?? '-',
            icon: <SmokeFreeIcon sx={{ fontSize: 32, color: '#222' }} />,
        },
    ] : [];

    // Split cards into two rows: first 3, then the rest
    const firstRow = cards.slice(0, 3);
    const secondRow = cards.slice(3);

    return (
        <Box>
            <Grid container spacing={5} sx={{ mb: 1, mt: 1 }} justifyContent="center">
                {firstRow.map((stat, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={stat.label}>
                        <Box
                            sx={{
                                width: 300,
                                height: 180,
                                bgcolor: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                boxShadow: 'none',
                                mb: 1,
                                mt: 3,
                                mx: 'auto',
                            }}
                        >
                            <Box mb={1}>{stat.icon}</Box>
                            <Typography variant="h3" fontWeight={900} color="#111" mb={0.5}>
                                {stat.value}
                            </Typography>
                            <Typography variant="body1" color="#222" fontWeight={700}>
                                {stat.label}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            <Grid container spacing={5} sx={{ mb: 3 }} justifyContent="center">
                {secondRow.map((stat, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={stat.label}>
                        <Box
                            sx={{
                                width: 300,
                                height: 180,
                                bgcolor: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                boxShadow: 'none',
                                mb: 8,
                                mx: 'auto',
                            }}
                        >
                            <Box mb={1}>{stat.icon}</Box>
                            <Typography variant="h3" fontWeight={900} color="#111" mb={0.5}>
                                {stat.value}
                            </Typography>
                            <Typography variant="body1" color="#222" fontWeight={700}>
                                {stat.label}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
