import React, { useState } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// Services & Components
import PageHeader from '../../components/PageHeader';
import { useAlert } from '../../contexts/AlertContext';

const DEFAULT_LEAD_STAGES = [
  { id: 'stage_new_lead', name: 'New Lead', type: 'lead', color: '#2196F3', emoji: '🆕' },
  { id: 'stage_hot_lead', name: 'Hot Lead', type: 'lead', color: '#FF9800', emoji: '🔥' },
  { id: 'stage_processing', name: 'Processing', type: 'lead', color: '#3F51B5', emoji: '⚙️' },
  { id: 'stage_under_consultation', name: 'Under Consultation', type: 'lead', color: '#9C27B0', emoji: '📅' },
  { id: 'stage_waiting_payment', name: 'Waiting for Payment', type: 'client', color: '#FF5722', emoji: '💳' },
  { id: 'stage_documents_pending', name: 'Documents Pending', type: 'client', color: '#E91E63', emoji: '📎' },
  { id: 'stage_under_process', name: 'Under Process', type: 'client', color: '#03A9F4', emoji: '📂' },
  { id: 'stage_completed', name: 'Completed', type: 'client', color: '#4CAF50', emoji: '✅' },
  { id: 'stage_closed', name: 'Closed', type: 'client', color: '#9E9E9E', emoji: '🔒' },
  { id: 'stage_cold_lead', name: 'Cold Lead', type: 'lead', color: '#009688', emoji: '❄️' },
  { id: 'stage_lost_lead', name: 'Lost Lead', type: 'lead', color: '#F44336', emoji: '❌' },
];

const ALL_SIDEBAR_MENUS = [
  'Dashboard',
  'Agents',
  'Active Cases',
  'Doc Verification',
  'Finance',
  'Closed Cases',
  'Clients',
  'Leads',
  'Social Inbox',
  'Marketing',
  'Calendar',
  'All Agents Performance',
  'Integrations'
];

const DEFAULT_PLANS = [
  {
    id: 'starter',
    name: 'Starter License',
    price: 99,
    billingPeriod: '/ month',
    description: 'For independent relocation agents.',
    features: [
      '3 Active Agents',
      '50 Active Cases / Leads',
      'Standard client intake portal',
      '❌ Cloud AWS back-ups',
      '❌ Verification dashboard'
    ],
    isRecommended: false,
    rolePermissions: {
      admin: ['Dashboard', 'Agents', 'Clients', 'Leads'],
      consultant: ['Dashboard', 'Clients', 'Leads'],
      operations: ['Dashboard', 'Clients', 'Leads'],
      finance: ['Dashboard'],
      marketing: ['Dashboard', 'Leads']
    },
    stages: ['stage_new_lead', 'stage_processing', 'stage_completed', 'stage_closed'],
    maxAgents: 3,
    maxCases: 50
  },
  {
    id: 'growth',
    name: 'Growth License',
    price: 249,
    billingPeriod: '/ month',
    description: 'For growing immigration teams.',
    features: [
      '10 Active Agents',
      '200 Active Cases / Leads',
      'Intake Forms & Document verification',
      'AWS Secure Backups dashboard',
      'Team permissions manager'
    ],
    isRecommended: true,
    rolePermissions: {
      admin: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Finance', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance', 'Integrations'],
      consultant: ['Dashboard', 'Clients', 'Leads', 'Social Inbox', 'Calendar'],
      operations: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance'],
      finance: ['Dashboard', 'Finance'],
      marketing: ['Dashboard', 'Leads', 'Marketing']
    },
    stages: ['stage_new_lead', 'stage_hot_lead', 'stage_processing', 'stage_under_consultation', 'stage_waiting_payment', 'stage_documents_pending', 'stage_under_process', 'stage_completed', 'stage_closed', 'stage_cold_lead', 'stage_lost_lead'],
    maxAgents: 10,
    maxCases: 200
  },
  {
    id: 'enterprise',
    name: 'Enterprise License',
    price: 499,
    billingPeriod: '/ month',
    description: 'For agency franchises.',
    features: [
      'Unlimited Agents',
      'Unlimited Cases',
      'Custom branding & subdomain',
      'Custom API Integrations',
      'Priority SLA Support'
    ],
    isRecommended: false,
    rolePermissions: {
      admin: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Finance', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance', 'Integrations'],
      consultant: ['Dashboard', 'Clients', 'Leads', 'Social Inbox', 'Calendar'],
      operations: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance'],
      finance: ['Dashboard', 'Finance'],
      marketing: ['Dashboard', 'Leads', 'Marketing']
    },
    stages: ['stage_new_lead', 'stage_hot_lead', 'stage_processing', 'stage_under_consultation', 'stage_waiting_payment', 'stage_documents_pending', 'stage_under_process', 'stage_completed', 'stage_closed', 'stage_cold_lead', 'stage_lost_lead'],
    maxAgents: -1,
    maxCases: -1
  }
];

