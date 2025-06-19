import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    Divider,
    Button,
    Paper,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import Banner2 from '../assets/banner2.jpg';
import CustomCard from '../components/blog/CustomCard';
import BlogSidebar from '../components/blog/BlogSidebar';
import postService from '../services/postService';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await postService.getAllPosts();
                console.log('Posts fetched:', response);

                // Check if response has data property and it's an array
                if (response && response.data && Array.isArray(response.data)) {
                    setPosts(response.data);
                } else if (Array.isArray(response)) {

                    setPosts(response);
                } else {
                    console.error('Unexpected API response format:', response);
                    setError('Received unexpected data format from API');
                }
            } catch (err) {
                console.error('Failed to fetch posts:', err);
                setError('Failed to load posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const sidebarWidth = 260;

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'background.paper',
            position: 'relative'
        }}>
            {/* Desktop sidebar */}
            <Box
                component="nav"
                sx={{
                    width: sidebarWidth,
                    flexShrink: 0,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 1000,
                }}
            >
                <BlogSidebar />
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: `${sidebarWidth}px`,
                    width: `calc(100% - ${sidebarWidth}px)`,
                }}
            >
                {/* Content with proper padding */}
                <Container
                    maxWidth="lg"
                    sx={{
                        pt: 1,
                        pb: 8,
                        px: 4
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        {/* Section Title */}
                        <Box sx={{ mb: 6 }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    color: 'text.primary',
                                    fontSize: '2.5rem',
                                    lineHeight: 1.2
                                }}
                            >
                                Cessation Access & Support
                            </Typography>
                            {/* Banner Image */}
                            <Card sx={{ borderRadius: 2, overflow: 'hidden', mb: 6 }}>
                                <CardMedia
                                    component="img"
                                    height="400"
                                    width="100%"
                                    image={Banner2}
                                    alt="Smoking Cessation"
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Card>

                            {/* Section Subtitle */}
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 500,
                                    mb: 4,
                                    color: 'text.secondary',
                                    fontSize: '1.3rem',
                                    lineHeight: 1.4
                                }}
                            >
                                An effective approach to supporting folks looking to improve their smoking habit and their health.
                            </Typography>
                        </Box>

                        {/* Divider */}
                        <Divider sx={{ my: 4, borderColor: 'primary.main' }} />

                        {/* Articles Section */}
                        <Box sx={{ my: 4 }}>
                            {loading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                    <CircularProgress />
                                </Box>
                            )}

                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            {!loading && !error && posts.length === 0 && (
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    No posts available at the moment.
                                </Alert>
                            )}

                            <Grid container spacing={3}>
                                {posts.map((post, index) => (
                                    <Grid item xs={12} md={6} lg={4} key={index}>
                                        <CustomCard
                                            image={post.thumbnail || 'https://placehold.co/600x400?text=No+Image'}
                                            height={300}
                                            title={post.title}
                                            subtitle={post.content?.substring(0, 120) + '...' || 'No content available'}
                                            author={post.author?.name || 'Anonymous'}
                                            duration={post.read_time || '5 min'}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* Subscription Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 8,
                                mb: 4,
                                textAlign: 'center',
                                p: 6,
                                borderRadius: 3,
                                backgroundColor: 'section.light',
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    color: 'text.primary'
                                }}
                            >
                                Subscribe to Our Newsletter
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 4,
                                    color: 'text.secondary',
                                    maxWidth: '600px',
                                    mx: 'auto'
                                }}
                            >
                                Stay updated with the latest articles, success stories, and tips to help you on your journey to a smoke-free life.
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 2,
                                maxWidth: '600px',
                                mx: 'auto'
                            }}>
                                <TextField
                                    placeholder="Enter your email address"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: 'background.default',
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 0 rgba(0, 0, 0, 0.2)',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.2)',
                                            transform: 'translateY(2px)',
                                        },
                                        '&:active': {
                                            boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
                                            transform: 'translateY(4px)',
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Subscribe
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Blog;