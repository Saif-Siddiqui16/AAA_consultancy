import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Setup Axios instance with JWT Interceptor
const apiClient = axios.create({
  baseURL: API_URL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dbService = {
  // LEADS
  getLeads: async () => {
    const res = await apiClient.get('/leads');
    return res.data;
  },
  createLead: async (lead) => {
    const res = await apiClient.post('/leads', lead);
    return res.data;
  },
  updateLeadStatus: async (leadId, status) => {
    const res = await apiClient.post('/leads/status', { leadId, status });
    return res.data;
  },
  assignAgent: async (leadId, agentId) => {
    const res = await apiClient.post('/leads/assign', { leadId, agentId });
    return res.data;
  },

  // CLIENTS & CASES
  getClients: async () => {
    const res = await apiClient.get('/clients');
    return res.data;
  },
  createClient: async (client) => {
    const res = await apiClient.post('/clients', client);
    return res.data;
  },
  updateClientVisaStatus: async (clientId, visaStatus, status) => {
    const res = await apiClient.patch(`/clients/${clientId}/status`, { visaStatus, status });
    return res.data;
  },
  generateClientCredentials: async (clientId) => {
    const res = await apiClient.post(`/clients/${clientId}/credentials`);
    return res.data;
  },
  clientLogin: async (clientId, password) => {
    const res = await apiClient.post('/clients/login', { clientId, password });
    return res.data;
  },
  getActiveCases: async () => {
    const res = await apiClient.get('/cases/active');
    return res.data;
  },
  getClosedCases: async () => {
    const res = await apiClient.get('/cases/closed');
    return res.data;
  },

  // CONSULTATIONS
  getConsultations: async () => {
    const res = await apiClient.get('/consultations');
    return res.data;
  },
  createConsultation: async (cons) => {
    const res = await apiClient.post('/consultations', cons);
    return res.data;
  },
  updateConsultationStatus: async (consultationId, status) => {
    const res = await apiClient.patch(`/consultations/${consultationId}/outcome`, { status });
    return res.data;
  },
  completeConsultation: async (consultationId, outcome, notes) => {
    const res = await apiClient.patch(`/consultations/${consultationId}/outcome`, { 
      status: 'Completed', 
      eligibility: outcome, 
      internalNotes: notes 
    });
    return res.data;
  },
  bookClientConsultation: async (data) => {
    const res = await apiClient.post('/consultations', data);
    return res.data;
  },

  // PAYMENTS
  getPayments: async () => {
    const res = await apiClient.get('/payments');
    return res.data;
  },
  generatePaymentLink: async (payment) => {
    const res = await apiClient.post('/payments/generate-link', payment);
    return res.data;
  },
  updatePaymentStatus: async (paymentId, status, paymentMethod, transactionId) => {
    const res = await apiClient.patch(`/payments/${paymentId}/status`, { status, paymentMethod, transactionId });
    return res.data;
  },

  // DOCUMENTS
  getDocuments: async () => {
    const res = await apiClient.get('/documents');
    return res.data;
  },
  uploadDocument: async (doc) => {
    const formData = new FormData();
    formData.append('file', doc.file);
    formData.append('clientId', doc.clientId);
    formData.append('category', doc.category);

    const res = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  reviewDocument: async (documentId, status, comment) => {
    const res = await apiClient.patch(`/documents/${documentId}/verify`, { status, feedbackComment: comment });
    return res.data;
  },

  // MARKETING
  getMarketingSpend: async () => {
    const res = await apiClient.get('/marketing/spend');
    return res.data;
  },
  updateMarketingSpend: async (spendData) => {
    const res = await apiClient.post('/marketing/spend', spendData);
    return res.data;
  },

  // SETTINGS & CUSTOMIZATION
  getCustomizationSettings: async () => {
    try {
      const res = await apiClient.get('/settings/customization');
      localStorage.setItem('local_customization_settings', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      const saved = localStorage.getItem('local_customization_settings');
      if (saved) return JSON.parse(saved);
      
      const DEFAULT_ROLE_CUSTOMIZATIONS = {
        admin: {
          menus: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Finance', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance', 'Integrations', 'Subscription', 'Workspace Settings'],
          cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Pending Payments', 'Total Revenue', 'Active Cases', 'Completed Cases', 'Lost Consultations', 'Revenue Today', 'Outstanding Revenue', 'Refunded (50% Rejections)']
        },
        operations: {
          menus: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance'],
          cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Active Cases', 'Completed Cases']
        },
        finance: {
          menus: ['Dashboard', 'Finance'],
          cards: ['Total Revenue', 'Pending Payments']
        },
        consultant: {
          menus: ['Dashboard', 'Clients', 'Leads', 'Social Inbox', 'Calendar'],
          cards: ['Upcoming Meetings', 'Active Cases']
        },
        marketing: {
          menus: ['Dashboard', 'Leads', 'Marketing'],
          cards: ['Total Consultations', 'Today\'s Consultations']
        }
      };
      localStorage.setItem('local_customization_settings', JSON.stringify(DEFAULT_ROLE_CUSTOMIZATIONS));
      return DEFAULT_ROLE_CUSTOMIZATIONS;
    }
  },
  saveCustomizationSettings: async (settings) => {
    try {
      const res = await apiClient.put('/settings/customization', { settings });
      localStorage.setItem('local_customization_settings', JSON.stringify(settings));
      return res.data;
    } catch (err) {
      localStorage.setItem('local_customization_settings', JSON.stringify(settings));
      return settings;
    }
  },
  getLeadStages: async () => {
    try {
      const userStr = localStorage.getItem('crm-auth-user');
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

      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role !== 'super_admin') {
          const email = user.email || '';
          const domain = email.split('@')[1]?.toLowerCase();
          if (domain) {
            const agenciesStr = localStorage.getItem('provisioned_agencies');
            if (agenciesStr) {
              const agencies = JSON.parse(agenciesStr);
              const foundAgency = agencies.find(a => a.email.toLowerCase().includes(domain));
              if (foundAgency) {
                const planId = foundAgency.planId || 'growth';
                const plansStr = localStorage.getItem('saas_plans');
                if (plansStr) {
                  const plans = JSON.parse(plansStr);
                  const foundPlan = plans.find(p => p.id === planId);
                  if (foundPlan && foundPlan.stages) {
                    return DEFAULT_LEAD_STAGES.filter(s => foundPlan.stages.includes(s.id));
                  }
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to filter lead stages off plan config:", e);
    }

    try {
      const res = await apiClient.get('/settings/lead-stages');
      return res.data;
    } catch (err) {
      const savedLocal = localStorage.getItem('local_customization_stages');
      if (savedLocal) return JSON.parse(savedLocal);
      return [
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
    }
  },

  checkPlanLimit: (type) => {
    try {
      const userStr = localStorage.getItem('crm-auth-user');
      if (!userStr) return { ok: true };
      const user = JSON.parse(userStr);
      if (user.role === 'super_admin') return { ok: true };

      const email = user.email || '';
      const domain = email.split('@')[1]?.toLowerCase();
      if (!domain) return { ok: true };

      const agenciesStr = localStorage.getItem('provisioned_agencies');
      if (!agenciesStr) return { ok: true };
      const agencies = JSON.parse(agenciesStr);
      const foundAgency = agencies.find(a => a.email.toLowerCase().includes(domain));
      if (!foundAgency) return { ok: true };

      const planId = foundAgency.planId || 'growth';
      const plansStr = localStorage.getItem('saas_plans');
      if (!plansStr) return { ok: true };
      const plans = JSON.parse(plansStr);
      const foundPlan = plans.find(p => p.id === planId);
      if (!foundPlan) return { ok: true };

      if (type === 'agents') {
        const limit = foundPlan.maxAgents !== undefined ? parseInt(foundPlan.maxAgents) : -1;
        if (limit !== -1) {
          return { ok: false, limit, planName: foundPlan.name };
        }
      } else if (type === 'cases') {
        const limit = foundPlan.maxCases !== undefined ? parseInt(foundPlan.maxCases) : -1;
        if (limit !== -1) {
          return { ok: false, limit, planName: foundPlan.name };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return { ok: true };
  },

  // AGENTS
  getAgents: async () => {
    const res = await apiClient.get('/users/agents');
    return res.data;
  },
  createAgent: async (agent) => {
    const payload = {
      fullName: agent.name,
      email: agent.email,
      password: agent.password,
      hotlineNumber: agent.phone,
      role: agent.role,
      spokenLanguages: agent.languages,
      nationalities: agent.nationalities,
      commissionRate: agent.commissionRate,
      immigrationBio: agent.bio,
      customPermissions: agent.customPermissions
    };
    const res = await apiClient.post('/users', payload);
    return res.data;
  },
  updateAgent: async (agent) => {
    const payload = {
      fullName: agent.name,
      email: agent.email,
      hotlineNumber: agent.phone,
      role: agent.role,
      spokenLanguages: agent.languages,
      nationalities: agent.nationalities,
      commissionRate: agent.commissionRate,
      immigrationBio: agent.bio,
      customPermissions: agent.customPermissions
    };
    const res = await apiClient.put(`/users/${agent.id}`, payload);
    return res.data;
  },
  resetAgentPassword: async (id, newPassword) => {
    const res = await apiClient.put(`/users/${id}/password`, { newPassword });
    return res.data;
  },
  deleteAgent: async (id) => {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  },
  getConsultants: async () => {
    const res = await apiClient.get('/users/agents');
    // filter consultants if needed
    return res.data;
  },

  // AUTH
  authLogin: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
  clientLogin: async (clientId, password) => {
    const res = await apiClient.post('/clients/login', { clientId, password });
    return res.data;
  },
  changeClientPassword: async (clientId, newPassword) => {
    const res = await apiClient.put(`/clients/${clientId}/change-password`, { newPassword });
    return res.data;
  },

  // STUBS (To prevent UI crash where APIs are not yet built)
  getNotifications: async () => [],
  addNotification: async () => ({}),
  getConversations: async () => [],
  getSettings: async () => {
    const res = await apiClient.get('/settings/company');
    return res.data;
  },
  updateSettings: async (data) => {
    const res = await apiClient.put('/settings/company', data);
    return res.data;
  },
  getServices: async () => {
    const res = await apiClient.get('/settings/services');
    return res.data;
  },
  updateServices: async (data) => {
    const res = await apiClient.put('/settings/services', data);
    return res.data;
  },
  getPackages: async () => {
    const res = await apiClient.get('/settings/packages');
    return res.data;
  },
  updatePackages: async (data) => {
    const res = await apiClient.put('/settings/packages', data);
    return res.data;
  },
  getEmailTemplates: async () => {
    const res = await apiClient.get('/settings/templates/email');
    return res.data;
  },
  updateEmailTemplates: async (data) => {
    const res = await apiClient.put('/settings/templates/email', data);
    return res.data;
  },
  getWhatsappTemplates: async () => {
    const res = await apiClient.get('/settings/templates/whatsapp');
    return res.data;
  },
  updateWhatsappTemplates: async (data) => {
    const res = await apiClient.put('/settings/templates/whatsapp', data);
    return res.data;
  },
  getCommissionRates: async () => {
    const res = await apiClient.get('/payments/commissions/rates');
    return res.data;
  },
  getCommissionsReport: async () => {
    const res = await apiClient.get('/payments/commissions/report');
    return res.data;
  },
  updateCommissionRate: async (agentId, type, value) => {
    const res = await apiClient.patch('/payments/commissions/rates', { agentId, type, value });
    return res.data;
  },
  getRefundRequests: async () => {
    const res = await apiClient.get('/payments/refunds');
    return res.data;
  },
  createRefundRequest: async (data) => {
    const res = await apiClient.post('/payments/refunds', data);
    return res.data;
  },
  updateRefundStatus: async (refundId, status) => {
    const res = await apiClient.patch(`/payments/refunds/${refundId}/status`, { status });
    return res.data;
  },
  getBackupLogs: async () => []
};
