import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Icons
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Custom components & context
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import AppCard from '../../components/AppCard';
import { dbService } from '../../services/dbService';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  // Load SaaS Partner Agencies
  const [agencies] = useState(() => {
    const saved = localStorage.getItem('provisioned_agencies');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'agency_default',
        name: 'Sarah Admin',
        email: 'admin@aaaconsultancy.com',
        planId: 'growth',
        planName: 'Growth License',
        isPaid: true,
        createdAt: '2026-06-15T08:00:00.000Z'
      }
    ];
  });

  // Load audit activities/notifications from backend
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: dbService.getNotifications
  });

  // Helper for pricing plan costs
  const getPlanPrice = (planId) => {
    if (planId === 'starter') return 99;
    if (planId === 'growth') return 249;
    if (planId === 'enterprise') return 499;
    return 199;
  };

  // Compute SaaS Stats
  const totalAgencies = agencies.length;
  const activeSubscriptions = agencies.filter(a => a.isPaid).length;
  const suspendedSubscriptions = agencies.filter(a => !a.isPaid).length;
  const mrr = agencies.filter(a => a.isPaid).reduce((sum, a) => sum + getPlanPrice(a.planId), 0);

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Super Admin Workspace"
        subtitle="Platform health logs, tenant subscription metrics, and global agency account management."
      />

      {/* Grid of Statistical Cards */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard
          title="Total Registered Agencies"
          value={totalAgencies}
          icon={<BusinessIcon sx={{ color: '#00205B' }} />}
          color="#00205B"
        />
        <StatCard
          title="Active Licenses"
          value={activeSubscriptions}
          icon={<CheckCircleIcon sx={{ color: '#10B981' }} />}
          color="#10B981"
        />
        <StatCard
          title="Suspended / Unpaid"
          value={suspendedSubscriptions}
          icon={<PauseCircleIcon sx={{ color: '#EF4444' }} />}
          color="#EF4444"
        />
        <StatCard
          title="SaaS Monthly MRR"
          value={`€${mrr.toLocaleString()}`}
          icon={<AccountBalanceWalletIcon sx={{ color: '#F59E0B' }} />}
          color="#F59E0B"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Provisioned Agencies Overview List */}
        <Box className="col-span-12 lg:col-span-8">
          <AppCard
            title="Registered Partner Agencies"
            subheader="Overview of licensed agency admins and subscription status"
            action={
              <Button
                size="small"
                variant="text"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/agents')}
              >
                Go to Provisioning
              </Button>
            }
            noPadding
          >
            <TableContainer sx={{ maxHeight: 350 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Owner Name</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>License Plan</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agencies.slice(0, 5).map((a) => (
                    <TableRow key={a.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{a.name}</TableCell>
                      <TableCell>{a.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={a.planName || a.planId}
                          size="small"
                          color="secondary"
                          sx={{ fontWeight: 700, fontSize: '0.65rem', textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={a.isPaid ? 'Active' : 'Unpaid'}
                          size="small"
                          color={a.isPaid ? 'success' : 'warning'}
                          sx={{ fontWeight: 800, fontSize: '0.65rem' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {agencies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No agencies registered yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </AppCard>
        </Box>

        {/* Recent Platform Activities / Logs */}
        <Box className="col-span-12 lg:col-span-4">
          <AppCard title="SaaS System Logs" subheader="Recent platform and system audit tracking">
            {notifications.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No platform activity logged.
              </Typography>
            ) : (
              <List disablePadding>
                {notifications.slice(0, 4).map((notif, idx) => (
                  <React.Fragment key={notif.id}>
                    <ListItem sx={{ py: 1.2, px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                            {notif.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                              {notif.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                              {notif.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {idx < 3 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </AppCard>
        </Box>
      </Box>
    </Box>
  );
};

export default SuperAdminDashboard;
