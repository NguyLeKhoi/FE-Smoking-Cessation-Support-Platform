import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Avatar,
    Chip,
    Tooltip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MarkdownRenderer from '../common/MarkdownRenderer';

const CustomCard = ({
    image,
    title,
    subtitle,
    author,
    authorAvatar,
    achievement,
    date,
    slug,
    id
}) => {
    return (
        <Card
            component={RouterLink}
            to={id ? `/blog/${id}` : `/blog/${slug}`}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                maxWidth: 300,
                minWidth: 330,
                minHeight: 350,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'none',
                textDecoration: 'none',
                position: 'relative',
                transition: 'transform 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-6px)'
                },
                width: '100%',
                mx: 'auto'
            }}
        >
            {/* Image Container */}
            <Box sx={{
                borderRadius: '20px',
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
                        height: 250,
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

            {/* Subtitle - Now using MarkdownRenderer */}
            <Box
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
                <MarkdownRenderer
                    content={subtitle?.substring(0, 120) + (subtitle?.length > 120 ? '...' : '') || "Learn effective strategies and supportive approaches."}
                    sx={{
                        // Override all markdown styles to match the original Typography styles
                        '& *': {
                            color: '#555 !important',
                            fontSize: '0.95rem !important',
                            lineHeight: '1.5 !important',
                            margin: '0 !important',
                            padding: '0 !important',
                            fontWeight: 'inherit !important',
                            textDecoration: 'none !important',
                            border: 'none !important',
                            background: 'none !important',
                            fontFamily: 'inherit !important'
                        },
                        '& p': {
                            margin: '0 !important',
                            padding: '0 !important',
                            display: 'inline !important'
                        },
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                            fontSize: '0.95rem !important',
                            fontWeight: 'inherit !important',
                            margin: '0 !important',
                            display: 'inline !important'
                        },
                        '& strong, & b': {
                            fontWeight: 'inherit !important'
                        },
                        '& em, & i': {
                            fontStyle: 'normal !important'
                        },
                        '& code': {
                            backgroundColor: 'transparent !important',
                            padding: '0 !important',
                            fontFamily: 'inherit !important',
                            fontSize: '0.95rem !important'
                        },
                        '& ul, & ol': {
                            margin: '0 !important',
                            padding: '0 !important',
                            listStyle: 'none !important'
                        },
                        '& li': {
                            margin: '0 !important',
                            padding: '0 !important',
                            display: 'inline !important'
                        },
                        '& blockquote': {
                            margin: '0 !important',
                            padding: '0 !important',
                            border: 'none !important',
                            fontStyle: 'normal !important'
                        },
                        '& a': {
                            color: '#555 !important',
                            textDecoration: 'none !important'
                        },
                        '& img': {
                            display: 'none !important'
                        },
                        '& table, & th, & td': {
                            display: 'none !important'
                        },
                        '& hr': {
                            display: 'none !important'
                        }
                    }}
                />
            </Box>
        </Card>
    );
};

export default CustomCard;
