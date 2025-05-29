import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Divider
} from '@mui/material';
import Banner3 from '../assets/banner3.jpg';
import Banner4 from '../assets/banner4.png';
import Banner5 from '../assets/banner5.jpg';

const Blog = () => {
    const articleTemplate = {
        image: Banner3,
        title: "Understanding Nicotine Addiction",
        subtitle: "A comprehensive look at how nicotine affects the brain and why quitting can be challenging. Learn about the science behind addiction...",
        date: "MAR 22",
        author: "DR. SARAH"
    };

    const articles = Array(6).fill(articleTemplate);

    return (
        <Box sx={{ backgroundColor: '#FAF8F5', py: 8 }}>
            <Container maxWidth="lg">
                {/* Section Title */}
                <Typography
                    variant="h2"
                    sx={{ fontWeight: 600, mb: 3, textTransform: 'uppercase' }}
                >
                    Cessation access and support
                </Typography>

                {/* Banner Image */}
                <Card sx={{ borderRadius: 2, overflow: 'hidden', mb: 6 }}>
                    <CardMedia
                        component="img"
                        height="450"
                        image={Banner5}
                        alt="Smoking Cessation"
                    />
                </Card>

                {/* Section Subtitle */}
                <Typography variant="h4" sx={{ fontWeight: 500, mb: 4 }}>
                    An effective approach to supporting folks looking to improve their smoking habit and their health.
                </Typography>

                {/* Divider */}
                <Divider sx={{ my: 4 }} />

                {/* Articles Section */}
                <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                    {articles.map((article, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index} sx={{
                            width: { md: 'calc(33.333% - 16px)' },
                            minWidth: { md: 'calc(33.333% - 16px)' },
                            maxWidth: { md: 'calc(33.333% - 16px)' }
                        }}>
                            <Card sx={{
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: 1,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={article.image}
                                    alt={article.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%'
                                }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 1,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            lineHeight: 1.3
                                        }}
                                    >
                                        {article.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            mb: 1,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            flexGrow: 1
                                        }}
                                    >
                                        {article.subtitle}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'text.secondary',
                                            textTransform: 'uppercase',
                                            mt: 'auto'
                                        }}
                                    >
                                        {article.date} • {article.author}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Blog;