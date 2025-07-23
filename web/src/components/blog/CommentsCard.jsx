import React from 'react';
import { Box, Avatar, Typography, IconButton, Stack } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CommentCard = ({ comment, onReplyClick }) => {
    const user = comment.users || {};
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                bgcolor: '#fff',
                borderRadius: 4,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                p: 2.5,
                pr: 3,
                mb: 3,
                border: '1px solid #f0f0f0',
            }}
        >
            <Avatar
                src={user.avatar || 'https://ui-avatars.com/api/?name=User'}
                alt="avatar"
                sx={{ width: 48, height: 48, mr: 2 }}
            />
            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography fontWeight={600} color="#222" sx={{ mr: 1 }}>
                        {user.first_name} {user.last_name}
                    </Typography>
                    <Typography color="#bbb" sx={{ mx: 0.5 }}>
                        •
                    </Typography>
                    <Typography color="#888" fontSize="0.95em">
                        {formatDate(comment.created_at)}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton size="small" sx={{ color: '#888' }}>
                        <MoreHorizIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Typography sx={{ my: 1, fontSize: '1.08em', color: '#222' }}>
                    {comment.content}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ color: '#666', fontSize: '1em', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <FavoriteBorderIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">2 likes</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={onReplyClick}>
                        <ChatBubbleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">Reply</Typography>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default CommentCard;
