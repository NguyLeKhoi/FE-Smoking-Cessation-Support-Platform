import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FolderIcon from '@mui/icons-material/Folder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import AdminMembership from './AdminMembership';
import AdminApprovePosts from './AdminApprovePosts';
import AdminStatisticsTable from './AdminStatisticsTable';

const tabList = [
  { label: 'Dashboard' },
  { label: 'Membership' },
  { label: 'Approve Posts' },
  { label: 'Achievements' },
];

const stats = [
  {
    label: 'Projects',
    value: 18,
    sub: '2 Completed',
    icon: <AssignmentIcon sx={{ fontSize: 32, color: '#222' }} />,
  },
  {
    label: 'Active Tasks',
    value: 132,
    sub: '28 Completed',
    icon: <ListAltIcon sx={{ fontSize: 32, color: '#222' }} />,
  },
  {
    label: 'Teams',
    value: 12,
    sub: '1 Completed',
    icon: <GroupIcon sx={{ fontSize: 32, color: '#222' }} />,
  },
  {
    label: 'Productivity',
    value: '76%',
    sub: '5% Completed',
    icon: <TrendingUpIcon sx={{ fontSize: 32, color: '#222' }} />,
  },
];

const projects = [
  {
    name: 'Dropbox Design System',
    hours: 34,
    priority: 'High',
    members: [
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/men/45.jpg',
    ],
    progress: 15,
  },
  {
    name: 'Slack Team UI Design',
    hours: 47,
    priority: 'Medium',
    members: [
      'https://randomuser.me/api/portraits/men/36.jpg',
      'https://randomuser.me/api/portraits/women/47.jpg',
      'https://randomuser.me/api/portraits/men/48.jpg',
    ],
    progress: 35,
  },
  {
    name: 'GitHub Satellite',
    hours: 120,
    priority: 'Low',
    members: [
      'https://randomuser.me/api/portraits/men/38.jpg',
      'https://randomuser.me/api/portraits/women/49.jpg',
    ],
    progress: 75,
  },
  {
    name: '3D Character Modelling',
    hours: 89,
    priority: 'Medium',
    members: [
      'https://randomuser.me/api/portraits/men/40.jpg',
      'https://randomuser.me/api/portraits/women/50.jpg',
    ],
    progress: 63,
  },
  {
    name: 'Webapp Design System',
    hours: 108,
    priority: 'High',
    members: [
      'https://randomuser.me/api/portraits/men/41.jpg',
      'https://randomuser.me/api/portraits/women/51.jpg',
    ],
    progress: 100,
  },
];

const priorityColor = (priority) => {
  if (priority === 'High') return 'error';
  if (priority === 'Medium') return 'warning';
  return 'default';
};

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
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3, mt: 1 }} justifyContent="center">
              {stats.map((stat, idx) => (
                <Grid item xs={12} sm={6} md={3} key={stat.label}>
                  <Box sx={{ p: 3, bgcolor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 120, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: 'none', mb: 1 }}>
                    <Box mb={1}>{stat.icon}</Box>
                    <Typography variant="h3" fontWeight={900} color="#111" mb={0.5}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" color="#222" fontWeight={700}>
                      {stat.label}
                    </Typography>
                    <Typography variant="caption" color="#888">
                      {stat.sub}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            {/* Table Section */}
            <>
              <Typography variant="h6" fontWeight={900} mb={2} p={2} color="#111">
                Active Projects
              </Typography>
              <TableContainer sx={{ width: '100%', maxWidth: '100%', mx: 0, bgcolor: '#fff', borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f7fa', borderRadius: 0 }}>
                      <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><FolderIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Project Name</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><AccessTimeIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Hours</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><PriorityHighIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Priority</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><GroupIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Members</TableCell>
                      <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><TrendingFlatIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((row, idx) => (
                      <TableRow key={idx} hover sx={{ transition: 'background 0.2s', '&:hover': { bgcolor: '#f7f7f7' } }}>
                        <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontWeight: 600 }}>{row.name}</TableCell>
                        <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.hours}</TableCell>
                        <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2 }}>
                          <Chip label={row.priority} color={priorityColor(row.priority)} size="small" sx={{ fontWeight: 700, bgcolor: row.priority === 'High' ? '#111' : row.priority === 'Medium' ? '#888' : '#eee', color: row.priority === 'Low' ? '#111' : '#fff', borderRadius: 1, px: 2, fontSize: 15 }} />
                        </TableCell>
                        <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2 }}>
                          <Box display="flex" justifyContent="flex-start" gap={1}>
                            {row.members.map((m, i) => (
                              <Avatar key={i} src={m} sx={{ width: 28, height: 28 }} />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={{ width: 80, height: 8, bgcolor: '#eee', borderRadius: 2, overflow: 'hidden' }}>
                              <Box sx={{ width: `${row.progress}%`, height: 8, bgcolor: '#111' }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#111', fontWeight: 700 }}>{row.progress}%</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
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
      </Box>
    </Box>
  );
} 