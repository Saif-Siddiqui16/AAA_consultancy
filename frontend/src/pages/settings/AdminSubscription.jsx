import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShieldIcon from '@mui/icons-material/Shield';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { useQueryClient } from '@tanstack/react-query';

// Services & Contexts
import PageHeader from '../../components/PageHeader';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';

const ROLE_DEFAULTS = {
  admin: {
    menus: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Finance', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance', 'Integrations'],
    cards: []
  },
  operations: {
    menus: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance'],
    cards: []
  },
  finance: {
    menus: ['Dashboard', 'Finance'],
    cards: []
  },
  consultant: {
    menus: ['Dashboard', 'Clients', 'Leads', 'Social Inbox', 'Calendar'],
    cards: []
  },
  marketing: {
    menus: ['Dashboard', 'Leads', 'Marketing'],
    cards: []
  }
};

export const AdminSubscription = () => {
  const { showAlert } = useAlert();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [agency, setAgency] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [timeRemainingText, setTimeRemainingText] = useState('');
  const [daysLeft, setDaysLeft] = useState(0);

  // Upgrade Modal State
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [targetPlan, setTargetPlan] = useState(null);
  const [payPassword, setPayPassword] = useState('');

  const loadSubscriptionInfo = () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const savedAgencies = localStorage.getItem('provisioned_agencies');
      const agencies = savedAgencies ? JSON.parse(savedAgencies) : [];
      const email = currentUser.email || '';
      const domain = email.split('@')[1]?.toLowerCase();
      
      const myAgency = agencies.find(a => a.email.toLowerCase().includes(domain));
      if (!myAgency) {
        setLoading(false);
        return;
      }
      setAgency(myAgency);

      const savedPlans = localStorage.getItem('saas_plans');
      const plans = savedPlans ? JSON.parse(savedPlans) : [];
      setAllPlans(plans);

      const planId = myAgency.planId || 'growth';
      const currentPlan = plans.find(p => p.id === planId) || plans.find(p => p.id === 'growth');
      setActivePlan(currentPlan);

      // Expiry Date calculations
      const joinedDate = myAgency.createdAt ? new Date(myAgency.createdAt) : new Date();
      const validUntil = myAgency.validUntil ? new Date(myAgency.validUntil) : new Date(joinedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const diffTime = validUntil.getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setDaysLeft(diffDays);

      if (!myAgency.isPaid) {
        setTimeRemainingText('Suspended (Unpaid)');
      } else if (diffDays <= 0) {
        setTimeRemainingText('Expired');
      } else {
        setTimeRemainingText(`${diffDays} Days Left`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptionInfo();
  }, [currentUser]);

  if (loading || !agency || !activePlan) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const handleOpenUpgrade = (plan) => {
    setTargetPlan(plan);
    setPayPassword('');
    setOpenUpgradeModal(true);
  };

  const handleUpgradeSubmit = (e) => {
    e.preventDefault();
    if (!payPassword) {
      showAlert('Please enter your account password to verify payment authorization.', 'warning');
      return;
    }

    try {
      const savedAgencies = localStorage.getItem('provisioned_agencies');
      const agencies = savedAgencies ? JSON.parse(savedAgencies) : [];
      const email = currentUser.email || '';
      const domain = email.split('@')[1]?.toLowerCase();

      const updatedAgencies = agencies.map(a => {
        if (a.email.toLowerCase().includes(domain)) {
          return {
            ...a,
            planId: targetPlan.id,
            planName: targetPlan.name,
            isPaid: true,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // reset 30 days
          };
        }
        return a;
      });

      localStorage.setItem('provisioned_agencies', JSON.stringify(updatedAgencies));

      // Reset customization settings to the default template of the new plan
      const savedSettings = localStorage.getItem('local_customization_settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const roles = ['admin', 'consultant', 'operations', 'finance', 'marketing'];
        roles.forEach(r => {
          if (settings[r]) {
            settings[r].menus = targetPlan.rolePermissions?.[r] || ROLE_DEFAULTS[r].menus;
          }
        });
        localStorage.setItem('local_customization_settings', JSON.stringify(settings));
      }

      // Refresh sidebar queries
      queryClient.invalidateQueries({ queryKey: ['customization-settings'] });
      
      showAlert(`Plan upgraded to ${targetPlan.name} successfully! Checkboxes customization has been reset to new plan defaults.`, 'success');
      setOpenUpgradeModal(false);
      loadSubscriptionInfo();
    } catch (e) {
      console.error(e);
      showAlert('Failed to process upgrade.', 'error');
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Subscription & Billing"
        subtitle="View your current license active plan, billing details, and manage plan upgrades."
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left Side: Current Plan Overview */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#00205B', mb: 3 }}>
              Current Subscription Status
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#00205B' }}>
                  {activePlan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Billing Tier: {activePlan.id.toUpperCase()} License
                </Typography>
              </Box>
              <Chip
                label={timeRemainingText}
                color={!agency.isPaid || daysLeft <= 0 ? 'error' : daysLeft <= 5 ? 'warning' : 'success'}
                sx={{ fontWeight: 800, px: 1, py: 1.8, fontSize: '0.82rem' }}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCardIcon sx={{ color: 'secondary.main', fontSize: '1.2rem' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                      Price Details
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {activePlan.price}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthIcon sx={{ color: 'secondary.main', fontSize: '1.2rem' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600 }}>
                      Expiry Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {agency.validUntil ? new Date(agency.validUntil).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {daysLeft <= 5 && agency.isPaid && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(239, 68, 68, 0.08)', borderRadius: 2.5, border: '1px solid', borderColor: 'error.light' }}>
                <Typography variant="caption" color="error.main" sx={{ fontWeight: 700 }}>
                  ⚠️ Your subscription is expiring in {daysLeft} days! Please select a plan from below to renew or upgrade your license and avoid service interruption.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Side: Features List of Active Plan */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%', bgcolor: 'background.neutral' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#00205B', mb: 2 }}>
              Unlocked Features
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 2 }}>
              These components are unlocked and customizable for your team:
            </Typography>

            <List disablePadding>
              {activePlan.rolePermissions?.admin?.map((menu) => (
                <ListItem key={menu} disableGutters sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckIcon color="success" sx={{ fontSize: '1.1rem' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>{menu}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Plans Upgrade Comparison Section */}
      <Typography variant="h6" sx={{ fontWeight: 800, color: '#00205B', mb: 3 }}>
        Available Subscriptions & Upgrade Tiers
      </Typography>

      <Grid container spacing={3}>
        {allPlans.map((plan) => {
          const isCurrent = plan.id === activePlan.id;

          return (
            <Grid item xs={12} md={4} key={plan.id}>
              <Card sx={{
                borderRadius: 3,
                border: '2px solid',
                borderColor: isCurrent ? 'secondary.main' : 'divider',
                boxShadow: isCurrent ? '0px 8px 24px -4px rgba(10, 37, 64, 0.12)' : 'none',
                position: 'relative'
              }}>
                {isCurrent && (
                  <Chip
                    label="Active Plan"
                    color="secondary"
                    size="small"
                    sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 800 }}
                  />
                )}
                <CardContent sx={{ p: 3.5 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {plan.id}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#00205B', mt: 0.5, mb: 1.5 }}>
                    {plan.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#00205B' }}>
                      {plan.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5, fontWeight: 600 }}>
                      /month
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40, fontSize: '0.82rem' }}>
                    {plan.description || `Unlock core features for the ${plan.name} team tier.`}
                  </Typography>

                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ minHeight: 180, mb: 3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 1.5, color: '#00205B' }}>
                      INCLUDED MENUS:
                    </Typography>
                    <List disablePadding>
                      {plan.rolePermissions?.admin?.slice(0, 5).map((menu) => (
                        <ListItem key={menu} disableGutters sx={{ py: 0.3 }}>
                          <CheckIcon color="success" sx={{ fontSize: '0.9rem', mr: 1 }} />
                          <ListItemText
                            primary={<Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{menu}</Typography>}
                          />
                        </ListItem>
                      ))}
                      {plan.rolePermissions?.admin?.length > 5 && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mt: 1, display: 'block' }}>
                          + {plan.rolePermissions.admin.length - 5} more menus
                        </Typography>
                      )}
                    </List>
                  </Box>

                  <Button
                    variant={isCurrent ? 'outlined' : 'contained'}
                    color="secondary"
                    fullWidth
                    disabled={isCurrent}
                    onClick={() => handleOpenUpgrade(plan)}
                    sx={{ fontWeight: 800, py: 1.2, borderRadius: 2 }}
                  >
                    {isCurrent ? 'Current Plan' : 'Upgrade to Plan'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Upgrade Confirmation Modal */}
      <Dialog open={openUpgradeModal} onClose={() => setOpenUpgradeModal(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <form onSubmit={handleUpgradeSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>💳 Confirm Plan Upgrade</DialogTitle>
          <Divider />
          <DialogContent>
            {targetPlan && (
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  You are upgrading your subscription to the **{targetPlan.name}** ({targetPlan.price}/month). 
                  Your renewal cycle will restart from today for another 30 days.
                </Typography>
                
                {/* Mock payment details */}
                <Paper sx={{ p: 2, bgcolor: '#E8F8F5', borderRadius: 2.5, mb: 3 }}>
                  <Typography variant="caption" sx={{ color: '#117A65', fontWeight: 800, display: 'block', mb: 0.5 }}>
                    MOCK CHECKOUT SECURE PAYMENT
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#117A65', fontWeight: 700 }}>
                    Selected Method: Default Connected Payment Card (UPI/Visa)
                  </Typography>
                </Paper>

                <TextField
                  type="password"
                  label="Verify Admin Password"
                  fullWidth
                  variant="outlined"
                  required
                  value={payPassword}
                  onChange={(e) => setPayPassword(e.target.value)}
                  placeholder="Enter account password to authorize"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            )}
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenUpgradeModal(false)} color="inherit" sx={{ fontWeight: 700 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="secondary" sx={{ fontWeight: 800 }}>
              Authorize Payment & Upgrade
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminSubscription;
