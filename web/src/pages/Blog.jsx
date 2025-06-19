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
    InputAdornment,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import Banner1 from '../assets/banner1.gif';
import Banner2 from '../assets/banner2.jpg';
import CustomCard from '../components/blog/CustomCard';
import BlogSidebar from '../components/blog/BlogSidebar';

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

    // Define the sidebar width for consistent layout
    const sidebarWidth = 280;

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'background.paper',
            position: 'relative'
        }}>
            {/* Desktop sidebar */}
            <Box
                component="nav"
                sx={{
                    width: sidebarWidth,
                    flexShrink: 0,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 1000,
                }}
            >
                <BlogSidebar />
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: `${sidebarWidth}px`,
                    width: `calc(100% - ${sidebarWidth}px)`,
                }}
            >
                {/* Content with proper padding */}
                <Container
                    maxWidth="lg"
                    sx={{
                        py: 8,
                        px: 4
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        {/* Section Title */}
                        <Box sx={{ mb: 6 }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    color: 'text.primary',
                                    fontSize: '3.5rem',
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
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Card>

                            {/* Section Subtitle */}
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 500,
                                    mb: 4,
                                    color: 'text.secondary',
                                    fontSize: '2rem',
                                    lineHeight: 1.4
                                }}
                            >
                                An effective approach to supporting folks looking to improve their smoking habit and their health.
                            </Typography>
                        </Box>

                        {/* Divider */}
                        <Divider sx={{ my: 4, borderColor: 'primary.main' }} />

                        {/* Articles Section */}
                        <Grid container spacing={3}>
                            {articles.map((article, index) => (
                                <Grid item xs={4} key={index}>
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
                                mb: 4,
                                textAlign: 'center',
                                p: 6,
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
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Blog;