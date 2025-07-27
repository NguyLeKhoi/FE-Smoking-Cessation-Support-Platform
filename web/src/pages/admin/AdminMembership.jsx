import React, { useEffect, useState } from 'react';
import {
 Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, CircularProgress, Snackbar, Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import membershipService from '../../services/membershipService';

const defaultForm = {
  name: '',
  description: '',
  price: '',
  duration_days: '',
  features: [],
  featureInput: '',
};

export default function AdminMembership() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit'
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchPlans = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await membershipService.getMembershipPlans();
      setPlans(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleOpenModal = (type = 'create', plan = null) => {
    setModalType(type);
    if (type === 'edit' && plan) {
      setEditId(plan.id);
      setForm({
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price || '',
        duration_days: plan.duration_days || '',
        features: Array.isArray(plan.features) ? plan.features : [],
        featureInput: '',
      });
    } else {
      setEditId(null);
      setForm(defaultForm);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setForm(defaultForm);
    setEditId(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddFeature = () => {
    if (form.featureInput.trim()) {
      setForm({ ...form, features: [...form.features, form.featureInput.trim()], featureInput: '' });
    }
  };

  const handleDeleteFeature = (idx) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      duration_days: parseInt(form.duration_days, 10),
      features: form.features,
    };
    try {
      if (modalType === 'create') {
        await membershipService.createMembershipPlan(payload);
        setSnackbar({ open: true, message: 'Created successfully!', severity: 'success' });
      } else {
        await membershipService.updateMembershipPlan(editId, payload);
        setSnackbar({ open: true, message: 'Updated successfully!', severity: 'success' });
      }
      handleCloseModal();
      fetchPlans();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error! ' + (err?.response?.data?.message || err.message), severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await membershipService.deleteMembershipPlan(id);
      setSnackbar({ open: true, message: 'Deleted successfully!', severity: 'success' });
      fetchPlans();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error! ' + (err?.response?.data?.message || err.message), severity: 'error' });
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2} sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: '#fff', width: '100%', maxWidth: '100%', mx: 0, mb: 2 }}>
        <Typography variant="h5" fontWeight={900} sx={{ color: '#111' }}>Membership Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal('create')} sx={{ borderRadius: 1, boxShadow: 'none', fontWeight: 700, bgcolor: '#111', color: '#fff', px: 3, py: 1, '&:hover': { bgcolor: '#222' } }}>
          Create Plan
        </Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error" align="center" py={2}>{error}</Typography>
      ) : (
        <TableContainer sx={{ width: '100%', maxWidth: '100%', mx: 0, bgcolor: '#fff', borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa', borderRadius: 0 }}>
                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><CardMembershipIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Name</TableCell>
                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><DescriptionIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Description</TableCell>
                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><DateRangeIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Duration</TableCell>
                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><VerifiedUserIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Price</TableCell>
                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><PersonIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Features</TableCell>
                <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((row) => (
                <TableRow key={row.id} hover sx={{ transition: 'background 0.2s', '&:hover': { bgcolor: '#f7f7f7' } }}>
                  <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontWeight: 600 }}>{row.name}</TableCell>
                  <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.description}</TableCell>
                  <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.duration_days} days</TableCell>
                  <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>${row.price}</TableCell>
                  <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>
                    {Array.isArray(row.features) && row.features.map((f, i) => (
                      <Chip key={i} label={f} size="small" sx={{ m: 0.2, bgcolor: '#f5f5f5', color: '#111', fontWeight: 500 }} />
                    ))}
                  </TableCell>
                  <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2 }}>
                    <IconButton color="primary" onClick={() => handleOpenModal('edit', row)} sx={{ borderRadius: '50%', bgcolor: '#f5f5f5', color: '#111', mx: 0.5, '&:hover': { bgcolor: '#222', color: '#fff' } }}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(row.id)} disabled={deleteLoading === row.id} sx={{ borderRadius: '50%', bgcolor: '#f5f5f5', color: '#d32f2f', mx: 0.5, '&:hover': { bgcolor: '#222', color: '#fff' } }}>
                      {deleteLoading === row.id ? <CircularProgress size={20} /> : <DeleteIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Modal Create/Edit */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>{modalType === 'create' ? 'Create Membership Plan' : 'Edit Membership Plan'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, maxHeight: '70vh', overflowY: 'auto' }}>
          <Box>
            <Typography fontWeight={700} mb={0.5} htmlFor="membership-name">Name *</Typography>
            <TextField id="membership-name" name="name" value={form.name} onChange={handleFormChange} fullWidth required variant="outlined" placeholder="Enter plan name" InputLabelProps={{ shrink: true }} />
          </Box>
          <Box>
            <Typography fontWeight={700} mb={0.5} htmlFor="membership-description">Description *</Typography>
            <TextField id="membership-description" name="description" value={form.description} onChange={handleFormChange} fullWidth required variant="outlined" placeholder="Enter description" InputLabelProps={{ shrink: true }} />
          </Box>
          <Box>
            <Typography fontWeight={700} mb={0.5} htmlFor="membership-price">Price *</Typography>
            <TextField id="membership-price" name="price" value={form.price} onChange={handleFormChange} type="number" fullWidth required variant="outlined" placeholder="Enter price" InputLabelProps={{ shrink: true }} />
          </Box>
          <Box>
            <Typography fontWeight={700} mb={0.5} htmlFor="membership-duration">Duration (days) *</Typography>
            <TextField id="membership-duration" name="duration_days" value={form.duration_days} onChange={handleFormChange} type="number" fullWidth required variant="outlined" placeholder="Enter duration in days" InputLabelProps={{ shrink: true }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" mb={1}>Features</Typography>
            <Box display="flex" gap={1} mb={1}>
              <TextField label="Add feature" value={form.featureInput} onChange={e => setForm({ ...form, featureInput: e.target.value })} size="small" variant="outlined" InputLabelProps={{ shrink: true }} />
              <Button variant="outlined" onClick={handleAddFeature}>Add</Button>
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              {form.features.map((f, i) => (
                <Chip key={i} label={f} onDelete={() => handleDeleteFeature(i)} />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{modalType === 'create' ? 'Create' : 'Update'}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
} 