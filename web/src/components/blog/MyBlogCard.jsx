import React from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Box,
    Avatar,
    IconButton,
    Tooltip,
    CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

                {/* Bottom section - Author and Date */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 'auto'
                }}>
                    {/* Author info */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        {(post.avatar || userData?.avatar) ? (
                            <Avatar
                                src={post.avatar || userData?.avatar}
                                alt={authorName}
                                sx={{
                                    width: 24,
                                    height: 24,
                                    border: post.achievement_id ? '1px solid gold' : 'none'
                                }}
                            />
                        ) : (
                            <Avatar
                                sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: '#f0f0f0',
                                    color: '#555',
                                    fontSize: '0.7rem',
                                    border: post.achievement_id ? '1px solid gold' : 'none'
                                }}
                            >
                                {authorName ? authorName.charAt(0) : 'Z'}
                            </Avatar>
                        )}

                        <Typography
                            variant="body2"
                            sx={{
                                color: '#666',
                                fontWeight: 500,
                                fontSize: '0.85rem'
                            }}
                        >
                            {authorName}
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

                    {/* Date */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#999',
                            fontSize: '0.85rem'
                        }}
                    >
                        {postDate}
                    </Typography>
                </Box>
            </Box>

            {/* Right side - Image */}
            <Box sx={{
                width: 220,
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
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle bookmark
                        }}
                    >
                        <BookmarkBorderIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(4px)',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,1)'
                            }
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle more options
                        }}
                    >
                        <MoreHorizIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Edit/delete buttons - only show if showEditDelete is true */}
                {showEditDelete && (
                    <Box sx={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        display: 'flex',
                        gap: 1,
                        zIndex: 10
                    }}>
                        <IconButton
                            size="small"
                            color="primary"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(4px)'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onEdit(post.id);
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            size="small"
                            color="error"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(4px)'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(post.id);
                            }}
                            disabled={deleteLoading && selectedPostId === post.id}
                        >
                            {deleteLoading && selectedPostId === post.id ?
                                <CircularProgress size={16} color="error" /> :
                                <DeleteIcon fontSize="small" />
                            }
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Card>
    );
};

export default MyBlogCard;