export const SuperAdminCustomization = () => {
  const { showAlert } = useAlert();

  // Load plans with localized persistence fallback
  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem('saas_plans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('saas_plans', JSON.stringify(DEFAULT_PLANS));
    return DEFAULT_PLANS;
  });

  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null); // null means adding new
  
  // Dialog configuration state
  const [dialogTab, setDialogTab] = useState(0);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState('admin');

  // Contact details form state loaded from localStorage
  const [contactForm, setContactForm] = useState(() => {
    try {
      const saved = localStorage.getItem('landing_contact_details');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      phone: '+971 50 955 4142',
      email: 'info@aaaconsultancy.com',
      address: 'Business Village, Block B, 4th Floor, Office F09 Port Saeed, Deira, Dubai, UAE',
      facebook: '#',
      instagram: '#',
      twitter: '#',
      linkedin: '#'
    };
  });

  const handleSaveContactForm = () => {
    localStorage.setItem('landing_contact_details', JSON.stringify(contactForm));
    showAlert('Landing page contact details saved successfully! Refresh the page to see changes.', 'success');
  };

  const handleResetContactForm = () => {
    if (window.confirm('Reset contact details to default values?')) {
      const defaults = {
        phone: '+971 50 955 4142',
        email: 'info@aaaconsultancy.com',
        address: 'Business Village, Block B, 4th Floor, Office F09 Port Saeed, Deira, Dubai, UAE',
        facebook: '#',
        instagram: '#',
        twitter: '#',
        linkedin: '#'
      };
      setContactForm(defaults);
      localStorage.setItem('landing_contact_details', JSON.stringify(defaults));
      showAlert('Restored default contact details!', 'success');
    }
  };

  // Form Fields State
  const [planForm, setPlanForm] = useState({
    name: '',
    price: '',
    billingPeriod: '/ month',
    description: '',
    features: [],
    isRecommended: false,
    rolePermissions: {
      admin: [],
      consultant: [],
      operations: [],
      finance: [],
      marketing: []
    },
    stages: [],
    maxAgents: 3,
    maxCases: 50
  });

  const [newFeature, setNewFeature] = useState('');

  const handleSavePlans = (updatedPlans) => {
    setPlans(updatedPlans);
    localStorage.setItem('saas_plans', JSON.stringify(updatedPlans));
    showAlert('SaaS pricing and customization configurations updated in real-time!', 'success');
  };

  const handleOpenAddPlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      price: '',
      billingPeriod: '/ month',
      description: '',
      features: [],
      isRecommended: false,
      rolePermissions: {
        admin: ['Dashboard', 'Agents', 'Clients'],
        consultant: ['Dashboard', 'Clients'],
        operations: ['Dashboard', 'Clients'],
        finance: ['Dashboard'],
        marketing: ['Dashboard']
      },
      stages: ['stage_new_lead', 'stage_processing', 'stage_completed', 'stage_closed'],
      maxAgents: 3,
      maxCases: 50
    });
    setNewFeature('');
    setDialogTab(0);
    setPlanDialogOpen(true);
  };

  const handleOpenEditPlan = (plan) => {
    setEditingPlan(plan.id);
    setPlanForm({
      ...plan,
      rolePermissions: plan.rolePermissions || {
        admin: [],
        consultant: [],
        operations: [],
        finance: [],
        marketing: []
      },
      stages: plan.stages || []
    });
    setNewFeature('');
    setDialogTab(0);
    setPlanDialogOpen(true);
  };

  const handleSavePlanForm = () => {
    if (!planForm.name || planForm.price === '') {
      showAlert('Please enter plan name and price', 'error');
      return;
    }
    let updated;
    if (editingPlan) {
      updated = plans.map(p => p.id === editingPlan ? { ...planForm, price: parseFloat(planForm.price) || 0 } : p);
    } else {
      const newPlan = {
        ...planForm,
        id: 'plan_' + Math.random().toString(36).substring(2, 9),
        price: parseFloat(planForm.price) || 0
      };
      updated = [...plans, newPlan];
    }
    handleSavePlans(updated);
    setPlanDialogOpen(false);
  };

  const handleDeletePlan = (id) => {
    if (window.confirm('Are you sure you want to delete this pricing plan? This might affect existing subscriptions.')) {
      const updated = plans.filter(p => p.id !== id);
      handleSavePlans(updated);
    }
  };

  const handleResetPlans = () => {
    if (window.confirm('Are you sure you want to reset all plans and default permissions to original factory defaults?')) {
      localStorage.setItem('saas_plans', JSON.stringify(DEFAULT_PLANS));
      setPlans(DEFAULT_PLANS);
      showAlert('Restored default pricing plans and permissions!', 'success');
    }
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setPlanForm(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeature.trim()]
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (idx) => {
    setPlanForm(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== idx)
    }));
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="SaaS CRM Customization Hub"
        subtitle="Manage subscription plan tiers, configure plan-specific role menu options, and customize target visa pipeline stages."
        action={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleResetPlans}
              sx={{ fontWeight: 700 }}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddPlan}
              sx={{ fontWeight: 700 }}
            >
              Add New Plan
            </Button>
          </Box>
        }
      />

      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {plans.map((plan) => (
          <Paper
            key={plan.id}
            sx={{
              p: 3.5,
              borderRadius: 3,
              border: plan.isRecommended ? '2.5px solid #D4AF37' : '1px solid',
              borderColor: plan.isRecommended ? '#D4AF37' : 'divider',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '380px',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }
            }}
          >
            {plan.isRecommended && (
              <Chip
                label="RECOMMENDED"
                size="small"
                color="warning"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 16,
                  transform: 'translateY(-50%)',
                  fontWeight: 800,
                  fontSize: '0.65rem'
                }}
              />
            )}

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#00205B', mb: 0.5 }}>
                {plan.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ minHeight: '36px', fontSize: '0.78rem', mb: 2 }}>
                {plan.description || 'No description provided.'}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#00205B' }}>
                  €{plan.price}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontWeight: 600 }}>
                  {plan.billingPeriod}
                </Typography>
              </Box>

              {/* Scope Limits Summary */}
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Chip
                  label={`${Object.keys(plan.rolePermissions || {}).length} Roles Set`}
                  size="small"
                  sx={{ fontSize: '0.65rem', fontWeight: 700, bgcolor: 'background.neutral' }}
                />
                <Chip
                  label={`${(plan.stages || []).length} Pipeline Stages`}
                  size="small"
                  sx={{ fontSize: '0.65rem', fontWeight: 700, bgcolor: 'background.neutral' }}
                />
              </Box>

              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1, textTransform: 'uppercase' }}>
                Featured Benefits:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, fontSize: '0.8rem', color: 'text.secondary', listStyleType: 'disc' }}>
                {(plan.features || []).map((feature, fIdx) => (
                  <li key={fIdx} style={{ marginBottom: '2px' }}>{feature}</li>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<EditIcon sx={{ fontSize: '0.8rem' }} />}
                onClick={() => handleOpenEditPlan(plan)}
                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
              >
                Configure Settings
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '0.8rem' }} />}
                onClick={() => handleDeletePlan(plan.id)}
                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ─── Landing Page Contact Desk Customizer ─── */}
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mt: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#00205B', mb: 0.5 }}>
          📞 Landing Page Contact Desk Customizer
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '0.78rem' }}>
          Modify the primary email, calling number, office location address, and social links dynamically displayed on the public landing page.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Calling & WhatsApp"
              size="small"
              fullWidth
              value={contactForm.phone}
              onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="e.g. +971 50 955 4142"
            />
            <TextField
              label="Email Address"
              size="small"
              fullWidth
              value={contactForm.email}
              onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="e.g. info@aaaconsultancy.com"
            />
          </Box>

          <TextField
            label="Office Address"
            size="small"
            fullWidth
            multiline
            rows={2}
            value={contactForm.address}
            onChange={(e) => setContactForm(prev => ({ ...prev, address: e.target.value }))}
            placeholder="e.g. Business Village, Block B, Dubai, UAE"
          />

          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mt: 1, textTransform: 'uppercase' }}>
            Social Media Channels
          </Typography>

          <Box className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <TextField
              label="Facebook URL"
              size="small"
              fullWidth
              value={contactForm.facebook}
              onChange={(e) => setContactForm(prev => ({ ...prev, facebook: e.target.value }))}
              placeholder="https://facebook.com/..."
            />
            <TextField
              label="Instagram URL"
              size="small"
              fullWidth
              value={contactForm.instagram}
              onChange={(e) => setContactForm(prev => ({ ...prev, instagram: e.target.value }))}
              placeholder="https://instagram.com/..."
            />
            <TextField
              label="Twitter / X URL"
              size="small"
              fullWidth
              value={contactForm.twitter}
              onChange={(e) => setContactForm(prev => ({ ...prev, twitter: e.target.value }))}
              placeholder="https://twitter.com/..."
            />
            <TextField
              label="LinkedIn URL"
              size="small"
              fullWidth
              value={contactForm.linkedin}
              onChange={(e) => setContactForm(prev => ({ ...prev, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/..."
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1.5 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleResetContactForm}
              sx={{ fontWeight: 700 }}
            >
              Reset Contact Details
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveContactForm}
              sx={{ fontWeight: 700 }}
            >
              Save Contact Details
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* ─── Add / Edit SaaS Plan Dialog ─── */}
      <Dialog open={planDialogOpen} onClose={() => setPlanDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingPlan ? '⚙️ Configure Plan Customizations' : '➕ Add SaaS License Plan'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2, maxHeight: '62vh', overflowY: 'auto' }}>
          {/* Dialog Switcher Tabs */}
          <Tabs
            value={dialogTab}
            onChange={(e, val) => setDialogTab(val)}
            textColor="secondary"
            indicatorColor="secondary"
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 1.5 }}
          >
            <Tab label="📝 Basic Details" sx={{ fontWeight: 700 }} />
            <Tab label="🔐 Role Permissions" sx={{ fontWeight: 700 }} />
            <Tab label="⚡ Pipeline Stages" sx={{ fontWeight: 700 }} />
          </Tabs>

          {/* TAB 0: Basic Details */}
          {dialogTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box className="grid grid-cols-12 gap-3">
                <Box className="col-span-8">
                  <TextField
                    label="Plan Name"
                    size="small"
                    fullWidth
                    value={planForm.name}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Pro License, Starter Plan"
                  />
                </Box>
                <Box className="col-span-4">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={planForm.isRecommended}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, isRecommended: e.target.checked }))}
                        color="warning"
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>Recommended</Typography>}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>

              <Box className="grid grid-cols-12 gap-3">
                <Box className="col-span-6">
                  <TextField
                    label="Price (€)"
                    type="number"
                    size="small"
                    fullWidth
                    value={planForm.price}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 199"
                  />
                </Box>
                <Box className="col-span-6">
                  <TextField
                    label="Billing Period"
                    size="small"
                    fullWidth
                    value={planForm.billingPeriod}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, billingPeriod: e.target.value }))}
                    placeholder="e.g. / month, / year"
                  />
                </Box>
              </Box>

              {/* SaaS Plan Limitations */}
              <Box className="grid grid-cols-12 gap-3">
                <Box className="col-span-6">
                  <TextField
                    label="Maximum Agents Limit"
                    type="number"
                    size="small"
                    fullWidth
                    value={planForm.maxAgents !== undefined ? planForm.maxAgents : ''}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, maxAgents: e.target.value === '' ? '' : parseInt(e.target.value) }))}
                    helperText="Limit of consultants/employees allowed (-1 for Unlimited)"
                    slotProps={{ formHelperText: { style: { fontSize: '0.62rem', fontWeight: 600 } } }}
                  />
                </Box>
                <Box className="col-span-6">
                  <TextField
                    label="Maximum Leads/Cases Limit"
                    type="number"
                    size="small"
                    fullWidth
                    value={planForm.maxCases !== undefined ? planForm.maxCases : ''}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, maxCases: e.target.value === '' ? '' : parseInt(e.target.value) }))}
                    helperText="Limit of leads/cases allowed (-1 for Unlimited)"
                    slotProps={{ formHelperText: { style: { fontSize: '0.62rem', fontWeight: 600 } } }}
                  />
                </Box>
              </Box>

              <TextField
                label="Plan Description"
                size="small"
                fullWidth
                multiline
                rows={2}
                value={planForm.description}
                onChange={(e) => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief tagline or description of the target audience..."
              />

              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#00205B' }}>
                  Bullet Features List
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="Add Plan Feature"
                    size="small"
                    fullWidth
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="e.g. 10 Active Agents, Unlimited Cases"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAddFeature}
                    sx={{ fontWeight: 700, minWidth: 80 }}
                  >
                    Add
                  </Button>
                </Box>

                <Box sx={{ maxHeight: '120px', overflowY: 'auto' }}>
                  <List size="small" sx={{ p: 0, m: 0 }}>
                    {(planForm.features || []).map((feature, index) => (
                      <ListItemButton
                        key={index}
                        sx={{ py: 0.5, px: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifycontent: 'space-between' }}
                      >
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{feature}</Typography>
                        <IconButton size="small" color="error" onClick={() => handleRemoveFeature(index)}>
                          <DeleteIcon sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              </Box>
            </Box>
          )}

          {/* TAB 1: Role Permissions */}
          {dialogTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                Select which sidebar navigation menus are enabled for each role under this plan tier.
              </Typography>
              <Box className="grid grid-cols-12 gap-3" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
                {/* Role List Side */}
                <Box className="col-span-4" sx={{ borderRight: '1px solid', borderColor: 'divider', pr: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1, textTransform: 'uppercase' }}>
                    Select Role:
                  </Typography>
                  <List disablePadding>
                    {['admin', 'consultant', 'operations', 'finance', 'marketing'].map((r) => (
                      <ListItemButton
                        key={r}
                        selected={selectedRoleForPermissions === r}
                        onClick={() => setSelectedRoleForPermissions(r)}
                        sx={{ borderRadius: 1.5, mb: 0.5, py: 0.6, px: 1.5 }}
                      >
                        <ListItemText
                          primary={<Typography sx={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize' }}>{r}</Typography>}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
                {/* Checkbox List Side */}
                <Box className="col-span-8" sx={{ pl: 1.5, maxHeight: '280px', overflowY: 'auto' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#00205B', mb: 1.5, textTransform: 'uppercase', fontSize: '0.72rem' }}>
                    Allowed Menus ({selectedRoleForPermissions})
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {ALL_SIDEBAR_MENUS.map((menu) => {
                      const allowedList = planForm.rolePermissions?.[selectedRoleForPermissions] || [];
                      const isChecked = allowedList.includes(menu);
                      return (
                        <FormControlLabel
                          key={menu}
                          control={
                            <Checkbox
                              size="small"
                              checked={isChecked}
                              color="secondary"
                              onChange={(e) => {
                                const currentList = planForm.rolePermissions?.[selectedRoleForPermissions] || [];
                                const updatedList = e.target.checked
                                  ? [...currentList, menu]
                                  : currentList.filter(m => m !== menu);
                                setPlanForm(prev => ({
                                  ...prev,
                                  rolePermissions: {
                                    ...(prev.rolePermissions || {}),
                                    [selectedRoleForPermissions]: updatedList
                                  }
                                }));
                              }}
                            />
                          }
                          label={<Typography sx={{ fontSize: '0.78rem', fontWeight: 500 }}>{menu}</Typography>}
                        />
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* TAB 2: Pipeline Stages */}
          {dialogTab === 2 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, mb: 1.5, display: 'block' }}>
                Select which pipeline lifecycle stages are available for clients & leads under this plan tier.
              </Typography>
              <Box className="grid grid-cols-2 gap-2" sx={{ maxHeight: '260px', overflowY: 'auto', p: 0.5 }}>
                {DEFAULT_LEAD_STAGES.map((stage) => {
                  const isChecked = (planForm.stages || []).includes(stage.id);
                  return (
                    <Paper
                      key={stage.id}
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: isChecked ? 'secondary.main' : 'divider',
                        bgcolor: isChecked ? 'rgba(10, 37, 64, 0.02)' : 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        const currentStages = planForm.stages || [];
                        const updatedStages = currentStages.includes(stage.id)
                          ? currentStages.filter(id => id !== stage.id)
                          : [...currentStages, stage.id];
                        setPlanForm(prev => ({
                          ...prev,
                          stages: updatedStages
                        }));
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '1rem' }}>{stage.emoji}</Typography>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.78rem', lineHeight: 1.1 }}>{stage.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize', fontSize: '0.62rem' }}>{stage.type}</Typography>
                        </Box>
                      </Box>
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        color="secondary"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const currentStages = planForm.stages || [];
                          const updatedStages = e.target.checked
                            ? [...currentStages, stage.id]
                            : currentStages.filter(id => id !== stage.id);
                          setPlanForm(prev => ({
                            ...prev,
                            stages: updatedStages
                          }));
                        }}
                      />
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setPlanDialogOpen(false)} variant="outlined" color="inherit" sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button onClick={handleSavePlanForm} variant="contained" color="secondary" sx={{ fontWeight: 700 }}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminCustomization;
