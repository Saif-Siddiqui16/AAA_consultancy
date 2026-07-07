import React, { useState } from 'react';
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

export const SuperAdminAgents = () => {
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
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      showAlert('Please fill in all required fields.', 'warning');
      return;
    }

    // Check if email already exists
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

  const handleDeleteAgency = (id, name) => {
    if (window.confirm(`Are you sure you want to delete agency admin ${name}? This will revoke their platform access.`)) {
      const updated = agencies.filter(a => a.id !== id);
      saveAgencies(updated);
      showAlert('Agency account deleted.', 'success');
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="SaaS Agency Provisioning"
        subtitle="Provision partner agency admin accounts, choose subscription licensing plans, and track billing payment logs."
        action={
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
            sx={{ borderRadius: 2.5, fontWeight: 700 }}
          >
            Provision New Agency
          </Button>
        }
      />

      <Box sx={{ flexGrow: 1, overflow: 'hidden', mt: 1 }}>
        <Paper
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.neutral' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
              Partner Agency Accounts Directory
            </Typography>
          </Box>

          <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Agency Admin Name</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Active SaaS Plan</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Expiry Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Provision Date</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agencies.map((agency) => {
                  const joinedDate = agency.createdAt ? new Date(agency.createdAt) : new Date();
                  const validUntil = agency.validUntil ? new Date(agency.validUntil) : new Date(joinedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                  const diffTime = validUntil.getTime() - new Date().getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  let expiryText = '';
                  let expiryColor = 'text.secondary';
                  let isWarning = false;

                  if (!agency.isPaid) {
                    expiryText = 'Inactive';
                    expiryColor = 'error.main';
                  } else if (diffDays <= 0) {
                    expiryText = 'Expired';
                    expiryColor = 'error.main';
                  } else if (diffDays <= 9) { // 9 or less days left is a warning
                    expiryText = `Expires in ${diffDays}d`;
                    expiryColor = 'warning.main';
                    isWarning = true;
                  } else {
                    expiryText = `${diffDays} days left`;
                    expiryColor = 'success.main';
                  }

                  return (
                    <TableRow
                      key={agency.id}
                      hover
                      onClick={() => navigate(`/super_admin/agency-details/${agency.id}`)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ fontWeight: 700 }}>{agency.name}</TableCell>
                      <TableCell>{agency.email}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{agency.phone}</TableCell>
                      <TableCell>
                         <Chip
                           label={agency.planName || agency.planId}
                           size="small"
                           color="secondary"
                           sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                         />
                      </TableCell>
                      <TableCell>
                         <Chip
                           label={agency.isPaid ? 'Active (Paid)' : 'Suspended (Unpaid)'}
                           size="small"
                           color={agency.isPaid ? 'success' : 'warning'}
                           sx={{ fontWeight: 800 }}
                         />
                      </TableCell>
                      <TableCell>
                         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                           <Typography variant="body2" sx={{ fontWeight: 800, color: expiryColor, display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: '0.72rem' }}>
                             {isWarning && <span>⚠️</span>} {expiryText}
                           </Typography>
                           {agency.isPaid && diffDays > 0 && (
                             <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', fontWeight: 600 }}>
                               {validUntil.toLocaleDateString()}
                             </Typography>
                           )}
                         </Box>
                       </TableCell>
                      <TableCell>
                        {agency.createdAt ? new Date(agency.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="Reset Password">
                          <IconButton size="small" color="inherit" onClick={() => handleOpenResetPasswordModal(agency)}>
                            <LockResetIcon sx={{ fontSize: '1.2rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Details">
                          <IconButton size="small" color="primary" onClick={() => handleOpenEditModal(agency)}>
                            <EditIcon sx={{ fontSize: '1.2rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Agency">
                          <IconButton size="small" color="error" onClick={() => handleDeleteAgency(agency.id, agency.name)}>
                            <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* ─── Add Agency Dialog ─── */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <form onSubmit={handleAddSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>➕ Provision New SaaS Partner Agency</DialogTitle>
          <Divider />
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 3 }}>
            <TextField
              label="Agency Owner Name"
              size="small"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />
            <TextField
              label="Admin Email Address"
              type="email"
              size="small"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@partneragency.com"
            />
            <TextField
              label="Owner Phone Number"
              size="small"
              fullWidth
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +971 50 123 4567"
            />
            <TextField
              label="Initial Account Password"
              type="password"
              size="small"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />

            <Box className="grid grid-cols-12 gap-3 items-center">
              <Box className="col-span-8">
                <FormControl fullWidth size="small">
                  <InputLabel>SaaS License Plan</InputLabel>
                  <Select
                    label="SaaS License Plan"
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                  >
                    {plans.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box className="col-span-4">
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPaid}
                      onChange={(e) => setIsPaid(e.target.checked)}
                      color="success"
                    />
                  }
                  label={<Typography sx={{ fontSize: '0.78rem', fontWeight: 800 }}>Mark as Paid</Typography>}
                />
              </Box>
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button onClick={() => setOpenAddModal(false)} variant="outlined" color="inherit" sx={{ fontWeight: 700 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>
              Provision Agency
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── Edit Agency Dialog ─── */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <form onSubmit={handleEditSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>✏️ Edit Provisioned Partner Agency</DialogTitle>
          <Divider />
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 3 }}>
            <TextField
              label="Agency Owner Name"
              size="small"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Admin Email Address"
              type="email"
              size="small"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Owner Phone Number"
              size="small"
              fullWidth
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Box className="grid grid-cols-12 gap-3 items-center">
              <Box className="col-span-8">
                <FormControl fullWidth size="small">
                  <InputLabel>SaaS License Plan</InputLabel>
                  <Select
                    label="SaaS License Plan"
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                  >
                    {plans.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box className="col-span-4">
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPaid}
                      onChange={(e) => setIsPaid(e.target.checked)}
                      color="success"
                    />
                  }
                  label={<Typography sx={{ fontSize: '0.78rem', fontWeight: 800 }}>Mark as Paid</Typography>}
                />
              </Box>
            </Box>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button onClick={() => setOpenEditModal(false)} variant="outlined" color="inherit" sx={{ fontWeight: 700 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── Reset Password Dialog ─── */}
      <Dialog open={openResetPasswordModal} onClose={() => setOpenResetPasswordModal(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <form onSubmit={handleResetPasswordSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>🔒 Reset Agency Admin Password</DialogTitle>
          <Divider />
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Enter a new temporary login password for <strong>{selectedAgency?.name}</strong> (<strong>{selectedAgency?.email}</strong>).
            </Typography>
            <TextField
              label="New Password"
              type="password"
              size="small"
              fullWidth
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button onClick={() => setOpenResetPasswordModal(false)} variant="outlined" color="inherit" sx={{ fontWeight: 700 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>
              Reset Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SuperAdminAgents;
