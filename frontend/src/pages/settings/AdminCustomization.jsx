import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Services & Contexts
import PageHeader from '../../components/PageHeader';
import { dbService } from '../../services/dbService';
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

export const AdminCustomization = () => {
  const { showAlert } = useAlert();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [selectedRole, setSelectedRole] = useState('consultant');
  const [customizationState, setCustomizationState] = useState(null);

  // 1. Resolve current agency and plan details
  const [agencyPlan, setAgencyPlan] = useState(null);
  const [allowedPlanMenus, setAllowedPlanMenus] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    try {
      const savedAgencies = localStorage.getItem('provisioned_agencies');
      const agencies = savedAgencies ? JSON.parse(savedAgencies) : [];
      const email = currentUser.email || '';
      const domain = email.split('@')[1]?.toLowerCase();
      
      const myAgency = agencies.find(a => a.email.toLowerCase().includes(domain));
      const planId = myAgency?.planId || 'growth'; // default to growth

      const savedPlans = localStorage.getItem('saas_plans');
      const plans = savedPlans ? JSON.parse(savedPlans) : [];
      const activePlan = plans.find(p => p.id === planId);

      if (activePlan) {
        setAgencyPlan(activePlan);
        // The master template of menus allowed under this plan is the admin's rolePermissions list
        const adminAllowed = activePlan.rolePermissions?.admin || [];
        setAllowedPlanMenus(adminAllowed);
      } else {
        // Fallback defaults if no plans stored
        setAllowedPlanMenus(ROLE_DEFAULTS.admin.menus);
      }
    } catch (e) {
      console.error("Failed to load agency plan configurations:", e);
      setAllowedPlanMenus(ROLE_DEFAULTS.admin.menus);
    }
  }, [currentUser]);

  // 2. Fetch customizations
  const { data: customizationSettings, isLoading } = useQuery({
    queryKey: ['customization-settings'],
    queryFn: dbService.getCustomizationSettings
  });

  // 3. Sync local state once customization query finishes loading
  useEffect(() => {
    if (customizationSettings) {
      setCustomizationState(customizationSettings);
    }
  }, [customizationSettings]);

  if (isLoading || !customizationState || !agencyPlan) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const handleSave = async () => {
    try {
      await dbService.saveCustomizationSettings(customizationState);
      // Invalidate React Query cache so layout sidebar reloads instantly
      queryClient.invalidateQueries({ queryKey: ['customization-settings'] });
      showAlert('Workspace role permissions updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showAlert('Error saving role permissions.', 'error');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset role permissions to standard plan default configurations?')) {
      // Create permissions based on the active plan defaults
      const resetSettings = { ...customizationState };
      const rolesToReset = ['admin', 'consultant', 'operations', 'finance', 'marketing'];
      
      rolesToReset.forEach(r => {
        const planDefault = agencyPlan.rolePermissions?.[r] || ROLE_DEFAULTS[r].menus;
        resetSettings[r] = {
          ...resetSettings[r],
          menus: planDefault
        };
      });

      setCustomizationState(resetSettings);
      showAlert('Restored plan defaults to menu checklist.', 'info');
    }
  };

  const rolesList = [
    { id: 'consultant', label: 'Consultant / Agent' },
    { id: 'operations', label: 'Operations Manager' },
    { id: 'finance', label: 'Finance Staff' },
    { id: 'marketing', label: 'Marketing Executive' }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Workspace Role Customization"
        subtitle="Manage and customize CRM dashboard menu visibility settings for your agency staff members."
      />

      {/* Subscription info badge banner */}
      <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.neutral' }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#00205B' }}>
            Active Subscription Tier: {agencyPlan.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Your menu customizer checklist displays only features unlocked under this subscription plan.
          </Typography>
        </Box>
        <Chip
          label="Plan Enforced"
          color="success"
          size="small"
          icon={<CheckCircleIcon sx={{ fontSize: '0.9rem !important' }} />}
          sx={{ fontWeight: 800, px: 0.5 }}
        />
      </Paper>

      <Box className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Side: Roles Selectors */}
        <Paper className="md:col-span-4" sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#00205B', mb: 2, textTransform: 'uppercase', fontSize: '0.72rem', tracking: '0.05em' }}>
            Select Team Role
          </Typography>
          <List disablePadding>
            {rolesList.map((item) => (
              <ListItemButton
                key={item.id}
                selected={selectedRole === item.id}
                onClick={() => setSelectedRole(item.id)}
                sx={{
                  borderRadius: 2,
                  mb: 0.8,
                  py: 1.2,
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: 'secondary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'secondary.main' }
                  }
                }}
              >
                <ListItemText
                  primary={<Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>{item.label}</Typography>}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* Right Side: Menu checklists */}
        <Paper className="md:col-span-8" sx={{ p: 3.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', mb: 2.5, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#00205B' }}>
                Allowed Sidebar Menus
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Configure visible sidebar sections for the "{rolesList.find(r => r.id === selectedRole)?.label}" role.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ maxHeight: '360px', overflowY: 'auto' }}>
            {allowedPlanMenus.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center', fontStyle: 'italic' }}>
                No menus available under this plan tier.
              </Typography>
            ) : (
              <Box className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allowedPlanMenus.map((menu) => {
                  const currentRoleConfig = customizationState[selectedRole] || { menus: [] };
                  const isChecked = currentRoleConfig.menus.includes(menu);

                  return (
                    <Paper
                      key={menu}
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        border: '1px solid',
                        borderColor: isChecked ? 'secondary.main' : 'divider',
                        bgcolor: isChecked ? 'rgba(10, 37, 64, 0.015)' : 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        const currentRoleMenus = currentRoleConfig.menus || [];
                        const updatedRoleMenus = currentRoleMenus.includes(menu)
                          ? currentRoleMenus.filter(m => m !== menu)
                          : [...currentRoleMenus, menu];

                        setCustomizationState(prev => ({
                          ...prev,
                          [selectedRole]: {
                            ...prev[selectedRole],
                            menus: updatedRoleMenus
                          }
                        }));
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SettingsSuggestIcon sx={{ color: isChecked ? 'secondary.main' : 'text.disabled', fontSize: '1.1rem' }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
                          {menu}
                        </Typography>
                      </Box>
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        color="secondary"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const currentRoleMenus = currentRoleConfig.menus || [];
                          const updatedRoleMenus = e.target.checked
                            ? [...currentRoleMenus, menu]
                            : currentRoleMenus.filter(m => m !== menu);

                          setCustomizationState(prev => ({
                            ...prev,
                            [selectedRole]: {
                              ...prev[selectedRole],
                              menus: updatedRoleMenus
                            }
                          }));
                        }}
                      />
                    </Paper>
                  );
                })}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              sx={{ fontWeight: 700 }}
            >
              Reset to Plan Defaults
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSave}
              sx={{ fontWeight: 700 }}
            >
              Save Customizations
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminCustomization;
