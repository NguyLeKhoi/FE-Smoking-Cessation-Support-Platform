import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Avatar, CircularProgress, Box } from '@mui/material';
import achievementsService from '../../services/achievementsService';

export default function AdminAchievements() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        achievementsService.getAllAchievements()
            .then(data => {
                console.log('Achievements API response:', data);
                setAchievements(Array.isArray(data) ? data : data.data || []);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load achievements');
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Typography variant="h5" mb={2} p={2} sx={{ fontWeight: 900, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff', width: '100%', maxWidth: '100%', mx: 0, color: '#111' }}>Achievements Table</Typography>
            <TableContainer sx={{ width: '100%', maxWidth: '100%', mx: 0, bgcolor: '#fff', borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                        <Typography color="error">{error}</Typography>
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f7fa', borderRadius: 0 }}>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}>Image</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}>Name</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}>Description</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}>Type</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}>Threshold</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}>Point</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(achievements || []).map((row) => (
                                <TableRow key={row.id} hover sx={{ transition: 'background 0.2s', '&:hover': { bgcolor: '#f7f7f7' } }}>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2 }}>
                                        <Avatar src={row.image_url} alt={row.name} variant="rounded" sx={{ width: 40, height: 40 }} />
                                    </TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontWeight: 600 }}>{row.name}</TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.description}</TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.achievement_type}</TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.threshold_value}</TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.point}</TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{new Date(row.created_at).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
        </>
    );
} 