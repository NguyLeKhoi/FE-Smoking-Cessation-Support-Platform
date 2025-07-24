import React from 'react';
import { Box, Avatar, Typography, IconButton, Stack, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import commentsService from '../../services/commentsService';
import { jwtDecode } from 'jwt-decode';

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CommentCard = ({ comment, onReplyClick, onDelete, replyCount }) => {
    const user = comment.users || {};
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    // Get current user id from JWT
    let currentUserId = null;
    try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decoded = jwtDecode(token);
            currentUserId = decoded.id || decoded.user_id || decoded.sub;
        }
    } catch (e) {
        currentUserId = null;
    }
    // Check if comment.user_id matches current user
    const isAuthor = currentUserId && comment.user_id && String(currentUserId) === String(comment.user_id);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleDelete = async () => {
        handleMenuClose();
        try {
            await commentsService.deleteComment(comment.id);
            if (onDelete) onDelete();
        } catch (e) {
            // Error toast handled in service
        }
    };

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
                    <IconButton size="small" sx={{ color: '#888' }} onClick={handleMenuOpen} disabled={!isAuthor}>
                        <MoreHorizIcon fontSize="small" />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        sx={{
                            '& .MuiPaper-root': {
                                borderRadius: '10px',
                            },
                        }}
                    >
                        {isAuthor && (
                            <MenuItem
                                onClick={handleDelete}
                                sx={{
                                    '&:hover': {
                                        fontWeight: 500,
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        borderRadius: '10px',
                                        color: '#E55050'
                                    },
                                }}
                            >
                                Delete comment
                            </MenuItem>
                        )}
                    </Menu>

                </Box>
                <Typography sx={{ my: 1, fontSize: '1.08em', color: '#222' }}>
                    {comment.content}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ color: '#666', fontSize: '1em', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }} onClick={onReplyClick}>
                        <ChatBubbleOutlineIcon fontSize="small" sx={{ mr: 0.5, width: '15px', height: '15px' }} />
                        <Typography variant="body2">Reply</Typography>
                        {replyCount > 0 && (
                            <Box component="span" sx={{
                                ml: 0.5,
                                px: 1,
                                fontSize: '0.8em',
                                bgcolor: '#f0f0f0',
                                color: '#555',
                                borderRadius: '8px',
                                fontWeight: 600,
                                display: 'inline-block',
                                minWidth: 18,
                                textAlign: 'center',
                            }}>{replyCount}</Box>
                        )}
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default CommentCard;
