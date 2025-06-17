import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import { fetchCurrentUser } from '../services/userService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    activeUsers: 0
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setLoading(true);
        const response = await fetchCurrentUser();
        const user = response.data;
        
        if (!user || user.role !== 'admin') {
          navigate('/');
          return;
        }
        
        setUserData(user);
        // Here you would typically fetch admin stats
        // For now using dummy data
        setStats({
          totalUsers: 150,
          totalPosts: 45,
          activeUsers: 89
        });
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h4">{stats.totalUsers}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ArticleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">Total Posts</Typography>
                  <Typography variant="h4">{stats.totalPosts}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SettingsIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6">Active Users</Typography>
                  <Typography variant="h4">{stats.activeUsers}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>U</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="New user registration"
                  secondary="2 minutes ago"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>P</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="New post published"
                  secondary="15 minutes ago"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" gap={2}>
              <Button variant="contained" color="primary">
                Manage Users
              </Button>
              <Button variant="contained" color="primary">
                Manage Posts
              </Button>
              <Button variant="contained" color="primary">
                System Settings
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 