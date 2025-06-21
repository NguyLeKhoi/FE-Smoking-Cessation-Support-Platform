import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
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
import BlogBanner from '../../components/blog/BlogBanner';
import postService from '../../services/postService';
import { generateSlug } from '../../utils/slugUtils';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [featuredPost, setFeaturedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const FEATURED_POST_ID = "9ff8d9f9-0032-4746-8393-d95249945eba";

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);

                // Fetch all posts
                const response = await postService.getAllPosts();
                console.log('Posts fetched:', response);

                // Process the posts data
                let postsData = [];
                if (response && response.data && Array.isArray(response.data)) {
                    postsData = response.data;
                } else if (Array.isArray(response)) {
                    postsData = response;
                } else {
                    console.error('Unexpected API response format:', response);
                    setError('Received unexpected data format from API');
                    setLoading(false);
                    return;
                }

                // Find the featured post
                const featured = postsData.find(post => post.id === FEATURED_POST_ID);

                if (featured) {
                    // Remove the featured post from the regular posts list
                    const regularPosts = postsData.filter(post => post.id !== FEATURED_POST_ID);
                    setFeaturedPost(featured);
                    setPosts(regularPosts);
                } else {
                    console.log('Featured post not found, showing all posts');
                    setPosts(postsData);
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
                {/* Featured Post Banner */}
                {featuredPost ? (
                    <BlogBanner
                        title={featuredPost.title || "Cessation Access & Support"}
                        subtitle={featuredPost.content?.substring(0, 150) + "..."}
                        bannerImage={featuredPost.thumbnail || Banner2}
                        date={featuredPost.publishDate || featuredPost.created_at
                            ? new Date(featuredPost.publishDate || featuredPost.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            }).toUpperCase()
                            : "UNKNOWN DATE"
                        }
                        author={
                            (featuredPost.first_name || featuredPost.last_name)
                                ? `${featuredPost.first_name || ''} ${featuredPost.last_name || ''}`.trim().toUpperCase()
                                : "ZEROTINE TEAM"
                        }
                        slug={featuredPost.slug || generateSlug(featuredPost.title) || `post-featured`}
                        id={featuredPost.id}
                    />
                ) : (
                    loading ? (
                        <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <BlogBanner
                            title="our commitment to helping you quit"
                            subtitle="We provide evidence-based strategies and supportive tools to help you on your journey to becoming smoke-free."
                            bannerImage={Banner2}
                        />
                    )
                )}

                <Divider sx={{ my: 4, borderColor: 'divider' }} />

                {/* Content with regular posts */}
                <Container
                    maxWidth="lg"
                    sx={{
                        pt: { xs: 2, md: 1 },
                        pb: 8,
                        px: { xs: 2, sm: 4 }
                    }}
                >
                    {/* Articles Section */}
                    <Box sx={{ my: 6 }}>
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                mb: 4,
                                fontWeight: 700,
                                color: 'text.primary'
                            }}
                        >
                            Latest Articles
                        </Typography>

                        {loading && !featuredPost && (
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
                            spacing={3}
                            sx={{
                                mt: 2,
                                mb: 4
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
                                        mb: 2
                                    }}
                                >
                                    <CustomCard
                                        image={post.thumbnail || `https://source.unsplash.com/random/600x400?smoking-cessation&sig=${index}`}
                                        title={post.title || "How to improve your journey to quitting smoking"}
                                        subtitle={post.content?.substring(0, 120) + '...' || "Learn effective strategies and supportive approaches."}
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
                                        id={post.id}
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
                </Container>
            </Box>
        </Box>
    );
};

export default Blog;