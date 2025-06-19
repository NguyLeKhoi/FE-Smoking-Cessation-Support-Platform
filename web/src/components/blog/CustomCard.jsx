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
            style={{ height: '100%' }}
        >
            <Card sx={{
                borderRadius: 3,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
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
                    flexBasis: '60%', // Takes 60% of card width
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 3,
                    height: '100%'
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: 'text.primary',
                            lineHeight: 1.2,
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            mb: 2,
                            lineHeight: 1.5,
                            flexGrow: 1
                        }}
                    >
                        {subtitle}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'secondary.main',
                            mt: 'auto',
                            fontSize: '0.75rem',
                            fontWeight: 'medium'
                        }}
                    >
                        {`Text: ${author} • Duration: ${duration}`}
                    </Typography>
                </CardContent>

                {/* Image (Right Side) */}
                <Box sx={{
                    flexBasis: '40%', // Takes 40% of card width
                    position: 'relative',
                    flexShrink: 0,
                    borderLeft: '1px solid',
                    borderColor: 'divider'
                }}>
                    <motion.div
                        transition={{ duration: 0.2 }}
                        style={{ height: '100%' }}
                    >
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
                    </motion.div>
                </Box>
            </Card>
        </motion.div>
    );
};

export default CustomCard;
