import React, { useEffect, useState } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Box, Typography, Stack } from '@mui/material';
import reactionsService from '../../services/reactionsService';
import postService from '../../services/postService';
import { jwtDecode } from 'jwt-decode';

const PostReactions = ({ postId }) => {
    const [counts, setCounts] = useState({ LOVE: 0, LIKE: 0 });
    const [userReactions, setUserReactions] = useState({ LOVE: null, LIKE: null });
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Extract user id from JWT accessToken
    useEffect(() => {
        try {
            const token = localStorage.getItem('accessToken');
            if (typeof token === 'string' && token) {
                const decoded = jwtDecode(token);
                setCurrentUserId(decoded.id || decoded.user_id || decoded.sub);
            } else {
                setCurrentUserId(null);
            }
        } catch (e) {
            setCurrentUserId(null);
        }
    }, []);

    const fetchCounts = async () => {
        setLoading(true);
        try {
            const data = await postService.getReactionsByPostId(postId);
            const reactions = Array.isArray(data) ? data : data?.data || [];
            const love = reactions.filter(r => r.type === 'LOVE').length;
            const like = reactions.filter(r => r.type === 'LIKE').length;
            // Find if current user has reacted
            const userLove = reactions.find(r => r.type === 'LOVE' && String(r.user_id) === String(currentUserId));
            const userLike = reactions.find(r => r.type === 'LIKE' && String(r.user_id) === String(currentUserId));
            setCounts({ LOVE: love, LIKE: like });
            setUserReactions({
                LOVE: userLove ? userLove.id : null,
                LIKE: userLike ? userLike.id : null
            });
        } catch (e) {
            setCounts({ LOVE: 0, LIKE: 0 });
            setUserReactions({ LOVE: null, LIKE: null });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId && currentUserId) fetchCounts();
        // eslint-disable-next-line
    }, [postId, currentUserId]);

    const handleReact = async (type) => {
        try {
            if (userReactions[type]) {
                await reactionsService.deleteReaction(userReactions[type]);
                setUserReactions(prev => ({ ...prev, [type]: null }));
                setCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
            } else {
                await reactionsService.createReaction({ ref_id: postId, type });
                fetchCounts();
            }
        } catch (e) { }
    };

    return (
        <Stack direction="row" alignItems="center" spacing={2} sx={{ color: '#666', fontSize: '1em', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleReact('LOVE')}>
                {userReactions.LOVE ? (
                    <FavoriteIcon fontSize="small" sx={{ mr: 0.5, color: 'error.main' }} />
                ) : (
                    <FavoriteBorderIcon fontSize="small" sx={{ mr: 0.5 }} />
                )}
                <Typography variant="body2">Heart</Typography>
                <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>{loading ? '-' : counts.LOVE}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleReact('LIKE')}>
                {userReactions.LIKE ? (
                    <ThumbUpIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                ) : (
                    <ThumbUpOffAltIcon fontSize="small" sx={{ mr: 0.5 }} />
                )}
                <Typography variant="body2">Like</Typography>
                <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>{loading ? '-' : counts.LIKE}</Typography>
            </Box>
        </Stack>
    );
};

export default PostReactions;
