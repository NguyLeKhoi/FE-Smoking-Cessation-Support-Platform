import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Box,
    Avatar,
    IconButton,
    Tooltip,
    CircularProgress,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import ReportIcon from '@mui/icons-material/Report';
import { generateSlug } from '../../utils/slugUtils';

const MyBlogCard = ({
    post,
    index,
    userData,
    onEdit,
    onDelete,
    deleteLoading,
    selectedPostId,
    showEditDelete = false
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setAnchorEl(null);
    };

    const handleEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleMenuClose();
        onEdit(post.id);
    };

    const handleDelete = (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleMenuClose();
        onDelete(post.id);
    };

    const handleShare = (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleMenuClose();
        // Handle share functionality
        console.log('Share post:', post.id);
    };

    const handleReport = (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleMenuClose();
        // Handle report functionality
        console.log('Report post:', post.id);
    };

    const postDate = post.publishDate || post.created_at
        ? new Date(post.publishDate || post.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
        : `${4}d ago`;

    const authorName = post.first_name || post.last_name
        ? `${post.first_name || ''} ${post.last_name || ''}`
        : userData
            ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || "Me"
            : "Zerotine Author";

    return (
        <>
            <Card
                component={RouterLink}
                to={post.id ? `/blog/${post.id}` : `/blog/${post.slug || generateSlug(post.title) || 'post'}`}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: 180,
                    bgcolor: 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textDecoration: 'none',
                    position: 'relative',
                    border: '1px solid rgba(0,0,0,0.06)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                }}
            >
                {/* Left side - Content */}
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 3,
                    pr: 2
                }}>
                    {/* Title */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: '#333',
                            fontSize: '1.4rem',
                            lineHeight: 1.2,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {post.title || "Untitled Post"}
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#666',
                            fontSize: '0.95rem',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 2,
                            flex: 1
                        }}
                    >
                        {post.content?.substring(0, 120) + '...' || "No content provided."}
                    </Typography>

                    {/* Bottom section - Date */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 'auto'
                    }}>
                        {/* Date */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#999',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {postDate}
                            </Typography>

                            {post.achievement_id && (
                                <Tooltip title="Author Achievement">
                                    <EmojiEventsIcon
                                        fontSize="small"
                                        sx={{
                                            color: 'gold',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Right side - Image */}
                <Box sx={{
                    width: 250,
                    height: '100%',
                    position: 'relative',
                    flexShrink: 0
                }}>
                    <CardMedia
                        component="img"
                        image={post.thumbnail || `https://source.unsplash.com/random/600x400?smoking-cessation&sig=${index}`}
                        alt={post.title}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />

                    {/* Action buttons overlay */}
                    <Box sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>

                        <IconButton
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(4px)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,1)'
                                }
                            }}
                            onClick={handleMenuClick}
                        >
                            <MoreHorizIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Card>

            {/* Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        minWidth: 180,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        borderRadius: '8px',
                        mt: 1
                    }
                }}
            >
                <MenuItem onClick={handleShare}>
                    <ListItemIcon>
                        <ShareIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Share</ListItemText>
                </MenuItem>

                {showEditDelete && (
                    <>
                        <Divider />
                        <MenuItem onClick={handleEdit}>
                            <ListItemIcon>
                                <EditIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText>Edit Post</ListItemText>
                        </MenuItem>

                        <MenuItem
                            onClick={handleDelete}
                            disabled={deleteLoading && selectedPostId === post.id}
                        >
                            <ListItemIcon>
                                {deleteLoading && selectedPostId === post.id ? (
                                    <CircularProgress size={16} color="error" />
                                ) : (
                                    <DeleteIcon fontSize="small" color="error" />
                                )}
                            </ListItemIcon>
                            <ListItemText>
                                {deleteLoading && selectedPostId === post.id ? 'Deleting...' : 'Delete Post'}
                            </ListItemText>
                        </MenuItem>
                    </>
                )}

                {!showEditDelete && (
                    <>
                        <Divider />
                        <MenuItem onClick={handleReport}>
                            <ListItemIcon>
                                <ReportIcon fontSize="small" color="warning" />
                            </ListItemIcon>
                            <ListItemText>Report</ListItemText>
                        </MenuItem>
                    </>
                )}
            </Menu>
        </>
    );
};

export default MyBlogCard;