import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Box,
    IconButton,
    CircularProgress,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import ReportIcon from '@mui/icons-material/Report';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { generateSlug } from '../../utils/slugUtils';
import MarkdownRenderer from './MarkdownRenderer';

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

    // Updated status chip handler to match API constants
    const getStatusChip = (status) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED':
                return (
                    <Chip
                        label="Approved"
                        color="success"
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                    />
                );
            case 'PENDING':
                return (
                    <Chip
                        label="Pending Review"
                        color="warning"
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                    />
                );
            case 'REJECTED':
                return (
                    <Chip
                        label="Rejected"
                        color="error"
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                    />
                );
            case 'UPDATING':
                return (
                    <Chip
                        label="Updating"
                        color="info"
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                    />
                );
            default:
                return (
                    <Chip
                        label="Draft"
                        color="default"
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                    />
                );
        }
    };

    // Format dates
    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Get created and updated dates
    const createdDate = formatDate(post.created_at);
    const updatedDate = formatDate(post.updated_at);
    const wasUpdated = post.created_at !== post.updated_at;

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
                    height: 220,
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
                    {/* Top section - Status chip and title */}
                    <Box>
                        {/* Status chip at the top */}
                        <Box sx={{ mb: 1 }}>
                            {getStatusChip(post.status)}
                        </Box>

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

                        {/* Subtitle - Markdown Preview */}
                        <Box sx={{
                            fontSize: '0.95rem',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}>
                            <MarkdownRenderer
                                content={post.content?.substring(0, 120) + '...' || "No content provided."}
                                sx={{
                                    '& p': { margin: 0 },
                                    '& h1, & h2, & h3, & h4, & h5, & h6': { margin: 0, fontSize: 'inherit' },
                                    '& *': { fontSize: 'inherit', lineHeight: 'inherit' }
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Bottom section - Dates */}
                    <Box sx={{ mt: 'auto' }}>

                        {/* Date Information */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5
                        }}>
                            {/* Created Date */}
                            {createdDate && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}>
                                    <AccessTimeIcon
                                        sx={{
                                            fontSize: '0.8rem',
                                            color: '#999'
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#999',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        Created on: {createdDate}
                                    </Typography>
                                </Box>
                            )}

                            {/* Updated Date - Only show if different from created */}
                            {wasUpdated && updatedDate && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}>
                                    <EditCalendarIcon
                                        sx={{
                                            fontSize: '0.8rem',
                                            color: '#666'
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#666',
                                            fontSize: '0.75rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        Updated on: {updatedDate}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Right side - Image */}
                <Box sx={{
                    width: 220,
                    height: '100%',
                    position: 'relative',
                    flexShrink: 0,
                    borderLeft: '1px solid rgba(0,0,0,0.06)',
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