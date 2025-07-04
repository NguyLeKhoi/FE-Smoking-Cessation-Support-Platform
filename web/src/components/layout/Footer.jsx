import { Box, Typography, Container, Stack, Link as MuiLink, IconButton, Divider, MenuItem, Select } from '@mui/material';
import { Link } from 'react-router-dom';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';

const policyLinks = [
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Security', to: '/security' },
  { label: 'Sitemap', to: '/sitemap' },
];

const socialLinks = [
  { icon: <TwitterIcon />, href: 'https://twitter.com/', label: 'Twitter' },
  { icon: <FacebookIcon />, href: 'https://facebook.com/', label: 'Facebook' },
  { icon: <GitHubIcon />, href: 'https://github.com/', label: 'GitHub' },
];

const logo = (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: 30, letterSpacing: 1 }}>Zerotine</Typography>
  </Box>
);

const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: 'auto',
      py: 4,
      backgroundColor: '#151a23',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)',
      position: 'relative',
      zIndex: 10,
    }}
  >
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        {logo}
        <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
          {policyLinks.map((item) => (
            <MuiLink
              key={item.to}
              component={Link}
              to={item.to}
              underline="none"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 400,
                fontSize: 15,
                letterSpacing: 0.2,
                transition: 'color 0.2s',
                '&:hover': { color: '#90caf9' },
              }}
            >
              {item.label}
            </MuiLink>
          ))}
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
          {socialLinks.map((item) => (
            <IconButton
              key={item.label}
              component="a"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#90caf9' } }}
              aria-label={item.label}
            >
              {item.icon}
            </IconButton>
          ))}
        </Stack>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
          <LanguageIcon sx={{ mr: 1, fontSize: 20 }} />
          <Select
            defaultValue="en"
            size="small"
            variant="standard"
            disableUnderline
            sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, minWidth: 70, background: 'transparent' }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="vi">Tiếng Việt</MenuItem>
          </Select>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: 14,
            textAlign: 'right',
          }}
        >
          &copy; {new Date().getFullYear()} Zerotine. All rights reserved.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer;
