import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    Divider,
    Button
} from '@mui/material';
import Banner3 from '../assets/banner3.jpg';
import Banner5 from '../assets/banner5.jpg';
import CustomCard from '../components/layout/CustomCard';

const Blog = () => {
    const articleTemplate = {
        image: Banner3,
        title: "Understanding Nicotine Addiction",
        subtitle: "A comprehensive look at how nicotine affects the brain and why quitting can be challenging. Learn about the science behind addiction...",
        date: "MAR 22",
        author: "DR. SARAH",
        duration: "11min"
    };

    const articles = Array(6).fill(articleTemplate);

    return (
        <Box sx={{ backgroundColor: 'background.default', py: 8 }}>
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
                            <CustomCard
                                image={article.image}
                                title={article.title}
                                subtitle={article.subtitle}
                                author={article.author}
                                duration={article.duration}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Subscription Section */}
                <Box sx={{
                    mt: 8,
                    textAlign: 'center',
                    borderTop: '1px solid',
                    borderColor: 'primary.main',
                    pt: 4
                }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            mb: 2,
                            textTransform: 'uppercase',
                            color: 'primary.main'
                        }}
                    >
                        Subscribe to receive more newsletter
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'background.default',
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                                backgroundColor: 'primary.dark'
                            }
                        }}
                    >
                        Subscribe Now
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Blog;