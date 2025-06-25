import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Button,
    Alert,
    Card,
    Typography,
    Chip,
    Pagination,
    Stack
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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

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

                // Log the status field for debugging
                userPosts.forEach(post => {
                    console.log(`Post "${post.title}" has status: ${post.status}`);
                });

                console.log(`Found ${userPosts.length} posts for the current user:`, userPosts);
                setUserPosts(userPosts);

                // Reset to first page if current page is beyond available pages
                const totalPages = Math.ceil(userPosts.length / postsPerPage);
                if (currentPage > totalPages && totalPages > 0) {
                    setCurrentPage(1);
                }

            } catch (error) {
                console.error('Failed to fetch user posts:', error);
                setError(`Failed to load your blog posts: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentPage]);

    // Calculate pagination values
    const totalPages = Math.ceil(userPosts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = userPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Handle page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreatePost = () => {
        navigate('/blog/create');
    };

    // Navigate to edit page instead of opening modal
    const handleEditPost = (postId) => {
        navigate(`/blog/edit/${postId}`);
    };

    const handleDeletePost = async (postId) => {
        try {
            setSelectedPostId(postId);
            setDeleteLoading(true);

            await postService.deletePost(postId);

            // Remove the deleted post from the list
            const updatedPosts = userPosts.filter(post => post.id !== postId);
            setUserPosts(updatedPosts);

            // If deleted the last post on the current page, go to previous page
            const newTotalPages = Math.ceil(updatedPosts.length / postsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }

            toast.success('Post deleted successfully!');

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

    const content = (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            {/* Top Section - Posts Summary and Create Button */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 3,
                mt: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                {/* Posts Summary - Left Side */}
                {userPosts.length > 0 && (
                    <Box sx={{ flex: 1, minWidth: '300px' }}>
                        <Typography variant="h6" gutterBottom>
                            My Posts ({userPosts.length})
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Chip
                                label={`Approved: ${userPosts.filter(post => post.status?.toUpperCase() === 'APPROVED').length}`}
                                color="success"
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={`Pending: ${userPosts.filter(post => post.status?.toUpperCase() === 'PENDING').length}`}
                                color="warning"
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={`Rejected: ${userPosts.filter(post => post.status?.toUpperCase() === 'REJECTED').length}`}
                                color="error"
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={`Updating: ${userPosts.filter(post => post.status?.toUpperCase() === 'UPDATING').length}`}
                                color="info"
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                )}

                {/* Create New Post Button - Right Side */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreatePost}
                    sx={{ flexShrink: 0 }}
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

            {/* Pagination Info */}
            {userPosts.length > 0 && totalPages > 1 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        Showing {indexOfFirstPost + 1} - {Math.min(indexOfLastPost, userPosts.length)} of {userPosts.length} posts
                    </Typography>
                </Box>
            )}

            {/* Horizontal Blog Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, minHeight: '400px' }}>
                {currentPosts.map((post, index) => (
                    <Box key={post.id || index} sx={{ position: 'relative' }}>
                        <MyBlogCard
                            post={post}
                            index={indexOfFirstPost + index}
                            userData={userData}
                            onEdit={handleEditPost}
                            onDelete={handleDeletePost}
                            deleteLoading={deleteLoading}
                            selectedPostId={selectedPostId}
                            showEditDelete={true}
                        />
                    </Box>
                ))}
            </Box>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 4,
                    mb: 2
                }}>
                    <Stack spacing={2}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    fontSize: '1rem',
                                }
                            }}
                        />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                        >
                            Page {currentPage} of {totalPages}
                        </Typography>
                    </Stack>
                </Box>
            )}
        </Container>
    );

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