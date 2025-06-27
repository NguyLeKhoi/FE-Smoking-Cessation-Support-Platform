import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
    Chip,
    Breadcrumbs,
    Link,
    Divider,
    Tabs,
    Tab
} from '@mui/material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import CodeIcon from '@mui/icons-material/Code';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import postService from '../../services/postService';
import { toast } from 'react-toastify';
import LoadingPage from '../LoadingPage';

const EditBlogPage = () => {
    const navigate = useNavigate();
    const { postId } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        thumbnail: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [contentTab, setContentTab] = useState(0); // 0 = Edit, 1 = Preview

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch the post by ID
                const response = await postService.getPostById(postId);
                console.log('Fetched post for editing:', response);

                let postData = response;
                if (response && response.data) {
                    postData = response.data;
                }

                if (!postData) {
                    throw new Error('Post not found');
                }

                setPost(postData);
                setFormData({
                    title: postData.title || '',
                    content: postData.content || '',
                    thumbnail: postData.thumbnail || ''
                });

            } catch (error) {
                console.error('Failed to fetch post:', error);
                setError(error.message || 'Failed to load post');
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        } else {
            setError('No post ID provided');
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => { window.scrollTo({ top: 0 }); }, []);

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear field error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        } else if (formData.title.trim().length < 3) {
            errors.title = 'Title must be at least 3 characters long';
        }

        if (!formData.content.trim()) {
            errors.content = 'Content is required';
        } else if (formData.content.trim().length < 10) {
            errors.content = 'Content must be at least 10 characters long';
        }

        if (formData.thumbnail && !isValidUrl(formData.thumbnail)) {
            errors.thumbnail = 'Please enter a valid URL';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error('Please fix the form errors before saving');
            return;
        }

        try {
            setSaving(true);

            // Call the updatePost API
            const updatedPost = await postService.updatePost(postId, formData);
            console.log('Post updated successfully:', updatedPost);

            // Navigate back to blog list page
            navigate('/my-blog');

        } catch (error) {
            console.error('Failed to update post:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/my-blog');
    };

    const handleContentTabChange = (event, newValue) => {
        setContentTab(newValue);
    };

    // Get status chip
    const getStatusChip = (status) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED':
                return <Chip label="Approved" color="success" size="small" variant="outlined" />;
            case 'PENDING':
                return <Chip label="Pending Review" color="warning" size="small" variant="outlined" />;
            case 'REJECTED':
                return <Chip label="Rejected" color="error" size="small" variant="outlined" />;
            case 'UPDATING':
                return <Chip label="Updating" color="info" size="small" variant="outlined" />;
            default:
                return <Chip label="Draft" color="default" size="small" variant="outlined" />;
        }
    };

    // Markdown styles
    const markdownStyles = {
        '& h1, & h2, & h3, & h4, & h5, & h6': {
            marginTop: 2,
            marginBottom: 1,
            fontWeight: 600,
        },
        '& h1': { fontSize: '2rem' },
        '& h2': { fontSize: '1.5rem' },
        '& h3': { fontSize: '1.25rem' },
        '& p': {
            marginBottom: 1,
            lineHeight: 1.6,
        },
        '& ul, & ol': {
            marginLeft: 2,
            marginBottom: 1,
        },
        '& li': {
            marginBottom: 0.5,
        },
        '& blockquote': {
            borderLeft: '4px solid #ddd',
            paddingLeft: 2,
            margin: '1rem 0',
            fontStyle: 'italic',
            color: 'text.secondary',
        },
        '& code': {
            backgroundColor: 'grey.100',
            padding: '2px 4px',
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
        },
        '& pre': {
            backgroundColor: 'grey.100',
            padding: 2,
            borderRadius: 1,
            overflow: 'auto',
            '& code': {
                backgroundColor: 'transparent',
                padding: 0,
            },
        },
        '& a': {
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 1,
        },
        '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 2,
        },
        '& th, & td': {
            border: '1px solid #ddd',
            padding: 1,
            textAlign: 'left',
        },
        '& th': {
            backgroundColor: 'grey.100',
            fontWeight: 600,
        },
    };

    if (loading) {
        return <LoadingPage />;
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/my-blog')}
                >
                    Back to My Posts
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link
                    component={RouterLink}
                    to="/"
                    underline="hover"
                    color="inherit"
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                </Link>
                <Link
                    component={RouterLink}
                    to="/my-blog"
                    underline="hover"
                    color="inherit"
                >
                    My Posts
                </Link>
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <EditIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Edit Post
                </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                        Edit Post
                    </Typography>
                    {post && getStatusChip(post.status)}
                </Box>

                <Typography variant="body1" color="text.secondary">
                    Make changes to your post. {post?.status?.toUpperCase() === 'PENDING' && 'Changes may require re-approval.'}
                </Typography>
            </Box>

            {/* Status Alerts */}
            {post?.status?.toUpperCase() === 'REJECTED' && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    This post was rejected. Please review any feedback and make necessary changes before resubmitting.
                </Alert>
            )}

            {post?.status?.toUpperCase() === 'UPDATING' && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    This post is currently being updated. Your changes are being processed.
                </Alert>
            )}

            {/* Edit Form */}
            <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Left Column - Form */}
                <Box sx={{ flex: 1 }}>
                    <Paper elevation={2} sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Title Field */}
                            <TextField
                                label="Title"
                                fullWidth
                                value={formData.title}
                                onChange={handleInputChange('title')}
                                error={!!formErrors.title}
                                helperText={formErrors.title || 'Enter a compelling title for your post'}
                                variant="outlined"
                                required
                            />

                            {/* Content Field with Tabs */}
                            <Box>
                                <Tabs value={contentTab} onChange={handleContentTabChange} sx={{ mb: 2 }}>
                                    <Tab
                                        label="Edit"
                                        icon={<CodeIcon />}
                                        iconPosition="start"
                                    />
                                    <Tab
                                        label="Preview"
                                        icon={<PreviewIcon />}
                                        iconPosition="start"
                                    />
                                </Tabs>

                                {contentTab === 0 ? (
                                    <TextField
                                        label="Content (Markdown)"
                                        fullWidth
                                        multiline
                                        rows={20}
                                        value={formData.content}
                                        onChange={handleInputChange('content')}
                                        error={!!formErrors.content}
                                        helperText={formErrors.content || 'Write your blog post content using Markdown syntax'}
                                        variant="outlined"
                                        required
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                fontFamily: 'monospace',
                                                fontSize: '0.875rem',
                                            }
                                        }}
                                    />
                                ) : (
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 3,
                                            minHeight: 500,
                                            maxHeight: 500,
                                            overflow: 'auto',
                                            backgroundColor: 'background.paper',
                                            ...markdownStyles
                                        }}
                                    >
                                        {formData.content ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {formData.content}
                                            </ReactMarkdown>
                                        ) : (
                                            <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                No content to preview. Start writing in the Edit tab.
                                            </Typography>
                                        )}
                                    </Paper>
                                )}
                            </Box>

                            {/* Thumbnail Field */}
                            <TextField
                                label="Thumbnail URL"
                                fullWidth
                                value={formData.thumbnail}
                                onChange={handleInputChange('thumbnail')}
                                error={!!formErrors.thumbnail}
                                helperText={formErrors.thumbnail || 'Optional: Enter a URL for the post thumbnail image'}
                                variant="outlined"
                                placeholder="https://example.com/image.jpg"
                            />

                            <Divider />

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                    disabled={saving}
                                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* Right Column - Info and Preview */}
                <Box sx={{ width: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Thumbnail Preview */}
                    {formData.thumbnail && isValidUrl(formData.thumbnail) && (
                        <Paper elevation={1} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Thumbnail Preview
                            </Typography>
                            <Box
                                component="img"
                                src={formData.thumbnail}
                                alt="Thumbnail preview"
                                sx={{
                                    width: '100%',
                                    height: 200,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    border: '1px solid #ddd'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </Paper>
                    )}

                    {/* Markdown Help */}
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Markdown Guide
                        </Typography>
                        <Box sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                            <Typography variant="body2" gutterBottom>
                                <strong># Heading 1</strong><br />
                                <strong>## Heading 2</strong><br />
                                <strong>**Bold text**</strong><br />
                                <strong>*Italic text*</strong><br />
                                <strong>[Link](url)</strong><br />
                                <strong>![Image](url)</strong><br />
                                <strong>- List item</strong><br />
                                <strong>1. Numbered item</strong><br />
                                <strong>`code`</strong><br />
                                <strong>```code block```</strong><br />
                                <strong>&gt; Quote</strong>
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Post Info */}
                    {post && (
                        <Paper elevation={1} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Post Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Created:</strong> {new Date(post.created_at).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Last Updated:</strong> {new Date(post.updated_at).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Status:</strong> {post.status || 'Unknown'}
                                </Typography>
                            </Box>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default EditBlogPage;