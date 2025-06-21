import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Avatar,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    Breadcrumbs,
    Link,
    Button
} from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import postService from '../../services/postService';
import { formatDistanceToNow } from 'date-fns';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                setLoading(true);
                const response = await postService.getPostById(id);
                console.log('Post details:', response);

                if (response && response.data) {
                    setPost(response.data);
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                console.error('Failed to fetch post details:', err);
                setError('Failed to load post details. The post may have been removed or is unavailable.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPostDetails();
        }
    }, [id]);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ my: 8 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || !post) {
        return (
            <Container maxWidth="lg" sx={{ my: 8 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBack}
                    sx={{ mb: 4 }}
                >
                    Back to Blog
                </Button>
                <Alert severity="error" sx={{ my: 2 }}>
                    {error || 'Post not found'}
                </Alert>
            </Container>
        );
    }

    // Format date
    const publishDate = new Date(post.created_at);
    const formattedDate = publishDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const timeAgo = formatDistanceToNow(publishDate, { addSuffix: true });

    // Estimate read time (1 min per 200 words)
    const wordCount = post.content?.split(/\s+/).length || 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <Container maxWidth="lg" sx={{ my: { xs: 4, md: 8 } }}>
            {/* Breadcrumbs navigation */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link component={RouterLink} to="/" underline="hover" color="inherit">
                    Home
                </Link>
                <Link component={RouterLink} to="/blog" underline="hover" color="inherit">
                    Blog
                </Link>
                <Typography color="text.primary">{post.type}</Typography>
            </Breadcrumbs>

            {/* Back button */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                sx={{ mb: 4 }}
            >
                Back to Blog
            </Button>

            {/* Post category */}
            {post.type && (
                <Chip
                    label={post.type.replace(/_/g, ' ')}
                    color="primary"
                    size="small"
                    sx={{
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        mb: 2,
                        borderRadius: '4px'
                    }}
                />
            )}

            {/* Post title */}
            <Typography
                variant="h2"
                component="h1"
                sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    lineHeight: 1.2,
                    mb: 3
                }}
            >
                {post.title}
            </Typography>

            {/* Author and meta information */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 4
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                        src={post.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.first_name} ${post.last_name}`}
                        alt={`${post.first_name} ${post.last_name}`}
                        sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {post.first_name} {post.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formattedDate} ({timeAgo})
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { xs: 0, sm: 'auto' } }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                        {readTime} min read
                    </Typography>

                    <Button
                        size="small"
                        startIcon={<BookmarkIcon />}
                        sx={{ ml: 2 }}
                    >
                        Save
                    </Button>

                    <Button
                        size="small"
                        startIcon={<ShareIcon />}
                    >
                        Share
                    </Button>
                </Box>
            </Box>

            {/* Main image */}
            {post.thumbnail && (
                <Box
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        overflow: 'hidden',
                        mb: 5
                    }}
                >
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '600px',
                            objectFit: 'cover'
                        }}
                    />
                </Box>
            )}

            {/* Post content */}
            <Box
                sx={{
                    typography: 'body1',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.7,
                    color: 'text.primary',
                    '& p': { mb: 3 },
                    '& h2': {
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        mt: 5,
                        mb: 3
                    },
                    '& h3': {
                        fontSize: '1.35rem',
                        fontWeight: 600,
                        mt: 4,
                        mb: 2
                    },
                    '& ul, & ol': {
                        pl: 4,
                        mb: 3
                    },
                    '& li': {
                        mb: 1
                    }
                }}
            >
                {/* We should use a rich text renderer here for formatted content */}
                {/* For now, let's display the raw content */}
                <Typography variant="body1" paragraph>
                    {post.content}
                </Typography>
            </Box>

            <Divider sx={{ my: 5 }} />

            {/* Actions section */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 5
            }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBack}
                >
                    Back to Blog
                </Button>

                <Box>
                    <Button
                        startIcon={<BookmarkIcon />}
                        sx={{ mr: 2 }}
                    >
                        Save
                    </Button>
                    <Button
                        startIcon={<ShareIcon />}
                    >
                        Share
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default BlogDetails;