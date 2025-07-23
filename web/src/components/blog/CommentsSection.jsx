import React, { useState, useEffect } from 'react';
import postService from '../../services/postService';
import commentsService from '../../services/commentsService';
import CommentCard from './CommentsCard';
import { Box, Typography, Button, Avatar, TextField, Stack, CircularProgress } from '@mui/material';

function CommentsSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

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
                    Top comments ({comments.length})
                </Typography>
                <Button variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none' }}>
                    Subscribe
                </Button>
            </Box>
            {/* Add comment */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <Avatar src="https://ui-avatars.com/api/?name=You" alt="avatar" sx={{ width: 40, height: 40, mr: 2 }} />
                <TextField
                    multiline
                    minRows={2}
                    placeholder="Add to the discussion"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    sx={{ flex: 1, mr: 2 }}
                    size="small"
                    disabled={submitting}
                />
                <Button
                    variant="contained"
                    onClick={handleAddComment}
                    sx={{ borderRadius: 2, minWidth: 80 }}
                    disabled={submitting || !newComment.trim()}
                >
                    {submitting ? <CircularProgress size={20} color="inherit" /> : 'Post'}
                </Button>
            </Box>
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
