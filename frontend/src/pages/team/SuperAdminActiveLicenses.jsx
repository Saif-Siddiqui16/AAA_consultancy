import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddIcon from '@mui/icons-material/Add';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Services & Components
import PageHeader from '../../components/PageHeader';
import { useAlert } from '../../contexts/AlertContext';

const DEFAULT_AGENCIES = [
  {
    id: 'agency_default',
    name: 'Sarah Admin',
    email: 'admin@aaaconsultancy.com',
    password: 'password123',
    phone: '+971 50 123 4567',
    planId: 'growth',
    planName: 'Growth License',
    isPaid: true,
    createdAt: '2026-06-15T08:00:00.000Z'
  },
  {
    id: 'agency_apex',
    name: 'Rajesh Kumar',
    email: 'admin@apexrelocations.in',
    password: 'password123',
    phone: '+91 98765 43210',
    planId: 'starter',
    planName: 'Starter License',
    isPaid: true,
    createdAt: '2026-06-18T10:30:00.000Z'
  },
  {
    id: 'agency_global',
    name: 'Emma Watson',
    email: 'watson@globalvisas.co.uk',
    password: 'password123',
    phone: '+44 20 7946 0958',
    planId: 'enterprise',
    planName: 'Enterprise License',
    isPaid: true,
    createdAt: '2026-06-20T14:15:00.000Z'
  },
  {
    id: 'agency_gulf',
    name: 'Ahmed Al-Mansoori',
    email: 'ahmed@gulfexpats.ae',
    password: 'password123',
    phone: '+971 55 987 6543',
    planId: 'growth',
    planName: 'Growth License',
    isPaid: false,
    createdAt: '2026-06-25T09:00:00.000Z'
  },
  {
    id: 'agency_orient',
    name: 'Sophia Chen',
    email: 'sophia@orientconsult.sg',
    password: 'password123',
    phone: '+65 6789 0123',
    planId: 'starter',
    planName: 'Starter License',
    isPaid: false,
    createdAt: '2026-06-28T11:00:00.000Z'
  }
];

