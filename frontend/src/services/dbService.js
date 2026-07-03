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

  // SETTINGS & CUSTOMIZATION
  getCustomizationSettings: async () => {
    const res = await apiClient.get('/settings/customization');
    return res.data;
  },
  getLeadStages: async () => {
    const res = await apiClient.get('/settings/lead-stages');
    return res.data;
  },

  // AGENTS
  getAgents: async () => {
    const res = await apiClient.get('/users/agents');
    return res.data;
  },
  createAgent: async (agent) => {
    const res = await apiClient.post('/users', agent);
    return res.data;
  },
  getConsultants: async () => {
    const res = await apiClient.get('/users/agents');
    // filter consultants if needed
    return res.data;
  },

  // STUBS (To prevent UI crash where APIs are not yet built)
  getNotifications: async () => [],
  addNotification: async () => ({}),
  getConversations: async () => [],
  getSettings: async () => ({}),
  getServices: async () => [],
  getPackages: async () => [],
  getEmailTemplates: async () => [],
  getWhatsappTemplates: async () => [],
  getCommissionRates: async () => [],
  getCommissionsReport: async () => [],
  getRefundRequests: async () => [],
  getBackupLogs: async () => []
};
