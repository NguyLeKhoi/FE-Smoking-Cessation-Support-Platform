import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import AdminMembership from './AdminMembership';
import AdminApprovePosts from './AdminApprovePosts';
import AdminStatisticsTable from './statistics/AdminStatisticsTable';
import AdminCoach from './AdminCoach';
import statisticsService from '../../services/statisticsService';
import StatisticsCard from './statistics/StatisticsCard';
import StatisticsAreaChart from './statistics/StatisticsAreaChart';
import StatisticsLineChart from './statistics/StatisticsLineChart';
import StatisticsBarChart from './statistics/StatisticsBarChart';
import StatisticsPieChart from './statistics/StatisticsPieChart';


const tabList = [
  { label: 'Dashboard' },
  { label: 'Membership' },
  { label: 'Approve Posts' },
  { label: 'Achievements' },
  { label: 'Coach Management' },
];

// Shared Paper/Table style for all tabs
const sharedPaperSx = {
  borderRadius: 4,
  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
  p: { xs: 1.5, md: 2 },
  mb: 0,
};
const sharedTableContainerSx = {
  borderRadius: 3,
  background: '#fff',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    statisticsService.getOverview()
      .then((data) => {
        if (mounted) {
          console.log('Statistics overview data:', data);
          setStats(data.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError('Failed to load statistics');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  return (
    <Box sx={{ width: '100%', mt: 0, mb: 0, maxWidth: '100%', mx: 0, p: 0 }}>
      <Box sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: '#fff', width: '100%', maxWidth: '100%', mx: 0, mt: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          indicatorColor="primary"
          textColor="primary"
          sx={{ minHeight: 56, borderRadius: 0, boxShadow: 'none', bgcolor: '#fff', mb: 2, mt: 2 }}
        >
          {tabList.map((t, idx) => (
            <Tab key={t.label} label={t.label} sx={{ fontWeight: 700, fontSize: 16, minHeight: 56, borderRadius: 0, boxShadow: 'none', color: '#111', px: 4 }} />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ width: '100%', p: 0, maxWidth: '100%', mx: 0 }}>
        {tab === 0 && (
          <>
            <StatisticsCard stats={stats} loading={loading} error={error} />

            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 2, my: 4 }}>
              <Box sx={{ width: '45%' }}>
                <StatisticsPieChart totalPostsByStatus={stats?.totalPostsByStatus || {}} />
              </Box>
              <Box sx={{ width: '55%' }}>
                <StatisticsBarChart
                  totalQuitPlansByStatus={stats?.totalQuitPlansByStatus || {}}
                  totalRecordsByIsPass={stats?.totalRecordsByIsPass || {}}
                />
              </Box>

            </Box>


            {!loading && !error && stats && (
              <Box sx={{ my: 4 }}>
                <StatisticsAreaChart
                  moneySavedByMonth={stats.moneySavedByMonth}
                  cigarettesNotSmokedByMonth={stats.cigarettesNotSmokedByMonth}
                  revenueFromMembershipsByMonth={stats.revenueFromMembershipsByMonth}
                />
              </Box>
            )}



            {!loading && !error && stats && (
              <StatisticsLineChart revenueFromMembershipsByMonth={stats?.revenueFromMembershipsByMonth || []} />
            )}


          </>
        )}
        {tab === 1 && (
          <Paper sx={sharedPaperSx}>
            <AdminMembership tableContainerSx={sharedTableContainerSx} />
          </Paper>
        )}
        {tab === 2 && (
          <Paper sx={sharedPaperSx}>
            <AdminApprovePosts tableContainerSx={sharedTableContainerSx} />
          </Paper>
        )}
        {tab === 3 && (
          <Paper sx={sharedPaperSx}>
            <AdminStatisticsTable tableContainerSx={sharedTableContainerSx} />
          </Paper>
        )}
        {tab === 4 && (
          <Paper sx={sharedPaperSx}>
            <AdminCoach />
          </Paper>
        )}
      </Box>
    </Box>
  );
} 