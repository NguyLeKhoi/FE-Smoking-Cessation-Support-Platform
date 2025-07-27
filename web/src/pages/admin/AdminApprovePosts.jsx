import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Box, IconButton, Divider, Tabs, Tab, Pagination, Badge } from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import PersonIcon from '@mui/icons-material/Person';
import DateRangeIcon from '@mui/icons-material/DateRange';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import postService from '../../services/postService';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

export default function AdminApprovePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // id of post being approved/rejected
  const [detailModal, setDetailModal] = useState({ open: false, post: null });
  const [reason, setReason] = useState('');
  const [tab, setTab] = useState(0); // 0: Pending, 1: Updating, 2: All
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await postService.getAllPosts();
      setPosts(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // Reset page về 1 khi đổi tab
  useEffect(() => { setPage(1); }, [tab]);

  const handleApprove = async (id, approved) => {
    setActionLoading(id);
    try {
      await postService.approvePost(id, { approved });
      fetchPosts();
    } catch (err) {
      // error toast đã có trong service
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await postService.getPostById(id);
      setDetailModal({ open: true, post: res.data });
      setReason('');
    } catch (err) {
      // error toast đã có trong service
    }
  };

  const handleApproveInModal = async (approved) => {
    if (!detailModal.post) return;
    setActionLoading(detailModal.post.id);
    try {
      const data = approved ? { status: 'APPROVED' } : { status: 'REJECTED', reason };
      await postService.approvePost(detailModal.post.id, data);
      fetchPosts();
      setDetailModal({ open: false, post: null });
    } catch (err) { }
    finally {
      setActionLoading(null);
    }
  };

  const statusColor = (status) => {
    if (status === 'Pending') return 'warning.main';
    if (status === 'Approved') return 'success.main';
    if (status === 'Rejected') return 'error.main';
    return 'text.secondary';
  };

  // tab: 0-Pending, 1-Updating, 2-Rejected, 3-All
  const filteredPosts = posts.filter(row => {
    if (tab === 0) return row.status === 'PENDING';
    if (tab === 1) return row.status === 'UPDATING';
    if (tab === 2) return row.status === 'REJECTED';
    return true;
  });

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const pagedPosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pendingCount = posts.filter(row => row.status === 'PENDING').length;
  const updatingCount = posts.filter(row => row.status === 'UPDATING').length;
  const rejectedCount = posts.filter(row => row.status === 'REJECTED').length;
  const allCount = posts.length;

  return (
    <>
      <Typography variant="h5" mb={2} p={2} sx={{ fontWeight: 900, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff', width: '100%', maxWidth: '100%', mx: 0, color: '#111' }}>Approve Posts</Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="outlined"
        sx={{
          mb: 2,
          minHeight: 44,
          '& .MuiTabs-flexContainer': { gap: 2 },
          '& .MuiTab-root': {
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 16,
            px: 4,
            py: 1.5,
            minHeight: 44,
            color: '#222',
            bgcolor: '#f5f7fa',
            border: '1px solid #e0e0e0',
            transition: 'all 0.2s',
            '&.Mui-selected': {
              bgcolor: '#111',
              color: '#fff',
              borderColor: '#111',
            },
            '&:not(:last-of-type)': { mr: 1 },
            display: 'flex', alignItems: 'center',
          },
          bgcolor: 'transparent',
          border: 'none',
        }}
        TabIndicatorProps={{ style: { display: 'none' } }}
      >
        <Tab label={<span style={{ display: 'inline-flex', alignItems: 'center' }}>Pending<span style={{ fontWeight: 700, fontSize: 15, marginLeft: 8, lineHeight: 1, display: 'inline-block', minWidth: 22, textAlign: 'center', background: '#eee', borderRadius: 8, padding: '0 6px', color: '#222' }}>{pendingCount}</span></span>} disableRipple />
        <Tab label={<span style={{ display: 'inline-flex', alignItems: 'center' }}>Updating<span style={{ fontWeight: 700, fontSize: 15, marginLeft: 8, lineHeight: 1, display: 'inline-block', minWidth: 22, textAlign: 'center', background: '#eee', borderRadius: 8, padding: '0 6px', color: '#222' }}>{updatingCount}</span></span>} disableRipple />
        <Tab label={<span style={{ display: 'inline-flex', alignItems: 'center' }}>Rejected<span style={{ fontWeight: 700, fontSize: 15, marginLeft: 8, lineHeight: 1, display: 'inline-block', minWidth: 22, textAlign: 'center', background: '#eee', borderRadius: 8, padding: '0 6px', color: '#222' }}>{rejectedCount}</span></span>} disableRipple />
        <Tab label={<span style={{ display: 'inline-flex', alignItems: 'center' }}>All<span style={{ fontWeight: 700, fontSize: 15, marginLeft: 8, lineHeight: 1, display: 'inline-block', minWidth: 22, textAlign: 'center', background: '#eee', borderRadius: 8, padding: '0 6px', color: '#222' }}>{allCount}</span></span>} disableRipple />
      </Tabs>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>Loading...</Box>
      ) : error ? (
        <Typography color="error" align="center" py={2}>{error}</Typography>
      ) : (
        <>
          <TableContainer sx={{ width: '100%', maxWidth: '100%', mx: 0, bgcolor: '#fff', borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7fa', borderRadius: 0 }}>
                  <TableCell align="center" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17, width: 60 }}>No.</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}>Title</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><PersonIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Author</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><DateRangeIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Created</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><VerifiedUserIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Status</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><SettingsIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5, color: '#888', fontSize: 17, fontWeight: 500 }}>
                      No posts found in this status.
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedPosts.map((row, idx) => (
                    <TableRow key={row.id || idx} hover sx={{ transition: 'background 0.2s', '&:hover': { bgcolor: '#f7f7f7' } }}>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontWeight: 600 }}>{idx + 1 + (page - 1) * PAGE_SIZE}</TableCell>
                      <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontWeight: 600 }}>{row.title}</TableCell>
                      <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{
                        row.user?.first_name || row.user?.last_name
                          ? `${row.user?.first_name || ''} ${row.user?.last_name || ''}`.trim()
                          : (row.first_name || row.last_name
                            ? `${row.first_name || ''} ${row.last_name || ''}`.trim()
                            : (row.author || row.username || row.user?.username || ''))
                      }</TableCell>
                      <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.created || row.created_at || ''}</TableCell>
                      <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>
                        <Box component="span" fontWeight={700} color={statusColor(row.status)}>
                          {row.status}
                        </Box>
                      </TableCell>
                      <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2 }}>
                        <Button variant="outlined" size="small" onClick={() => handleView(row.id)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                          View Post Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
          <Dialog open={detailModal.open} onClose={() => setDetailModal({ open: false, post: null })} maxWidth="md" fullWidth>
            <DialogTitle>Post Details</DialogTitle>
            <DialogContent dividers={false} sx={{ pt: 2 }}>
              {detailModal.post ? (
                <Box>
                  <Typography variant="h6" fontWeight={900}>{detailModal.post.title}</Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                    By: {detailModal.post.user?.first_name || detailModal.post.user?.last_name ? `${detailModal.post.user?.first_name || ''} ${detailModal.post.user?.last_name || ''}`.trim() : (detailModal.post.first_name || detailModal.post.last_name ? `${detailModal.post.first_name || ''} ${detailModal.post.last_name || ''}`.trim() : (detailModal.post.author || detailModal.post.username || detailModal.post.user?.username || ''))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Created: {detailModal.post.created || detailModal.post.created_at || ''}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Status: {detailModal.post.status}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{detailModal.post.content}</Typography>
                  {(detailModal.post.status === 'PENDING' || detailModal.post.status === 'UPDATING') && (
                    <Box mt={3}>
                      <TextField
                        label="Reason (if reject)"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                        sx={{ mb: 2 }}
                      />
                      <DialogActions>
                        <Button onClick={() => handleApproveInModal(false)} color="error" variant="contained" disabled={actionLoading === detailModal.post.id}>Reject</Button>
                        <Button onClick={() => handleApproveInModal(true)} color="success" variant="contained" disabled={actionLoading === detailModal.post.id}>Approve</Button>
                      </DialogActions>
                    </Box>
                  )}
                </Box>
              ) : null}
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
} 