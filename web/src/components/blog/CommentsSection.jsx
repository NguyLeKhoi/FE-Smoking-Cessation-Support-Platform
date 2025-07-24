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
    const [replyTo, setReplyTo] = useState(null);
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
    }, [postId]);

    useEffect(() => {
        fetchCurrentUser()
            .then(res => {
                setCurrentUser(res?.data || res);
            })
            .catch(() => setCurrentUser(null));
    }, []);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            await commentsService.createComment({
                content: newComment,
                post_id: postId,
                parent_comment_id: replyTo ? replyTo.id : undefined
            });
            setNewComment('');
            setReplyTo(null);
            fetchComments();
        } catch (e) {
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = (comment) => {
        setReplyTo(prev => (prev && prev.id === comment.id ? null : comment));
    };

    const handleCancelReply = () => {
        setReplyTo(null);
    };

    const handleDeleteComment = (commentId) => {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
    };

    // Group comments by parent_comment_id
    const groupComments = (comments) => {
        const map = {};
        comments.forEach(comment => {
            const parentId = comment.parent_comment_id || null;
            if (!map[parentId]) map[parentId] = [];
            map[parentId].push(comment);
        });
        return map;
    };

    // Recursively render comments and their replies
    const renderComments = (parentId = null, level = 0) => {
        if (!commentsByParent[parentId]) return null;
        return commentsByParent[parentId].map((comment) => {
            const replies = commentsByParent[comment.id] || [];
            return (
                <Box key={comment.id} sx={{
                    ml: level * 4,
                    mt: level > 0 ? 1 : 0,
                    position: 'relative',
                    pl: level > 0 ? 2 : 0,
                    borderLeft: 'none',
                }}>
                    <CommentCard
                        comment={comment}
                        onDelete={() => handleDeleteComment(comment.id)}
                        onReplyClick={() => handleReply(comment)}
                        replyCount={replies.length}
                    />
                    {replyTo && replyTo.id === comment.id && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3, ml: 6 }}>
                            <Avatar
                                src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User'}
                                alt="avatar"
                                sx={{ width: 36, height: 36, mr: 2 }}
                            />
                            <TextField
                                multiline
                                minRows={2}
                                placeholder={
                                    currentUser
                                        ? `Reply to ${replyTo.users?.first_name || ''} ${replyTo.users?.last_name || ''}`
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
                            <Button size="small" onClick={handleCancelReply} sx={{ ml: 1, textTransform: 'none' }}>
                                Cancel
                            </Button>
                        </Box>
                    )}
                    {renderComments(comment.id, level + 1)}
                </Box>
            );
        });
    };

    // Memoize grouped comments for performance
    const commentsByParent = React.useMemo(() => groupComments(comments), [comments]);

    return (
        <Box sx={{ mt: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
                    Comments ({comments.length})
                </Typography>
            </Box>
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
                    value={!replyTo ? newComment : ''}
                    onChange={e => { if (!replyTo) setNewComment(e.target.value); }}
                    sx={{ flex: 1, mr: 2 }}
                    size="small"
                    disabled={!currentUser || submitting || !!replyTo}
                />
                <Button
                    variant="contained"
                    onClick={currentUser ? handleAddComment : () => navigate('/login')}
                    sx={{ borderRadius: 2, minWidth: 80 }}
                    disabled={!currentUser || submitting || !newComment.trim() || !!replyTo}
                >
                    {currentUser
                        ? (submitting && !replyTo ? <CircularProgress size={20} color="inherit" /> : 'Post')
                        : 'Login now'}
                </Button>
            </Box>
            {!currentUser && (
                <Typography color="primary" sx={{ mb: 2, ml: 7, cursor: 'pointer' }} onClick={() => navigate('/login')}>
                    Login now to join the discussion!
                </Typography>
            )}

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
                    renderComments()
                )}
            </Box>
        </Box>
    );
}

export default CommentsSection;
