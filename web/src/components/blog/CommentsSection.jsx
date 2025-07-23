import React, { useState, useEffect } from 'react';
import postService from '../../services/postService';
import commentsService from '../../services/commentsService';
import CommentCard from './CommentsCard';
import { Box, Typography, Button, Avatar, TextField, Stack, CircularProgress } from '@mui/material';
import { fetchCurrentUser } from '../../services/userService';
import { useNavigate } from 'react-router-dom';

function CommentsSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const fetchComments = () => {
        setLoading(true);
        postService.getCommentsByPostId(postId)
            .then(data => {
                let commentsArray = [];
                if (Array.isArray(data)) {
                    commentsArray = data;
                } else if (Array.isArray(data?.data)) {
                    commentsArray = data.data;
                } else if (Array.isArray(data?.comments)) {
                    commentsArray = data.comments;
                }
                setComments(commentsArray);
                console.log('Fetched comments:', commentsArray);
            })
            .catch(() => setComments([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!postId) return;
        fetchComments();
        // eslint-disable-next-line
    }, [postId]);

    useEffect(() => {
        fetchCurrentUser()
            .then(res => {
                // Handle both {data: {...}} and {...}
                setCurrentUser(res?.data || res);
            })
            .catch(() => setCurrentUser(null));
    }, []);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            await commentsService.createComment({ content: newComment, post_id: postId });
            setNewComment('');
            fetchComments();
        } catch (e) {
            // Error toast handled in service
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ mt: 6 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
                    Comments ({comments.length})
                </Typography>
            </Box>
            {/* Add comment */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <Avatar
                    src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User'}
                    alt="avatar"
                    sx={{ width: 40, height: 40, mr: 2 }}
                />
                <TextField
                    multiline
                    minRows={2}
                    placeholder={
                        currentUser
                            ? "Add to the discussion"
                            : "Login to join the discussion"
                    }
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    sx={{ flex: 1, mr: 2 }}
                    size="small"
                    disabled={!currentUser || submitting}
                />
                <Button
                    variant="contained"
                    onClick={currentUser ? handleAddComment : () => navigate('/login')}
                    sx={{ borderRadius: 2, minWidth: 80 }}
                    disabled={!currentUser || submitting || !newComment.trim()}
                >
                    {currentUser
                        ? (submitting ? <CircularProgress size={20} color="inherit" /> : 'Post')
                        : 'Login now'}
                </Button>
            </Box>
            {!currentUser && (
                <Typography color="primary" sx={{ mb: 2, ml: 7, cursor: 'pointer' }} onClick={() => navigate('/login')}>
                    Login now to join the discussion!
                </Typography>
            )}
            {/* Comments list */}
            <Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={28} />
                    </Box>
                ) : comments.length === 0 ? (
                    <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                        No comments yet.
                    </Typography>
                ) : (
                    comments.map((comment, idx) => (
                        <CommentCard key={idx} comment={comment} />
                    ))
                )}
            </Box>
        </Box>
    );
}

export default CommentsSection;
