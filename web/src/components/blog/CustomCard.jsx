import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box
} from '@mui/material';
import { motion } from 'framer-motion';

const CustomCard = ({ image, title, subtitle, author, duration }) => {
    return (
        <motion.div
            whileHover={{
                y: -10,
                transition: { duration: 0.2 }
            }}
        >
            <Card sx={{
                borderRadius: 3,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid',
                borderColor: 'divider',
                height: '200px',
                maxWidth: '470px',
                minWidth: '470px',
                display: 'flex',
                flexDirection: 'row',
                bgcolor: 'section.light',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0px 6px 25px rgba(0, 0, 0, 0.1)',
                },
                overflow: 'hidden'
            }}>
                {/* Text Content (Left Side) */}
                <CardContent sx={{
                    flexGrow: 1,
                    flexBasis: '60%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 2,
                    py: 2,
                    '&:last-child': { pb: 2 },
                    height: '100%'
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: 'text.primary',
                            fontSize: '0.95rem',
                            lineHeight: 1.2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            mb: 1,
                            lineHeight: 1.3,
                            fontSize: '0.8rem',
                            flexGrow: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {subtitle}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'secondary.main',
                            mt: 'auto',
                            fontSize: '0.7rem',
                            fontWeight: 'medium'
                        }}
                    >
                        {`Text: ${author} • Duration: ${duration}`}
                    </Typography>
                </CardContent>

                {/* Image (Right Side) */}
                <Box sx={{
                    flexBasis: '40%',
                    position: 'relative',
                    flexShrink: 0,
                    borderLeft: '1px solid',
                    borderColor: 'divider'
                }}>
                    <CardMedia
                        component="img"
                        image={image}
                        alt={title}
                        sx={{
                            objectFit: 'cover',
                            height: '100%',
                            width: '100%'
                        }}
                    />
                </Box>
            </Card>
        </motion.div>
    );
};

export default CustomCard;
