import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Avatar, CircularProgress, Box, Pagination, Tooltip, IconButton, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AchievementUpdate from '../../components/admin/achievements/AchievementUpdate';
import achievementsService from '../../services/achievementsService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AchievementCreate from '../../components/admin/achievements/AchievementCreate';
import AchievementDelete from '../../components/admin/achievements/AchievementDelete';

export default function AdminAchievements() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 5;
    const [actionAnchorEl, setActionAnchorEl] = useState(null);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

    const totalPages = Math.ceil((achievements?.length || 0) / PAGE_SIZE);
    const pagedAchievements = (achievements || []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleActionClick = (event, achievement) => {
        setActionAnchorEl(event.currentTarget);
        setSelectedAchievement(achievement);
    };
    const handleActionClose = () => {
        setActionAnchorEl(null);
    };
    const handleEdit = () => {
        setModalOpen(true);
        handleActionClose();
    };
    const handleDelete = () => {
        setDeleteModalOpen(true);
        handleActionClose();
    };
    const handleDeleteConfirm = (id) => {
        setAchievements((prev) => prev.filter(a => a.id !== id));
        setDeleteModalOpen(false);
        setSelectedAchievement(null);
    };
    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setSelectedAchievement(null);
    };
    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedAchievement(null);
    };
    // Remove handleModalSubmit and use onUpdate instead
    const handleUpdate = (updatedAchievement) => {
        setAchievements(prev =>
            prev.map(a =>
                a.id === updatedAchievement.id ? { ...a, ...updatedAchievement } : a
            )
        );
    };

    const handleCreate = (newAchievement) => {
        setAchievements(prev => [...prev, newAchievement]);
    };

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    bgcolor: '#fff',
                    width: '100%',
                    maxWidth: '100%',
                    mx: 0,
                }}
            >
                <Typography
                    variant="h5"
                    mb={2}
                    p={2}
                    sx={{ fontWeight: 900, color: '#111' }}
                >
                    Achievements Management
                </Typography>
                <AchievementCreate onCreate={handleCreate} trigger={<Button
                    variant="contained"
                    color="primary"
                    sx={{
                        mr: 2,
                        mt: 1,
                        mb: 2,
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    Add Achievement
                </Button>
                } />
            </Box>
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
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 15, lineHeight: 1.6 }}>Image</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 15, lineHeight: 1.6 }}>Name</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 15, lineHeight: 1.6 }}>Description</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 15, lineHeight: 1.6 }}>Type</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 15, lineHeight: 1.6 }}>Threshold</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 15, lineHeight: 1.6 }}>Point</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 15, lineHeight: 1.6 }}>Created At</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 15, lineHeight: 1.6, width: 80 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(pagedAchievements || []).map((row, idx) => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    sx={{
                                        transition: 'background 0.2s',
                                        bgcolor: idx % 2 === 0 ? '#fafbfc' : 'inherit',
                                        '&:hover': { bgcolor: '#f7f7f7' }
                                    }}
                                >
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, fontSize: 17, lineHeight: 1.6 }}>
                                        <Avatar src={row.image_url} alt={row.name} variant="rounded" sx={{ width: 40, height: 40 }} />
                                    </TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontWeight: 600, fontSize: 16, lineHeight: 1.6 }}>
                                        <Tooltip title={row.name} placement="top" arrow>
                                            <Box component="span" sx={{
                                                display: 'inline-block',
                                                maxWidth: 220,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                verticalAlign: 'middle',
                                            }}>
                                                {row.name}
                                            </Box>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontSize: 16, lineHeight: 1.6 }}>
                                        <Tooltip title={row.description} placement="top" arrow>
                                            <Box component="span" sx={{
                                                display: 'inline-block',
                                                maxWidth: 320,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                verticalAlign: 'middle',
                                            }}>
                                                {row.description}
                                            </Box>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontSize: 16, lineHeight: 1.6 }}>{row.achievement_type}</TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontSize: 16, lineHeight: 1.6 }}>{row.threshold_value}</TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontSize: 16, lineHeight: 1.6 }}>{row.point}</TableCell>
                                    <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontSize: 16, lineHeight: 1.6 }}>{new Date(row.created_at).toLocaleString()}</TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0', py: 2 }}>
                                        <IconButton
                                            aria-label="actions"
                                            onClick={e => handleActionClick(e, row)}
                                            size="small"
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <Menu
                anchorEl={actionAnchorEl}
                open={Boolean(actionAnchorEl)}
                onClose={handleActionClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleEdit} disabled={actionLoading}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleDelete} disabled={actionLoading} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>
            <AchievementUpdate
                open={modalOpen}
                onClose={handleModalClose}
                onUpdate={handleUpdate}
                initialValues={selectedAchievement}
            />
            <AchievementDelete
                open={deleteModalOpen}
                onClose={handleDeleteModalClose}
                onDelete={handleDeleteConfirm}
                achievement={selectedAchievement}
            />
            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </>
    );
} 