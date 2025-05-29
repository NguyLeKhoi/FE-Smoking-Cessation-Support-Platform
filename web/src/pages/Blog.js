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

                {/* 3 Columns of Articles */}
                <Grid container spacing={0} sx={{ justifyContent: 'center' }}>
                    {[1, 2, 3].map((item, index) => (
                        <React.Fragment key={item}>
                            <Grid item xs={12} md={5} sx={{ px: 8 }}>
                                <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 1, height: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={Banner3}
                                        alt="Team Member"
                                    />
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Jacob Jones
                                        </Typography>
                                        <Typography variant="body2" sx={{ textTransform: 'uppercase', color: 'text.secondary' }}>
                                            CEO
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {index < 2 && (
                                <Grid item md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                                    <Divider orientation="vertical" sx={{ height: '100%', mx: 'auto' }} />
                                </Grid>
                            )}
                        </React.Fragment>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Blog;
