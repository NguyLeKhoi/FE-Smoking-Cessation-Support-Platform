import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography
} from '@mui/material';
import { motion } from 'framer-motion';

const CustomCard = ({ image, title, subtitle, author, duration }) => {
    return (
        <motion.div
            whileHover={{
                y: -15,
                transition: { duration: 0.2 }
            }}
            style={{ height: '100%' }}
        >
            <Card sx={{
                borderRadius: 0,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'primary.main',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                // backgroundColor: 'background.default'
            }}>
                <motion.div
                    // whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <CardMedia
                        component="img"
                        height="300"
                        image={image}
                        alt={title}
                        sx={{ objectFit: 'cover' }}
                    />
                </motion.div>
                <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 2,
                    height: '100%'
                }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            textTransform: 'uppercase',
                            lineHeight: 1.2,
                            color: 'primary.main'
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.primary',
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
                            textTransform: 'uppercase',
                            mt: 'auto'
                        }}
                    >
                        {`Text: ${author} • Duration: ${duration}`}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CustomCard;
