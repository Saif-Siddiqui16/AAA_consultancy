const getCustomizationSettings = async (req, res) => {
  const DEFAULT_CUSTOMIZATION = {
    admin: {
      menus: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Finance', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance', 'Integrations'],
      cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Pending Payments', 'Total Revenue', 'Active Cases', 'Completed Cases', 'Lost Consultations', 'Revenue Today', 'Outstanding Revenue', 'Refunded (50% Rejections)'],
      features: ['canEditTranslationRates']
    },
    operations: {
      menus: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance'],
      cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Active Cases', 'Completed Cases'],
      features: []
    },
    finance: {
      menus: ['Dashboard', 'Finance'],
      cards: ['Total Revenue', 'Pending Payments'],
      features: []
    },
    consultant: {
      menus: ['Dashboard', 'Clients', 'Leads', 'Social Inbox', 'Calendar'],
      cards: ['Upcoming Meetings', 'Active Cases'],
      features: []
    },
    marketing: {
      menus: ['Dashboard', 'Leads', 'Marketing'],
      cards: ['Total Consultations', 'Today\'s Consultations'],
      features: []
    }
  };

  res.json(DEFAULT_CUSTOMIZATION);
};

const getLeadStages = async (req, res) => {
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
  res.json(DEFAULT_LEAD_STAGES);
}

module.exports = { getCustomizationSettings, getLeadStages };
