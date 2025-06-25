import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Button,
    Alert,
    Card,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import postService from '../../services/postService';
import { toast } from 'react-toastify';
import LoadingPage from '../../pages/LoadingPage';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';
import { fetchCurrentUser, fetchCurrentUserPosts } from '../../services/userService';
import MyBlogCard from '../../components/blog/MyBlogCard';

const MyBlogPage = () => {
    const navigate = useNavigate();

    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [userData, setUserData] = useState(null);

    // Edit functionality state
    const [editLoading, setEditLoading] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        content: '',
        thumbnail: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // 1. Fetch the current user data for the sidebar
                const currentUserResponse = await fetchCurrentUser();
                console.log("Current user response:", currentUserResponse);

                if (currentUserResponse && currentUserResponse.data) {
                    setUserData(currentUserResponse.data);
                }

                // 2. Fetch the current user's posts directly from the API
                const postsResponse = await fetchCurrentUserPosts();
                console.log("Current user posts response:", postsResponse);

                let userPosts = [];
                if (Array.isArray(postsResponse)) {
                    userPosts = postsResponse;
                } else if (postsResponse && Array.isArray(postsResponse.data)) {
                    userPosts = postsResponse.data;
                }

                console.log(`Found ${userPosts.length} posts for the current user:`, userPosts);
                setUserPosts(userPosts);

            } catch (error) {
                console.error('Failed to fetch user posts:', error);
                setError(`Failed to load your blog posts: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleCreatePost = () => {
        navigate('/blog/create');
    };

    const handleEditPost = (postId) => {
        const post = userPosts.find(p => p.id === postId);
        if (post) {
            setEditingPost(post);
            setEditFormData({
                title: post.title || '',
                content: post.content || '',
                thumbnail: post.thumbnail || ''
            });
            setEditDialogOpen(true);
        }
    };

    const handleUpdatePost = async () => {
        if (!editingPost || !editFormData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        try {
            setEditLoading(true);

            // Call the updatePost API
            const updatedPost = await postService.updatePost(editingPost.id, editFormData);

            // Update the posts array with the updated post
            setUserPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === editingPost.id ? { ...post, ...updatedPost } : post
                )
            );

            toast.success('Post updated successfully!');
            handleEditDialogClose();

        } catch (error) {
            console.error('Failed to update post:', error);
        } finally {
            setEditLoading(false);
        }
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditingPost(null);
        setEditFormData({
            title: '',
            content: '',
            thumbnail: ''
        });
    };

    const handleEditFormChange = (field) => (event) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleDeletePost = async (postId) => {
        try {
            setSelectedPostId(postId);
            setDeleteLoading(true);

            await postService.deletePost(postId);

            // Remove the deleted post from the list
            setUserPosts(userPosts.filter(post => post.id !== postId));

        } catch (error) {
            console.error('Failed to delete post:', error);
            toast.error('Failed to delete post. Please try again.');
        } finally {
            setSelectedPostId(null);
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return <LoadingPage />;
    }

    // Content to be displayed
    const content = (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            {/* Create New Post Button positioned at top right */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mb: 3
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreatePost}
                >
                    Create New Post
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!error && userPosts.length === 0 && (
                <Card sx={{ p: 4, textAlign: 'center', mb: 2 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        You haven't created any blog posts yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Share your knowledge and experiences with the community by creating your first post.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreatePost}
                    >
                        Create Your First Post
                    </Button>
                </Card>
            )}

            {/* Horizontal Blog Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {userPosts.map((post, index) => (
                    <MyBlogCard
                        key={post.id || index}
                        post={post}
                        index={index}
                        userData={userData}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                        deleteLoading={deleteLoading}
                        selectedPostId={selectedPostId}
                        showEditDelete={true}
                    />
                ))}
            </Box>

            {/* Edit Post Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={handleEditDialogClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Post</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={editFormData.title}
                            onChange={handleEditFormChange('title')}
                            variant="outlined"
                            required
                            error={!editFormData.title.trim()}
                            helperText={!editFormData.title.trim() ? 'Title is required' : ''}
                        />

                        <TextField
                            label="Content"
                            fullWidth
                            multiline
                            rows={6}
                            value={editFormData.content}
                            onChange={handleEditFormChange('content')}
                            variant="outlined"
                        />

                        <TextField
                            label="Thumbnail URL"
                            fullWidth
                            value={editFormData.thumbnail}
                            onChange={handleEditFormChange('thumbnail')}
                            variant="outlined"
                            helperText="Enter a URL for the post thumbnail image (optional)"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleEditDialogClose}
                        disabled={editLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdatePost}
                        variant="contained"
                        disabled={editLoading || !editFormData.title.trim()}
                    >
                        {editLoading ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Updating...
                            </>
                        ) : (
                            'Update Post'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );

    // Render with profile layout
    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            bgcolor: 'background.default',
            overflow: 'visible'
        }}>
            {/* Pass userData to the ProfileSidebar */}
            <ProfileSidebar userData={userData} />

            {/* Main content */}
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                color: 'text.primary',
                overflowY: 'auto'
            }}>
                {content}
            </Box>
        </Box>
    );
};

export default MyBlogPage;