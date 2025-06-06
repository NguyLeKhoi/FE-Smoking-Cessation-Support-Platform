import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    Divider,
    Button,
    Paper,
    TextField,
    InputAdornment

} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import Banner1 from '../assets/banner1.gif';
import Banner2 from '../assets/banner2.jpg';
import CustomCard from '../components/CustomCard';

const Blog = () => {
    const articleTemplate = {
        image: Banner1,
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
                <Box sx={{ mb: { xs: 4, md: 6 } }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 3,
                            color: 'text.primary',
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            lineHeight: 1.2
                        }}
                    >
                        Cessation Access & Support
                    </Typography>
                    {/* Banner Image */}
                    <Card sx={{ borderRadius: 2, overflow: 'hidden', mb: 6 }}>
                        <CardMedia
                            component="img"
                            height="450"
                            image={Banner2}
                            alt="Smoking Cessation"
                        />
                    </Card>

                    {/* Section Subtitle */}
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 500,
                            mb: 4,
                            color: 'text.secondary',
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            lineHeight: 1.4
                        }}
                    >
                        An effective approach to supporting folks looking to improve their smoking habit and their health.
                    </Typography>
                </Box>

                {/* Divider */}
                <Divider sx={{ my: 4, borderColor: 'primary.main', }} />

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
                <Paper
                    elevation={0}
                    sx={{
                        mt: 8,
                        textAlign: 'center',
                        p: { xs: 4, md: 6 },
                        borderRadius: 3,
                        backgroundColor: 'section.light',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 3,
                            color: 'text.primary'
                        }}
                    >
                        Subscribe to Our Newsletter
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            mb: 4,
                            color: 'text.secondary',
                            maxWidth: '600px',
                            mx: 'auto'
                        }}
                    >
                        Stay updated with the latest articles, success stories, and tips to help you on your journey to a smoke-free life.
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        maxWidth: '600px',
                        mx: 'auto'
                    }}>
                        <TextField
                            placeholder="Enter your email address"
                            variant="outlined"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'background.default',
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                py: 1.5,
                                px: 4,
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 4px 0 rgba(0, 0, 0, 0.2)',
                                minWidth: { xs: '100%', sm: 'auto' },
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                    boxShadow: '0 2px 0 rgba(0, 0, 0, 0.2)',
                                    transform: 'translateY(2px)',
                                },
                                '&:active': {
                                    boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
                                    transform: 'translateY(4px)',
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            Subscribe
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Blog;