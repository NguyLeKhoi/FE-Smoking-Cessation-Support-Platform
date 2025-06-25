import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
    Breadcrumbs,
    Link,
    Divider,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import PreviewIcon from '@mui/icons-material/Preview';
import CodeIcon from '@mui/icons-material/Code';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import postService from '../../services/postService';
import { toast } from 'react-toastify';

const CreateBlogPage = () => {
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        thumbnail: '',
        type: '' // Added type field
    });
    const [formErrors, setFormErrors] = useState({});
    const [contentTab, setContentTab] = useState(0); // 0 = Edit, 1 = Preview

    // Post type options - Updated to match your constants
    const postTypes = [
        { value: 'health_benefits', label: 'Health Benefits' },
        { value: 'success_stories', label: 'Success Stories' },
        { value: 'tools_and_tips', label: 'Tools & Tips' },
        { value: 'smoking_dangers', label: 'Smoking Dangers' },
        { value: 'support_resources', label: 'Support Resources' },
        { value: 'news_and_research', label: 'News & Research' }
    ];

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear field error when user starts typing/selecting
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

        if (!formData.type) {
            errors.type = 'Post type is required';
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

    const handleCreate = async () => {
        if (!validateForm()) {
            toast.error('Please fix the form errors before creating');
            return;
        }

        try {
            setSaving(true);

            // Call the createPost API
            const newPost = await postService.createPost(formData);
            console.log('Post created successfully:', newPost);

            // Navigate back to blog list page
            navigate('/my-blog');

        } catch (error) {
            console.error('Failed to create post:', error);
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

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: 'background.paper',
            py: 4
        }}>
            <Container maxWidth="lg">
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
                        <CreateIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Create Post
                    </Typography>
                </Breadcrumbs>

                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 2 }}>
                        Create New Post
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Share your knowledge and experiences with the community using Markdown formatting.
                    </Typography>
                </Box>

                {/* Create Form */}
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* Left Column - Form */}
                    <Box sx={{ flex: 1 }}>
                        <Paper elevation={2} sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Title and Type Fields Row */}
                                <Box sx={{ display: 'flex', gap: 2 }}>
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
                                        sx={{ flex: 2 }}
                                    />

                                    {/* Post Type Field */}
                                    <FormControl
                                        variant="outlined"
                                        required
                                        error={!!formErrors.type}
                                        sx={{ flex: 1, minWidth: 200 }}
                                    >
                                        <InputLabel>Post Type</InputLabel>
                                        <Select
                                            value={formData.type}
                                            onChange={handleInputChange('type')}
                                            label="Post Type"
                                        >
                                            {postTypes.map((type) => (
                                                <MenuItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {formErrors.type || 'Select the category for your post'}
                                        </FormHelperText>
                                    </FormControl>
                                </Box>

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
                                        onClick={handleCreate}
                                        disabled={saving}
                                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                                    >
                                        {saving ? 'Creating...' : 'Create Post'}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Right Column - Info and Preview */}
                    <Box sx={{ width: 350, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Current Selection Info */}
                        {formData.type && (
                            <Paper elevation={1} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Post Category
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Selected:</strong> {postTypes.find(type => type.value === formData.type)?.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    This helps other users find your content more easily.
                                </Typography>
                            </Paper>
                        )}

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

                        {/* Publishing Info */}
                        <Paper elevation={1} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Publishing Info
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Status:</strong> Your post will be submitted for review
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Visibility:</strong> Public after approval
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Format:</strong> Markdown supported
                                </Typography>
                            </Box>
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Your post will be reviewed before being published to ensure it meets our community guidelines.
                            </Alert>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CreateBlogPage;