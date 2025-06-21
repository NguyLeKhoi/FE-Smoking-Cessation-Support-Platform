import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    CircularProgress,
    Alert,
    Card,
    IconButton,
    Avatar
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomCard from '../../components/blog/CustomCard';
import postService from '../../services/postService';
import { generateSlug } from '../../utils/slugUtils';
import { toast } from 'react-toastify';
import LoadingPage from '../../pages/LoadingPage';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';
import { fetchCurrentUser, getUserById } from '../../services/userService';

const MyBlogPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hardcoded user ID to match the specific posts
    const SPECIFIC_USER_ID = "cd270e95-9d05-48aa-a78b-3b3e0e1e86a4";

    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [targetUser, setTargetUser] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // 1. Fetch the current user for the sidebar
                const userResponse = await fetchCurrentUser();
                if (userResponse && userResponse.data) {
                    setUserData(userResponse.data);
                }

                // 2. Try to get the specific target user details for the posts
                try {
                    const targetUserResponse = await getUserById(SPECIFIC_USER_ID);
                    if (targetUserResponse && targetUserResponse.data) {
                        setTargetUser(targetUserResponse.data);
                    }
                } catch (userError) {
                    console.warn('Could not fetch target user details, will still show posts', userError);
                }

                // 3. Get all posts
                const postsResponse = await postService.getAllPosts();

                let allPosts = [];
                if (Array.isArray(postsResponse)) {
                    allPosts = postsResponse;
                } else if (postsResponse && Array.isArray(postsResponse.data)) {
                    allPosts = postsResponse.data;
                }

                console.log("All posts:", allPosts);

                // 4. Filter posts by the specific user ID we want to show
                const filteredPosts = allPosts.filter(post => {
                    return String(post.user_id) === SPECIFIC_USER_ID;
                });

                console.log("Filtered posts for user ID:", SPECIFIC_USER_ID, filteredPosts);
                setUserPosts(filteredPosts);

            } catch (error) {
                console.error('Failed to fetch user posts:', error);
                setError('Failed to load the blog posts. Please try again later.');
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
        navigate(`/blog/edit/${postId}`);
    };

    const handleDeletePost = async (postId) => {
        try {
            setSelectedPostId(postId);
            setDeleteLoading(true);

            await postService.deletePost(postId);

            // Remove the deleted post from the list
            setUserPosts(userPosts.filter(post => post.id !== postId));
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

    // Content to be displayed
    const content = (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" fontWeight={700}>
                    My Posts
                </Typography>
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
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            {!error && userPosts.length === 0 && (
                <Card sx={{ p: 4, textAlign: 'center', mb: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No blog posts found for this user
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        There are no posts currently available from this author.
                    </Typography>
                </Card>
            )}

            <Grid container spacing={4}>
                {userPosts.map((post, index) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id || index}>
                        <Box sx={{ position: 'relative' }}>
                            <CustomCard
                                image={post.thumbnail || `https://source.unsplash.com/random/600x400?smoking-cessation&sig=${index}`}
                                title={post.title || "Untitled Post"}
                                subtitle={post.content?.substring(0, 120) + '...' || "No content provided."}
                                author={
                                    post.first_name || post.last_name
                                        ? `${post.first_name || ''} ${post.last_name || ''}`
                                        : targetUser
                                            ? `${targetUser.first_name || ''} ${targetUser.last_name || ''}`.trim()
                                            : "Zerotine Author"
                                }
                                authorAvatar={post.avatar || targetUser?.avatar || null}
                                achievement={post.achievement_id || null}
                                date={post.publishDate || post.created_at
                                    ? new Date(post.publishDate || post.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    }).toUpperCase()
                                    : `JUNE ${10 + index}`
                                }
                                slug={post.slug || (post.title && generateSlug(post.title)) || `post-${index}`}
                                id={post.id}
                            />

                            {/* Only show edit/delete buttons if this is the current user's post */}
                            {userData && userData.id === SPECIFIC_USER_ID && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    display: 'flex',
                                    gap: 1,
                                    zIndex: 10
                                }}>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleEditPost(post.id);
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>

                                    <IconButton
                                        size="small"
                                        color="error"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeletePost(post.id);
                                        }}
                                        disabled={deleteLoading && selectedPostId === post.id}
                                    >
                                        {deleteLoading && selectedPostId === post.id ?
                                            <CircularProgress size={20} color="error" /> :
                                            <DeleteIcon fontSize="small" />
                                        }
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                ))}
            </Grid>
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