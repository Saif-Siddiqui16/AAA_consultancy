import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Icons
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Components & Services
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import { SaaSInvoiceReceiptDialog } from './SaaSInvoiceReceiptDialog';

const COLORS = ['#00205B', '#14B8A6', '#F59E0B', '#EF4444'];

export const SuperAdminPaymentDashboard = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Load provisioned agencies to calculate SaaS invoice transactions
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

  const getPlanPrice = (planId) => {
    if (planId === 'starter') return 99;
    if (planId === 'growth') return 249;
    if (planId === 'enterprise') return 499;
    return 199;
  };

  // Generate simulated billing history logs for provisioned agencies
  const getTransactionLogs = () => {
    return agencies.map((a, index) => {
      const price = getPlanPrice(a.planId);
      const date = a.createdAt ? new Date(a.createdAt) : new Date();
      return {
        id: `TX-${10000 + index}`,
        agencyName: a.name,
        email: a.email,
        phone: a.phone || '',
        planName: a.planName || (a.planId === 'starter' ? 'Starter License' : a.planId === 'growth' ? 'Growth License' : 'Enterprise License'),
        amount: price,
        status: a.isPaid ? 'Paid' : 'Pending Verification',
        method: a.isPaid ? 'Stripe Checkout' : 'Offline Bank Transfer',
        date: date.toLocaleDateString()
      };
    });
  };

  const transactions = getTransactionLogs();

  // Compute stats
  const totalPaidRevenue = transactions.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const totalPendingRevenue = transactions.filter(t => t.status !== 'Paid').reduce((sum, t) => sum + t.amount, 0);
  const totalTransactionsCount = transactions.length;

  // Chart data: split by plan type
  const getPlanStatsData = () => {
    const plansCount = { starter: 0, growth: 0, enterprise: 0 };
    agencies.forEach(a => {
      if (plansCount[a.planId] !== undefined) {
        plansCount[a.planId]++;
      } else {
        plansCount.growth++;
      }
    });

    return [
      { name: 'Starter License', value: plansCount.starter * 99 },
      { name: 'Growth License', value: plansCount.growth * 249 },
      { name: 'Enterprise License', value: plansCount.enterprise * 499 }
    ].filter(item => item.value > 0);
  };

  const chartData = getPlanStatsData();

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="SaaS Revenue & Invoice Hub"
        subtitle="Track subscription payouts, monthly recurring billing logs, and SaaS payment transactions."
      />

      <Box className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <StatCard
          title="Total SaaS Revenue Collected"
          value={`€${totalPaidRevenue.toLocaleString()}`}
          icon={<AccountBalanceWalletIcon sx={{ color: '#10B981' }} />}
          color="#10B981"
        />
        <StatCard
          title="Outstanding / Pending Invoices"
          value={`€${totalPendingRevenue.toLocaleString()}`}
          icon={<PaymentsIcon sx={{ color: '#F59E0B' }} />}
          color="#F59E0B"
        />
        <StatCard
          title="Processed SaaS Payments"
          value={totalTransactionsCount}
          icon={<CheckCircleIcon sx={{ color: '#00205B' }} />}
          color="#00205B"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
        {/* Plan Revenue Distribution Graph */}
        <Box className="col-span-12 md:col-span-6">
          <ChartCard title="Revenue Share by SaaS License" subheader="Distribution of subscription income across plan tiers">
            {chartData.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 6 }}>
                No active subscription revenue to display.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name} (€${value})`}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(val) => [`€${val}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </Box>

        {/* Plan Distribution Volume */}
        <Box className="col-span-12 md:col-span-6">
          <ChartCard title="Plan Distribution Volume" subheader="Compare active licenses by plan tier">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Starter', count: agencies.filter(a => a.planId === 'starter').length },
                  { name: 'Growth', count: agencies.filter(a => a.planId === 'growth').length },
                  { name: 'Enterprise', count: agencies.filter(a => a.planId === 'enterprise').length }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <ChartTooltip />
                <Bar dataKey="count" name="Active Workspace Licenses" fill="#00205B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>
      </Box>

      {/* Invoice Ledger Table */}
      <Paper sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.neutral' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
            SaaS Subscription Invoices Ledger
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Invoice ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Agency Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>SaaS Plan Tier</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Amount (€)</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Billing Gateway</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Transaction Date</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#00205B' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      color: 'secondary.main',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => {
                      setSelectedInvoice({
                        id: tx.id,
                        agencyName: tx.agencyName,
                        email: tx.email,
                        phone: tx.phone,
                        planName: tx.planName,
                        amount: tx.amount,
                        gateway: tx.method,
                        date: tx.date,
                        status: tx.status === 'Paid' ? 'Paid' : 'Unpaid'
                      });
                      setInvoiceModalOpen(true);
                    }}
                  >
                    {tx.id}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{tx.agencyName}</Typography>
                      <Typography variant="caption" color="text.secondary">{tx.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={tx.planName} size="small" color="secondary" sx={{ fontWeight: 700 }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>€{tx.amount}</TableCell>
                  <TableCell>{tx.method}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={tx.status}
                      size="small"
                      color={tx.status === 'Paid' ? 'success' : 'warning'}
                      sx={{ fontWeight: 800 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No SaaS license invoices generated.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SaaSInvoiceReceiptDialog
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        invoice={selectedInvoice}
      />
    </Box>
  );
};

export default SuperAdminPaymentDashboard;
