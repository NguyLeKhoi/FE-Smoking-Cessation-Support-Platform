import React from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import homepageImage from '../assets/homepage.jpg';
import Lottie from 'lottie-react';
import quitSignAnimation from '../assets/animations/quit-sign.json';
import QuotesCarousel from '../components/QuotesCarousel';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      {/* Hero Section */}
      <Box sx={{
        bgcolor: 'background.paper',
        py: { xs: 8, md: 8 },
        px: 2,
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" justifyContent="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                mb: 4,
                alignItems: { xs: 'center', md: 'flex-start' },
                textAlign: { xs: 'center', md: 'left' }
              }}>
                <Typography variant="h2" gutterBottom sx={{
                  lineHeight: 1.1,
                  fontWeight: 500,
                  color: 'text.primary',
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  mb: 2
                }}>
                  Quit smoking now
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
                </Box>
              </Box>

              <Typography variant="h6" sx={{
                color: 'text.primary',
                lineHeight: 1.6,
                mb: 4,
                fontSize: { xs: '1rem', md: '1.25rem' },
                maxWidth: '500px',
                textAlign: { xs: 'center', md: 'center' },
                mx: { xs: 'auto', md: 0 }
              }}>
                Zerotine's virtual clinic offers personalized substance use care for members wanting to cut back, stop or otherwise manage their tobacco use.
              </Typography>

              <Box sx={{
                mt: 4,
                display: 'flex',
                justifyContent: { xs: 'center', md: 'center' },
                width: '100%'
              }}>
                <Box 
                  onClick={() => navigate('/smoking-quiz')}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 4,
                    py: 2,
                    borderRadius: 4,
                    display: 'inline-block',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }}
                >
                  Take a Quiz
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <Box sx={{ position: 'relative', width: '100%', maxWidth: 500, height: 400 }}>

                {/* Main image */}
                {/* <Box
                  sx={{
                    position: 'relative',
                    bottom: 30,
                    left: 70,
                    width: 500,
                    height: 500,
                    background: `url(${homepageImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 2,
                    zIndex: 3,
                  }}
                /> */}

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: '100%', md: 450 },
                      height: { xs: 220, md: 400 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      bgcolor: 'transparent',
                      position: 'relative'
                    }}
                  >
                    <Lottie
                      animationData={quitSignAnimation}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      loop={true}
                      rendererSettings={{
                        preserveAspectRatio: 'xMidYMid slice',
                        clearCanvas: true,
                        progressiveLoad: true,
                        backgroundColor: 'transparent' // Additional transparency setting
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Quotes Carousel Section */}
      <QuotesCarousel />

      {/* Share the journey Section */}
      {/* <Box sx={{ bgcolor: 'section.main', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom>
            Share the journey
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            Quitting smoking is easier with buddies who share your experiences
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: { xs: '100%', md: 350 },
                height: { xs: 220, md: 400 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                boxShadow: 3,
                overflow: 'hidden',
                bgcolor: 'transparent', // Changed from background.paper to transparent
                position: 'relative' // Added position relative
              }}
            >

            </Box>
          </Box>
        </Container>
      </Box> */}

      {/* Achievements Section */}
      {/* <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 10 }, px: 2 }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom>
            Small achievements, big goals
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            With every step, your task of quitting smoking gets closer
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box
              sx={{
                width: { xs: '100%', md: 220 },
                height: { xs: 140, md: 300 },
                background: 'url(https://placehold.co/220x300?text=Achievements+1)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 4,
                boxShadow: 3,
              }}
            />
            <Box
              sx={{
                width: { xs: '100%', md: 220 },
                height: { xs: 140, md: 300 },
                background: 'url(https://placehold.co/220x300?text=Achievements+2)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 4,
                boxShadow: 3,
              }}
            />
          </Box>
        </Container>
      </Box> */}

      {/* Health Section */}
      {/* <Box sx={{ bgcolor: 'section.main', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom>
            Recover your health
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            Celebrate your accomplishment and all it brings
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box
              sx={{
                width: { xs: '100%', md: 220 },
                height: { xs: 140, md: 300 },
                background: 'url(https://placehold.co/220x300?text=Health+1)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 4,
                boxShadow: 3,
              }}
            />
            <Box
              sx={{
                width: { xs: '100%', md: 220 },
                height: { xs: 140, md: 300 },
                background: 'url(https://placehold.co/220x300?text=Health+2)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 4,
                boxShadow: 3,
              }}
            />
          </Box>
        </Container>
      </Box> */}
    </Box>
  );
}
