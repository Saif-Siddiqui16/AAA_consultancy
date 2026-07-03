import React from 'react';
import { Box, Typography, Paper, Divider, Button } from '@mui/material';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import CampaignIcon from '@mui/icons-material/Campaign';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useQuery } from '@tanstack/react-query';

import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import AppCard from '../../components/AppCard';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';

const COLORS = ['#2563EB', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const MarketingDashboard = () => {
  const { currentUser } = useAuth();
  const { showAlert } = useAlert();
  const { data: customizationSettings } = useQuery({
    queryKey: ['customization-settings'],
    queryFn: dbService.getCustomizationSettings
  });

  // LEAD SOURCE PERFORMANCE STATS
  const marketingStats = [
    { title: 'Total Leads Generated', value: '1,450', icon: <PeopleAltIcon />, color: '#3F51B5', trend: '12%' },
    { title: 'Total Consultations Booked', value: '380', icon: <TrendingUpIcon />, color: '#14B8A6', trend: '5%' },
    { title: 'Active Campaigns', value: '12', icon: <CampaignIcon />, color: '#F59E0B', trend: '2' },
    { title: 'Avg Conversion Rate', value: '8.4%', icon: <AssessmentIcon />, color: '#8B5CF6', trend: '1.2%' },
  ];

  // LEAD SOURCE PERFORMANCE (Conversions per Source)
  const sourcePerformanceData = [
    { name: 'Facebook Ads', leads: 400, consultations: 120, clients: 40 },
    { name: 'Google Ads', leads: 350, consultations: 150, clients: 60 },
    { name: 'Instagram Ads', leads: 300, consultations: 80, clients: 20 },
    { name: 'TikTok Ads', leads: 200, consultations: 50, clients: 10 },
    { name: 'WhatsApp', leads: 150, consultations: 90, clients: 45 },
    { name: 'Organic SEO', leads: 50, consultations: 20, clients: 10 },
  ];

  const handleExportReport = () => {
    try {
      // Create CSV content headers
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Source Channel,Total Leads,Consultations Booked,Paid Clients,Acquisition Rate (%)\n";

      sourcePerformanceData.forEach(row => {
        const rate = row.leads > 0 ? ((row.clients / row.leads) * 100).toFixed(1) : 0;
        csvContent += `"${row.name}",${row.leads},${row.consultations},${row.clients},${rate}%\n`;
      });

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `marketing_acquisition_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showAlert("Marketing Report exported successfully as CSV!", "success");
    } catch (e) {
      console.error(e);
      showAlert("Failed to export marketing report", "error");
    }
  };

  // LEAD SOURCE BREAKDOWN (PIE CHART)
  const leadSourceDistribution = [
    { name: 'Facebook Ads', value: 400 },
    { name: 'Google Ads', value: 350 },
    { name: 'Instagram Ads', value: 300 },
    { name: 'TikTok Ads', value: 200 },
    { name: 'WhatsApp', value: 150 },
    { name: 'Organic SEO', value: 50 },
  ];

  return (
    <Box>
      <PageHeader
        title="Marketing Performance Dashboard"
        subtitle="Track Lead Sources, Campaign Conversions, and Acquisition Metrics"
        action={
          <Button variant="contained" color="secondary" startIcon={<AssessmentIcon />} onClick={handleExportReport}>
            Export Marketing Report
          </Button>
        }
      />

      {/* KPI WIDGETS */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, mt: 1, fontWeight: 700, textTransform: 'uppercase' }}>
        Acquisition Overview
      </Typography>
<Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {marketingStats
          .filter(stat => {
            const cardTitle = stat.title === 'Total Leads Generated' ? 'Total Consultations' :
              stat.title === 'Total Consultations Booked' ? "Today's Consultations" :
                stat.title;

            // If it's a campaign metric not present in the customizable cards catalog, always show it
            const customizableKeys = [
              'Total Clients',
              'Today\'s Clients',
              'Total Consultations',
              'Today\'s Consultations',
              'Upcoming Meetings',
              'Pending Payments',
              'Total Revenue',
              'Active Cases',
              'Completed Cases',
              'Lost Consultations',
              'Revenue Today',
              'Outstanding Revenue',
              'Refunded (50% Rejections)'
            ];

            if (!customizableKeys.includes(cardTitle)) {
              return true;
            }

            if (currentUser?.customPermissions?.enabled) {
              const allowedCards = currentUser.customPermissions.cards || [];
              return allowedCards.includes(cardTitle);
            }

            if (customizationSettings && customizationSettings.marketing) {
              const allowedCards = customizationSettings.marketing.cards || [];
              return allowedCards.includes(cardTitle);
            }
            return true;
          })
          .map((stat, idx) => (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              trendDirection={parseFloat(stat.trend) >= 0 ? 'up' : 'down'}
              color={stat.color}
            />
          ))}
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4">
        {/* LEAD SOURCE DISTRIBUTION */}
        <Box className="col-span-12 md:col-span-5">
          <ChartCard title="Total Leads per Source" subheader="Distribution of raw leads across channels">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leadSourceDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value" label>
                  {leadSourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>

        {/* FUNNEL CONVERSIONS PER SOURCE */}
        <Box className="col-span-12 md:col-span-7">
          <ChartCard title="Funnel Conversion by Source" subheader="Leads vs Booked Consultations vs Paid Clients">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourcePerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="leads" name="Raw Leads" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="consultations" name="Consultations" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clients" name="Paid Clients" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>
      </Box>
    </Box>
  );
};

export default MarketingDashboard;
