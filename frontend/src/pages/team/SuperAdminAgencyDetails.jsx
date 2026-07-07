import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LayersIcon from '@mui/icons-material/Layers';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Components & Context
import PageHeader from '../../components/PageHeader';
import { useAlert } from '../../contexts/AlertContext';
import { SaaSInvoiceReceiptDialog } from '../payments/SaaSInvoiceReceiptDialog';

export const SuperAdminAgencyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Find agency details from localStorage
  const getAgencyData = () => {
    const saved = localStorage.getItem('provisioned_agencies');
    if (saved) {
      try {
        const agencies = JSON.parse(saved);
        return agencies.find(a => a.id === id);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  };

  const agency = getAgencyData();

  // Redirect back if agency not found
  if (!agency) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Agency profile not found in directory.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/agents')} sx={{ mt: 2 }}>
          Back to Provisioning
        </Button>
      </Box>
    );
  }

  // Calculate Dates
  const joinedDate = agency.createdAt ? new Date(agency.createdAt) : new Date('2026-06-15T08:00:00.000Z');
  const validUntil = new Date(joinedDate);
  validUntil.setDate(joinedDate.getDate() + 30); // 30-day billing cycle

  const today = new Date();
  const diffTime = validUntil - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const remainingDays = diffDays > 0 ? diffDays : 0;

  // Resolve plan configurations limits
  const getPlanDetails = (pId) => {
    const plansStr = localStorage.getItem('saas_plans');
    if (plansStr) {
      try {
        const plans = JSON.parse(plansStr);
        const plan = plans.find(p => p.id === pId);
        if (plan) return plan;
      } catch (e) { }
    }
    // Fallback static configuration
    if (pId === 'starter') return { name: 'Starter License', price: 99, maxAgents: 3, maxCases: 50 };
    if (pId === 'enterprise') return { name: 'Enterprise License', price: 499, maxAgents: -1, maxCases: -1 };
    return { name: 'Growth License', price: 249, maxAgents: 10, maxCases: 200 };
  };

  const plan = getPlanDetails(agency.planId || 'growth');

  // Resolve real-time team agents count matched by email domain
  const getAgentsUsage = () => {
    const domain = (agency.email || '').split('@')[1]?.toLowerCase();
    if (!domain) return 1;
    try {
      const saved = localStorage.getItem('crm-agents-list');
      if (saved) {
        const list = JSON.parse(saved);
        return list.filter(u => u.email.toLowerCase().includes(domain)).length;
      }
    } catch (e) { }
    return 1;
  };

  // Resolve leads count (mock for sandbox, default Sarah has active leads count)
  const getLeadsUsage = () => {
    if (agency.email === 'admin@aaaconsultancy.com') {
      try {
        const saved = localStorage.getItem('leads');
        if (saved) {
          return JSON.parse(saved).length;
        }
      } catch (e) { }
      return 12; // default mock
    }
    // New tenants start with 0
    return 0;
  };

  const currentAgentsCount = getAgentsUsage();
  const currentLeadsCount = getLeadsUsage();

  // Helper values for limits progress display
  const agentsLimit = plan.maxAgents !== undefined ? parseInt(plan.maxAgents) : 10;
  const casesLimit = plan.maxCases !== undefined ? parseInt(plan.maxCases) : 200;

  const agentsPercent = agentsLimit === -1 ? 10 : Math.min(100, (currentAgentsCount / agentsLimit) * 100);
  const casesPercent = casesLimit === -1 ? 10 : Math.min(100, (currentLeadsCount / casesLimit) * 100);

  // Resolve previous plans logs history
  const getSubscriptionHistory = () => {
    if (agency.id === 'agency_default') {
      return [
        { planName: 'Growth License', price: 249, status: 'Active', activatedAt: '6/15/2026', expiredAt: 'Present' },
        { planName: 'Starter License', price: 99, status: 'Upgraded', activatedAt: '3/15/2026', expiredAt: '6/15/2026' }
      ];
    }
    // For other dummy agencies or new registrations, show their current plan only
    const actDate = joinedDate.toLocaleDateString();
    return [
      { planName: plan.name, price: plan.price, status: 'Active', activatedAt: actDate, expiredAt: 'Present' }
    ];
  };

  // Generate simulated invoice logs for billing tab
  const getInvoices = () => {
    if (agency.id === 'agency_default') {
      return [
        { id: 'INV-DEF-04', date: '6/15/2026', planName: 'Growth License', amount: 249, gateway: 'Stripe Gateway', status: 'Paid' },
        { id: 'INV-DEF-03', date: '5/15/2026', planName: 'Starter License', amount: 99, gateway: 'Stripe Gateway', status: 'Paid' },
        { id: 'INV-DEF-02', date: '4/15/2026', planName: 'Starter License', amount: 99, gateway: 'Stripe Gateway', status: 'Paid' },
        { id: 'INV-DEF-01', date: '3/15/2026', planName: 'Starter License', amount: 99, gateway: 'Stripe Gateway', status: 'Paid' }
      ];
    }
    // Generic invoice list for other mock entries
    const actDate = joinedDate.toLocaleDateString();
    return [
      {
        id: `INV-${agency.id.toUpperCase().substring(7, 11)}-01`,
        date: actDate,
        planName: plan.name,
        amount: plan.price,
        gateway: agency.isPaid ? 'Stripe Gateway' : 'Bank Payout Pnd.',
        status: agency.isPaid ? 'Paid' : 'Unpaid'
      }
    ];
  };

  const invoices = getInvoices();
  const history = getSubscriptionHistory();

  return (
    <Box sx={{ pb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: 'text.secondary', display: 'inline-flex' }}
      >
        Back to Directory
      </Button>

      <PageHeader
        title={`Subscription Details: ${agency.name}`}
        subtitle="Manage license activation status, inspect active workspace limits, and review payment history."
      />

      {/* Row 1: Profile Summary (Subscription Settings) */}
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LayersIcon sx={{ color: 'secondary.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#00205B' }}>
              Subscription Settings
            </Typography>
          </Box>
          <Chip
            label={agency.isPaid ? 'Active (Paid)' : 'Suspended (Unpaid)'}
            color={agency.isPaid ? 'success' : 'warning'}
            icon={agency.isPaid ? <CheckCircleIcon /> : <PauseCircleFilledIcon />}
            sx={{ fontWeight: 800, px: 1 }}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Active SaaS Plan</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#00205B' }}>{plan.name}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Plan Price</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#00205B' }}>€{plan.price} / month</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Owner Name</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#00205B' }}>{agency.name}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Email Address</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#00205B' }}>{agency.email}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Phone Number</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#00205B' }}>{agency.phone || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Account Provisioned</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#00205B' }}>{joinedDate.toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Row 2: Validity Clock & Invoices Log */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', md: 'row' }, width: '100%', alignItems: 'stretch' }}>
        {/* Row 2, Column 1: Expiration Calendar (License Validity Clock) */}
        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, bgcolor: 'secondary.main', color: '#fff' }}>
          <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CalendarMonthIcon />
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                License Validity Clock
              </Typography>
            </Box>

            <Box sx={{ my: 1.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                {agency.isPaid ? `${remainingDays} Days Left` : 'Suspended'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.78rem', fontWeight: 500 }}>
                Next billing cycle payout due.
              </Typography>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', my: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600, display: 'block' }}>ACTIVATED ON</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{joinedDate.toLocaleDateString()}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600, display: 'block' }}>VALID UNTIL</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{validUntil.toLocaleDateString()}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Row 2, Column 2: Historical Invoices log */}
        <Paper sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.neutral' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalanceWalletIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
                Billing Transactions Log
              </Typography>
            </Box>
          </Box>

          <TableContainer sx={{ flexGrow: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Invoice</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        color: 'secondary.main',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvoice({
                          ...inv,
                          agencyName: agency.name,
                          email: agency.email,
                          phone: agency.phone
                        });
                        setInvoiceModalOpen(true);
                      }}
                    >
                      {inv.id}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.72rem' }}>{inv.date}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem' }}>€{inv.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={inv.status}
                        size="small"
                        color={inv.status === 'Paid' ? 'success' : 'warning'}
                        sx={{ fontSize: '0.6rem', height: 16, fontWeight: 800 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Row 3: Limits and History */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, width: '100%', alignItems: 'stretch' }}>
        {/* Row 3, Column 1: Workspace usage limits */}
        <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#00205B', mb: 3 }}>
            SaaS CRM Workspace Limits Usage
          </Typography>

          {/* Progress 1: Agents */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <GroupsIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>Registered Agents (Seats)</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#00205B' }}>
                {currentAgentsCount} / {agentsLimit === -1 ? 'Unlimited' : agentsLimit}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={agentsPercent}
              color={agentsPercent > 90 ? 'error' : 'secondary'}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.68rem' }}>
              Total user accounts created inside this tenant workspace directory.
            </Typography>
          </Box>

          {/* Progress 2: Cases */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AssignmentIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>Active Leads / Cases</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#00205B' }}>
                {currentLeadsCount} / {casesLimit === -1 ? 'Unlimited' : casesLimit}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={casesPercent}
              color={casesPercent > 90 ? 'error' : 'secondary'}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.68rem' }}>
              Total qualified clients and pipeline lead profiles registered in database.
            </Typography>
          </Box>
        </Paper>

        {/* Row 3, Column 2: Subscription Plans History */}
        <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#00205B', mb: 2 }}>
            Subscription Plan History Logs
          </Typography>
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>License Tier</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Activated Date</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((h, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{h.planName}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>€{h.price} / mo</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{h.activatedAt}</TableCell>
                    <TableCell>
                      <Chip
                        label={h.status}
                        size="small"
                        color={h.status === 'Active' ? 'success' : 'default'}
                        sx={{ fontSize: '0.62rem', height: 18, fontWeight: 800 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <SaaSInvoiceReceiptDialog
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        invoice={selectedInvoice}
      />
    </Box>
  );
};

export default SuperAdminAgencyDetails;