export const SuperAdminActiveLicenses = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  // State
  const [agencies, setAgencies] = useState(() => {
    const saved = localStorage.getItem('provisioned_agencies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length <= 1) {
          localStorage.setItem('provisioned_agencies', JSON.stringify(DEFAULT_AGENCIES));
          return DEFAULT_AGENCIES;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('provisioned_agencies', JSON.stringify(DEFAULT_AGENCIES));
    return DEFAULT_AGENCIES;
  });

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);

  // Form Fields
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [planId, setPlanId] = useState('growth');
  const [isPaid, setIsPaid] = useState(true);
  const [newPassword, setNewPassword] = useState('');

  // Handle cross-tab or storage synchronization
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('provisioned_agencies');
      if (saved) {
        setAgencies(JSON.parse(saved));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // SaaS plans loaded from localStorage
  const getPlansList = () => {
    const saved = localStorage.getItem('saas_plans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 'starter', name: 'Starter License', price: 99 },
      { id: 'growth', name: 'Growth License', price: 249 },
      { id: 'enterprise', name: 'Enterprise License', price: 499 }
    ];
  };

  const plans = getPlansList();

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setPlanId('growth');
    setIsPaid(true);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setOpenAddModal(true);
  };

  const handleOpenEditModal = (agency) => {
    setSelectedAgency(agency);
    setName(agency.name || '');
    setEmail(agency.email || '');
    setPhone(agency.phone || '');
    setPlanId(agency.planId || 'growth');
    setIsPaid(agency.isPaid !== undefined ? agency.isPaid : true);
    setOpenEditModal(true);
  };

  const handleOpenResetPasswordModal = (agency) => {
    setSelectedAgency(agency);
    setNewPassword('');
    setOpenResetPasswordModal(true);
  };

  const saveAgencies = (updated) => {
    setAgencies(updated);
    localStorage.setItem('provisioned_agencies', JSON.stringify(updated));
    // Trigger storage event manually for same window sync
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      showAlert('Please fill in all required fields.', 'warning');
      return;
    }

    if (agencies.some(a => a.email.toLowerCase() === email.toLowerCase())) {
      showAlert('An account with this email already exists.', 'error');
      return;
    }

    const selectedPlan = plans.find(p => p.id === planId) || { name: 'Custom Plan' };
    const newAgency = {
      id: 'agency_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      password,
      phone,
      planId,
      planName: selectedPlan.name,
      isPaid,
      createdAt: new Date().toISOString()
    };

    const updated = [...agencies, newAgency];
    saveAgencies(updated);
    setOpenAddModal(false);
    showAlert('Agency admin account created successfully!', 'success');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      showAlert('Please fill in all required fields.', 'warning');
      return;
    }

    const selectedPlan = plans.find(p => p.id === planId) || { name: 'Custom Plan' };
    const updated = agencies.map(a => {
      if (a.id === selectedAgency.id) {
        return {
          ...a,
          name,
          email,
          phone,
          planId,
          planName: selectedPlan.name,
          isPaid
        };
      }
      return a;
    });

    saveAgencies(updated);
    setOpenEditModal(false);
    showAlert('Agency account details updated!', 'success');
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showAlert('Please enter a password.', 'warning');
      return;
    }

    const updated = agencies.map(a => {
      if (a.id === selectedAgency.id) {
        return { ...a, password: newPassword };
      }
      return a;
    });

    saveAgencies(updated);
    setOpenResetPasswordModal(false);
    showAlert('Agency password reset successfully!', 'success');
  };

  const handleDeleteAgency = (id) => {
    if (window.confirm('Are you sure you want to delete this agency? All workspace data and configurations will be removed.')) {
      const updated = agencies.filter(a => a.id !== id);
      saveAgencies(updated);
      showAlert('Agency deleted successfully.', 'success');
    }
  };

  const activeAgencies = agencies.filter(a => a.isPaid === true);

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Active SaaS Licenses"
        subtitle="Directory of paid partner agency workspaces active on the platform."
        action={
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
            sx={{ fontWeight: 700 }}
          >
            Provision New Agency
          </Button>
        }
      />

      <Paper sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden', mt: 3 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.neutral' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
            Paid Subscriptions Ledger
          </Typography>
        </Box>

        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Agency Admin Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Active SaaS Plan</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Provision Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#00205B' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeAgencies.map((agency) => (
                <TableRow
                  key={agency.id}
                  hover
                  onClick={() => navigate(`/super_admin/agency-details/${agency.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{agency.name}</TableCell>
                  <TableCell>{agency.email}</TableCell>
                  <TableCell>{agency.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={agency.planName || agency.planId}
                      size="small"
                      color="secondary"
                      sx={{ fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Active (Paid)"
                      size="small"
                      color="success"
                      sx={{ fontWeight: 800, fontSize: '0.68rem' }}
                    />
                  </TableCell>
                  <TableCell>{agency.createdAt ? new Date(agency.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Reset Password">
                        <IconButton size="small" onClick={() => handleOpenResetPasswordModal(agency)} color="inherit">
                          <LockResetIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Agency">
                        <IconButton size="small" onClick={() => handleOpenEditModal(agency)} color="secondary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Agency">
                        <IconButton size="small" onClick={() => handleDeleteAgency(agency.id)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {activeAgencies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No active licenses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ─── ADD AGENCY MODAL ─── */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>➕ Provision New SaaS Workspace</DialogTitle>
        <Divider />
        <form onSubmit={handleAddSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5 }}>
            <TextField label="Owner/Admin Full Name *" size="small" fullWidth value={name} onChange={e => setName(e.target.value)} required />
            <TextField label="Owner Email Address *" type="email" size="small" fullWidth value={email} onChange={e => setEmail(e.target.value)} required />
            <TextField label="Account Password *" type="password" size="small" fullWidth value={password} onChange={e => setPassword(e.target.value)} required />
            <TextField label="Owner Phone Number *" size="small" fullWidth value={phone} onChange={e => setPhone(e.target.value)} required />
            
            <FormControl size="small" fullWidth>
              <InputLabel>Choose License Plan *</InputLabel>
              <Select value={planId} label="Choose License Plan *" onChange={e => setPlanId(e.target.value)}>
                {plans.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Switch checked={isPaid} onChange={e => setIsPaid(e.target.checked)} color="success" />}
              label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Mark subscription payment status as Paid (Active)</Typography>}
            />
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setOpenAddModal(false)} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>Provision Workspace</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── EDIT AGENCY MODAL ─── */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>⚙️ Edit Agency License Settings</DialogTitle>
        <Divider />
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5 }}>
            <TextField label="Owner/Admin Full Name *" size="small" fullWidth value={name} onChange={e => setName(e.target.value)} required />
            <TextField label="Owner Email Address *" type="email" size="small" fullWidth value={email} onChange={e => setEmail(e.target.value)} required />
            <TextField label="Owner Phone Number *" size="small" fullWidth value={phone} onChange={e => setPhone(e.target.value)} required />
            
            <FormControl size="small" fullWidth>
              <InputLabel>Choose License Plan *</InputLabel>
              <Select value={planId} label="Choose License Plan *" onChange={e => setPlanId(e.target.value)}>
                {plans.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Switch checked={isPaid} onChange={e => setIsPaid(e.target.checked)} color="success" />}
              label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Mark subscription payment status as Paid (Active)</Typography>}
            />
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setOpenEditModal(false)} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── RESET PASSWORD MODAL ─── */}
      <Dialog open={openResetPasswordModal} onClose={() => setOpenResetPasswordModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>🔑 Reset Agency Admin Password</DialogTitle>
        <Divider />
        <form onSubmit={handleResetPasswordSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              Enter the new workspace password for <b>{selectedAgency?.name}</b> ({selectedAgency?.email}).
            </Typography>
            <TextField
              label="New Password *"
              type="password"
              size="small"
              fullWidth
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setOpenResetPasswordModal(false)} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>Update Password</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SuperAdminActiveLicenses;
