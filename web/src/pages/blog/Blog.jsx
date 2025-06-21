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
    Alert,
    Pagination,
    Stack
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

    // Pagination states
    const [page, setPage] = useState(1);
    const [postsPerPage] = useState(9); // 6 cards per page (3x2 grid)
    const [totalPages, setTotalPages] = useState(1);

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

                    // Calculate total pages based on regular posts
                    setTotalPages(Math.ceil(regularPosts.length / postsPerPage));
                } else {
                    console.log('Featured post not found, showing all posts');
                    setPosts(postsData);

                    // Calculate total pages based on all posts
                    setTotalPages(Math.ceil(postsData.length / postsPerPage));
                }

            } catch (err) {
                console.error('Failed to fetch posts:', err);
                setError('Failed to load posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [postsPerPage]);

    // Handle page change
    const handlePageChange = (event, value) => {
        setPage(value);
        // Scroll to the top of the articles section
        document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Get current posts for the selected page
    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

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
                                ? `${featuredPost.first_name || ''} ${featuredPost.last_name || ''}`
                                : "Zerotine Team"
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
                    <Box id="articles-section" sx={{ my: 6 }}>
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
                            spacing={8}
                            sx={{
                                mt: 2,
                                mb: 4
                            }}
                        >
                            {currentPosts.map((post, index) => (
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
                                        image={post.thumbnail || `https://source.unsplash.com/random/600x400?smoking-cessation&sig=${indexOfFirstPost + index}`}
                                        title={post.title || "How to improve your journey to quitting smoking"}
                                        subtitle={post.content?.substring(0, 120) + '...' || "Learn effective strategies and supportive approaches."}
                                        author={
                                            post.first_name || post.last_name
                                                ? `${post.first_name || ''} ${post.last_name || ''}`
                                                : "Zerotine Team"
                                        }
                                        authorAvatar={post.avatar || null}
                                        achievement={post.achievement_id || null}
                                        date={post.publishDate || post.created_at
                                            ? new Date(post.publishDate || post.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            }).toUpperCase()
                                            : `MAY ${10 + indexOfFirstPost + index}`
                                        }
                                        slug={post.slug || (post.title && generateSlug(post.title)) || `post-${indexOfFirstPost + index}`}
                                        id={post.id}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        {!loading && !error && totalPages > 1 && (
                            <Stack
                                spacing={2}
                                alignItems="center"
                                sx={{
                                    mt: 6,
                                    mb: 2,
                                    pt: 3,
                                    borderTop: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    showFirstButton
                                    showLastButton
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            fontWeight: 500
                                        }
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Page {page} of {totalPages}
                                </Typography>
                            </Stack>
                        )}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Blog;