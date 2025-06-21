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
import Banner2 from '../../assets/banner2.jpg';
import CustomCard from '../../components/blog/CustomCard';
import postService from '../../services/postService';
import { generateSlug } from '../../utils/slugUtils';

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

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'background.paper',
            position: 'relative'
        }}>
            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: '100%',
                }}
            >
                {/* Content*/}
                <Container
                    maxWidth="lg"
                    sx={{
                        pt: { xs: 2, md: 4 },
                        pb: 8,
                        px: { xs: 2, sm: 4 }
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
                                    fontSize: { xs: '2rem', md: '2.5rem' },
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
                        <Box sx={{ my: 8 }}> 
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

                            <Grid
                                container
                                spacing={3}    // Increased spacing between grid items (both row and column)
                                sx={{
                                    mt: 2,     // Top margin for the grid container
                                    mb: 4      // Bottom margin for the grid container
                                }}
                            >
                                {posts.map((post, index) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',   
                                            mb: 5  //extra bottom margin to each item
                                        }}
                                    >
                                        <CustomCard
                                            image={post.thumbnail || `https://source.unsplash.com/random/600x400?smoking-cessation&sig=${index}`}
                                            title={post.title || "How to improve your journey to quitting smoking"}
                                            subtitle={post.content?.substring(0, 120) + '...' || "Learn effective strategies and supportive approaches to help you on your path to becoming smoke-free."}
                                            author={
                                                post.first_name || post.last_name
                                                    ? `${post.first_name || ''} ${post.last_name || ''}`.trim().toUpperCase()
                                                    : "ZEROTINE TEAM"
                                            }
                                            authorAvatar={post.avatar || null}
                                            achievement={post.achievement_id || null}
                                            date={post.publishDate || post.created_at
                                                ? new Date(post.publishDate || post.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                }).toUpperCase()
                                                : `MAY ${10 + index}`
                                            }
                                            slug={post.slug || (post.title && generateSlug(post.title)) || `post-${index}`}
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
                                p: { xs: 3, md: 6 },
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
                                flexDirection: { xs: 'column', sm: 'row' },
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
                                        width: { xs: '100%', sm: 'auto' },
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