import React from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';

export default function HomePage() {
  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom sx={{ lineHeight: 1.1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Box>
                    Quit smoking now.<br />Claiming your health.
                  </Box>
                  <img src="/smile-face.png" alt="Smiling face" style={{ width: '100px', height: 'auto' }} />
                </Box>
              </Typography>

            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              {/* Placeholder for mobile screens image */}
              <Box
                sx={{
                  width: { xs: '100%', md: 420 },
                  height: { xs: 220, md: 340 },
                  background: 'url(https://placehold.co/420x340?text=App+Screens)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 4,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Share the journey Section */}
      <Box sx={{ bgcolor: 'section.main', py: { xs: 8, md: 10 } }}>
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
                background: 'url(https://placehold.co/350x400?text=Community+Screen)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 4,
                boxShadow: 3,
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Achievements Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 10 }, px: 2 }}>
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
      </Box>

      {/* Health Section */}
      <Box sx={{ bgcolor: '#EAEBD0', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} align="center" color="white">
            Recover your health
          </Typography>
          <Typography variant="h6" align="center" color="white" sx={{ mb: 4 }}>
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
      </Box>
    </Box>
  );
}
