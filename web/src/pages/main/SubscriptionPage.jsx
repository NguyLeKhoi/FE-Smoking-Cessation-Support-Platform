// d:/FPTU/SU25/WDP301/FE/web/src/pages/main/SubscriptionPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  Grid,
  Divider,
  Chip,
  useTheme,
  CircularProgress,
  Alert,
  Paper,
  CardHeader,
  CardContent,
  CardActions,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';
import { EmojiEvents, CheckCircle, EventAvailable, EventBusy, Update } from '@mui/icons-material';

// Styled Components
const PageContainer = styled(Box)({
  display: 'flex',
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: '#f8f9fa',
});

const ContentContainer = styled(Box)({
  flexGrow: 1,
  padding: '16px 24px',
  maxWidth: 'calc(100% - 240px)',
  '@media (max-width: 900px)': {
    marginLeft: 0,
    maxWidth: '100%',
    padding: '12px 16px',
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
}));

const FeatureItem = ({ text }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <CheckCircle color="primary" sx={{ mr: 1.5, fontSize: '20px' }} />
    <Typography variant="body2" color="text.secondary">
      {text}
    </Typography>
  </Box>
);

const SubscriptionPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State
  const [subscriptions, setSubscriptions] = useState({
    active: [],
    upcoming: [],
    expired: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    name: 'User',
    avatar: '',
    points: 0,
    level: 1
  });

  // Fetch subscription data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get the raw response
        const response = await subscriptionService.getCurrent();
        
        // Khởi tạo mảng rỗng cho các loại subscription
        let active = [];
        let upcoming = [];
        let expired = [];
        
        // Hàm xử lý một mảng subscription và phân loại chúng
        const processSubscriptions = (subs, defaultStatus = null) => {
          if (!subs) return;
          
          const subscriptions = Array.isArray(subs) ? subs : [subs];
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          subscriptions.forEach(sub => {
            if (!sub) return;
            
            // Parse dates
            const startDate = sub.start_date ? new Date(sub.start_date) : null;
            const endDate = sub.end_date ? new Date(sub.end_date) : null;
            
            // Skip if dates are invalid
            if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              return;
            }
            
            // Reset time part for comparison
            const startAtMidnight = new Date(startDate);
            startAtMidnight.setHours(0, 0, 0, 0);
            
            const endAtMidnight = new Date(endDate);
            endAtMidnight.setHours(0, 0, 0, 0);
            
            // Nếu có status từ API, ưu tiên sử dụng nó
            let status = sub.status || defaultStatus;
            
            // Nếu không có status từ API, tự động xác định dựa trên ngày
            if (!status) {
              if (startAtMidnight > today) {
                status = 'upcoming';
              } else if (endAtMidnight < today) {
                status = 'expired';
              } else {
                status = 'active';
              }
            }
            

            
            // Thêm vào mảng tương ứng
            const subscriptionWithStatus = { ...sub, status };
            
            if (status === 'active') {
              active.push(subscriptionWithStatus);
            } else if (status === 'upcoming') {
              upcoming.push(subscriptionWithStatus);
            } else if (status === 'expired') {
              expired.push(subscriptionWithStatus);
            }
          });
        };
        
        // Xử lý tất cả các loại subscription từ API
        if (response?.data) {
          // Nếu API trả về phân loại sẵn
          if (response.data.current || response.data.upcoming || response.data.expired) {
            processSubscriptions(response.data.current, 'active');
            processSubscriptions(response.data.upcoming, 'upcoming');
            processSubscriptions(response.data.expired, 'expired');
          } 
          // Nếu API chỉ trả về một mảng duy nhất
          else if (Array.isArray(response.data)) {
            processSubscriptions(response.data);
          }
          // Nếu API trả về một đối tượng đơn lẻ
          else if (typeof response.data === 'object') {
            processSubscriptions([response.data]);
          }
          
          // Cập nhật state với dữ liệu đã xử lý
          setSubscriptions({ active, upcoming, expired });
        } 
        // Fallback for other response formats
        else if (Array.isArray(response?.data)) {

          setSubscriptions({
            active: response.data.filter(sub => sub?.status === 'active'),
            upcoming: response.data.filter(sub => sub?.status === 'upcoming'),
            expired: response.data.filter(sub => sub?.status === 'expired')
          });
        } 
        // If no data found
        else {

          setSubscriptions({ active: [], upcoming: [], expired: [] });
        }
        
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setError('Không thể tải dữ liệu đăng ký. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load user data from localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserData({
        name: user.name || 'User',
        avatar: user.avatar || '',
        points: user.points || 0,
        level: user.level || 1
      });
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRemainingDays = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = Math.max(0, end - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderSubscriptionCard = (sub) => {
    const isActive = sub.status === 'active';
    const isUpcoming = sub.status === 'upcoming';
    const daysLeft = getRemainingDays(sub.end_date);
    
    return (
      <Grid item xs={12} key={sub.id || sub._id} sx={{ mb: 1.5 }}>
        <Card sx={{ '&:hover': { borderLeft: `4px solid ${isActive ? '#4caf50' : isUpcoming ? '#ff9800' : '#f44336'}` } }}>
          <CardHeader
            sx={{ py: 1.5, '& .MuiCardHeader-avatar': { mr: 1.5 } }}
            avatar={
              <Avatar 
                sx={{ 
                  bgcolor: isActive ? 'success.light' : isUpcoming ? 'warning.light' : 'error.light',
                  color: isActive ? 'success.dark' : isUpcoming ? 'warning.dark' : 'error.dark',
                  width: 36,
                  height: 36
                }}
              >
                {isActive ? <EventAvailable fontSize="small" /> : isUpcoming ? <Update fontSize="small" /> : <EventBusy fontSize="small" />}
              </Avatar>
            }
            title={
              <Box display="flex" alignItems="center" flexWrap="wrap">
                <Typography variant="subtitle1" fontWeight={600} sx={{ mr: 1.5 }}>
                  {sub.plan?.name || 'Premium Plan'}
                </Typography>
                <Chip 
                  label={sub.status.toUpperCase()} 
                  size="small"
                  sx={{ 
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    backgroundColor: isActive ? 'success.light' : isUpcoming ? 'warning.light' : 'error.light',
                    color: isActive ? 'success.dark' : isUpcoming ? 'warning.dark' : 'error.dark',
                  }}
                />
              </Box>
            }
            subheader={
              <Typography variant="caption" color="text.secondary">
                {formatDate(sub.start_date)} - {formatDate(sub.end_date)}
              </Typography>
            }
          />
          <CardContent sx={{ py: 1, '&:last-child': { pb: 2 } }}>
            <Grid container spacing={1}>
              <Grid item xs={6} sm={4}>
                <Box display="flex" alignItems="center">
                  <EventAvailable color="action" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(sub.start_date)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box display="flex" alignItems="center">
                  <EventBusy color="action" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(sub.end_date)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box display="flex" alignItems="center">
                  <Update color="action" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography 
                    variant="body2" 
                    color={isActive ? 'success.main' : isUpcoming ? 'warning.main' : 'error.main'}
                    fontWeight={500}
                  >
                    {isActive ? `${daysLeft} days left` : isUpcoming ? 'Starting soon' : 'Expired'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    <strong>Billing:</strong> {sub.plan?.billing_cycle || 'Monthly'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const renderSubscriptionSection = (title, subs, emptyMessage) => {
    // Force show all sections for debugging
    if (subs.length === 0) {
      return (
        <Box sx={{ mb: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1, p: 1 }}>
          <Box display="flex" alignItems="center" mb={1.5}>
            <Typography variant="subtitle1" fontWeight={600}>
              {title}
            </Typography>
            <Chip 
              label="0" 
              size="small" 
              sx={{ 
                ml: 1.5, 
                height: 20, 
                minWidth: 24, 
                '& .MuiChip-label': { px: 1 },
                backgroundColor: 'rgba(0, 0, 0, 0.08)'
              }} 
            />
          </Box>
          <Paper sx={{ p: 2, backgroundColor: 'background.paper' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              {emptyMessage}
            </Typography>
          </Paper>
        </Box>
      );
    }
    
    return (
      <Box sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1.5}>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
          {subs.length > 0 && (
            <Chip 
              label={subs.length} 
              size="small" 
              sx={{ 
                ml: 1.5, 
                height: 20, 
                minWidth: 24, 
                '& .MuiChip-label': { px: 1 } 
              }} 
            />
          )}
        </Box>
        {subs.length > 0 ? (
          <Grid container spacing={1.5}>
            {subs.map(renderSubscriptionCard)}
          </Grid>
        ) : (
          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'background.paper' }}>
            <Typography variant="body2" color="text.secondary">
              {emptyMessage}
            </Typography>
          </Paper>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <ProfileSidebar userData={userData} />
        <ContentContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </ContentContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ProfileSidebar userData={userData} />
        <ContentContainer>
          <Alert severity="error">{error}</Alert>
        </ContentContainer>
      </PageContainer>
    );
  }

  // Use the pre-categorized subscriptions from the API
  const { active, upcoming, expired } = subscriptions;
  const hasAnySubscription = active.length > 0 || upcoming.length > 0 || expired.length > 0;


  return (
    <PageContainer>
      <ProfileSidebar userData={userData} />
      <ContentContainer>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Subscriptions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your subscription plans
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : hasAnySubscription ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {renderSubscriptionSection(
              'Active Subscriptions',
              active,
              'You currently have no active subscriptions.'
            )}
            
            {renderSubscriptionSection(
              'Upcoming Subscriptions',
              upcoming,
              'You have no upcoming subscriptions.'
            )}
            
            {renderSubscriptionSection(
              'Expired Subscriptions',
              expired,
              'No expired subscriptions found.'
            )}
            
            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note:</strong> If you don't see your expected subscriptions, please refresh the page or contact support.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/membership-plans')}
                startIcon={<EmojiEvents />}
                size="small"
                sx={{ mt: 2 }}
              >
                View Membership Plans
              </Button>
            </Box>
          </Box>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.paper' }}>
            <EmojiEvents sx={{ 
              fontSize: 48, 
              color: 'primary.main', 
              opacity: 0.8, 
              marginBottom: 2 
            }} />
            <Typography variant="h6" gutterBottom>
              {subscriptions.length > 0 ? 'No Valid Subscriptions Found' : 'No Subscriptions Found'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ 
              mb: 3, 
              maxWidth: 500, 
              mx: 'auto' 
            }}>
              {subscriptions.length > 0
                ? 'We found subscriptions but couldn\'t categorize them. Please check the console for details.'
                : 'You don\'t have any subscriptions yet. Choose a plan to get started.'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/membership-plans')}
              startIcon={<EmojiEvents />}
              size="small"
              sx={{ mt: 2 }}
            >
              View Membership Plans
            </Button>
          </Paper>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default SubscriptionPage;