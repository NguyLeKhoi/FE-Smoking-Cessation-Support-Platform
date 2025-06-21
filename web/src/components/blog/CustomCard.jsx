import React from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Box,
    Avatar,
    Tooltip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const CustomCard = ({
    image,
    title,
    subtitle,
    author,
    authorAvatar,
    achievement,
    date,
    slug
}) => {
    return (
        <Card
            component={RouterLink}
            to={`/blog/${slug || 'post'}`}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                maxWidth: 360,
                minWidth: 360,
                minHeight: 350,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'none',
                textDecoration: 'none',
                position: 'relative',
                transition: 'transform 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-6px)'
                }
            }}
        >
            {/* Image Container */}
            <Box sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                mb: 2,
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.04)'
            }}>
                <CardMedia
                    component="img"
                    image={image}
                    alt={title}
                    sx={{
                        height: 230,
                        objectFit: 'cover'
                    }}
                />
            </Box>

            {/* Date and Author */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1,
                mb: 1.5,
                flexWrap: 'wrap'
            }}>
                {/* Date */}
                <Typography
                    variant="body2"
                    sx={{
                        color: '#9E9E9E',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    {date}
                </Typography>

                {/* Dot separator */}
                <Box
                    component="span"
                    sx={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        bgcolor: '#D0D0D0'
                    }}
                />

                {/* Author with Avatar */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    ml: 0
                }}>
                    {authorAvatar ? (
                        <Avatar
                            src={authorAvatar}
                            alt={author}
                            sx={{
                                width: 20,
                                height: 20,
                                border: achievement ? '1px solid gold' : 'none'
                            }}
                        />
                    ) : (
                        <Avatar
                            sx={{
                                width: 20,
                                height: 20,
                                bgcolor: '#f0f0f0',
                                color: '#555',
                                fontSize: '0.65rem',
                                border: achievement ? '1px solid gold' : 'none'
                            }}
                        >
                            {author ? author.charAt(0) : 'Z'}
                        </Avatar>
                    )}

                    <Typography
                        variant="body2"
                        sx={{
                            color: '#9E9E9E',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {author}
                    </Typography>

                    {/* Achievement icon */}
                    {achievement && (
                        <Tooltip title="Author Achievement">
                            <EmojiEventsIcon
                                fontSize="small"
                                sx={{
                                    color: 'gold',
                                    fontSize: '1rem',
                                    ml: -0.5
                                }}
                            />
                        </Tooltip>
                    )}
                </Box>
            </Box>

            {/* Title */}
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '1.2rem',
                    lineHeight: 1.3,
                    mb: 1.5
                }}
            >
                {title}
            </Typography>

            {/* Subtitle */}
            <Typography
                variant="body1"
                sx={{
                    color: '#555',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 1
                }}
            >
                {subtitle}
            </Typography>
        </Card>
    );
};

export default CustomCard;
