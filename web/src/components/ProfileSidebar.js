import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Badge, Avatar, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { useLocation } from 'react-router-dom'; // Remove useNavigate
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExploreIcon from '@mui/icons-material/Explore';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TranslateIcon from '@mui/icons-material/Translate';

// Sidebar item config with Material UI icons for consistency and paths
const menuItems = [
    { label: 'LEARN', icon: <HomeIcon fontSize="medium" />, path: '/learn' },
    { label: 'LETTERS', icon: <TranslateIcon fontSize="medium" />, path: '/letters' },
    { label: 'LEADERBOARDS', icon: <EmojiEventsIcon fontSize="medium" />, path: '/leaderboards' },
    { label: 'QUESTS', icon: <ExploreIcon fontSize="medium" />, hasNotification: true, path: '/quests' },
    { label: 'SHOP', icon: <StorefrontIcon fontSize="medium" />, path: '/shop' },
    { label: 'PROFILE', icon: <PersonIcon fontSize="medium" />, path: '/profile' },
    { label: 'MORE', icon: <MoreHorizIcon fontSize="medium" />, path: '/more' },
];

// Custom styled components using theme colors
const SidebarContainer = styled(Paper)(({ theme }) => ({
    width: 240,
    height: '100vh',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.03)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.primary,
    borderRight: `1px solid ${theme.palette.divider}`,
    overflowY: 'auto',
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '8px',
    cursor: 'pointer',
    backgroundColor: active ? theme.palette.section.main : 'transparent',
    border: active ? `1px solid ${theme.palette.primary.main}` : 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: active ? theme.palette.section.main : theme.palette.section.light,
        transform: 'translateY(-2px)',
        boxShadow: active ? '0 4px 8px rgba(0, 0, 0, 0.05)' : 'none',
    },
}));

const IconText = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '0.9rem',
    letterSpacing: '0.5px',
    color: theme.palette.text.primary,
}));

// Logo component
const Logo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pl: 1 }}>
        <Typography
            variant="h5"
            component="div"
            sx={{
                fontWeight: 800,
                color: 'primary.main',
                letterSpacing: '0.5px'
            }}
        >
            Zerotine
        </Typography>
    </Box>
);

// User profile section
const UserProfileSection = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pl: 1 }}>
        <Avatar
            sx={{
                width: 40,
                height: 40,
                bgcolor: 'section.main',
                border: '2px solid #000'
            }}
        >
            U
        </Avatar>
        <Box sx={{ ml: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                User Name
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Basic Level
            </Typography>
        </Box>
    </Box>
);

const ProfileSidebar = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(() => {
        // Set initial active item based on current path
        const currentPath = location.pathname;
        const foundItem = menuItems.findIndex(item => currentPath.includes(item.path));
        return foundItem >= 0 ? foundItem : 5; // Default to profile if no match
    });

    const handleItemClick = (index) => {
        // Just update the active item without navigation
        setActiveItem(index);

        // Optional: Add a console log to show which page would be navigated to
        console.log(`Selected: ${menuItems[index].label} (${menuItems[index].path})`);
    };

    return (
        <SidebarContainer elevation={0}>
            <Logo />
            <UserProfileSection />

            <Typography
                variant="overline"
                sx={{
                    pl: 2,
                    mb: 1,
                    color: 'text.secondary',
                    fontWeight: 600
                }}
            >
                MENU
            </Typography>

            <List sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 0 }}>
                {menuItems.map((item, index) => (
                    <Tooltip
                        key={index}
                        title={index !== 5 ? "Coming soon" : ""}
                        placement="right"
                    >
                        <StyledListItem
                            active={activeItem === index ? 1 : 0}
                            onClick={() => handleItemClick(index)}
                        >
                            <ListItemIcon sx={{
                                color: activeItem === index ? 'primary.main' : 'text.secondary',
                                minWidth: 36
                            }}>
                                {item.hasNotification ? (
                                    <Badge
                                        color="error"
                                        variant="dot"
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        {item.icon}
                                    </Badge>
                                ) : (
                                    item.icon
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={<IconText>{item.label}</IconText>}
                            />
                        </StyledListItem>
                    </Tooltip>
                ))}
            </List>

            <Box sx={{ mt: 'auto', pt: 4, pb: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    © 2025 Zerotine App
                </Typography>
            </Box>
        </SidebarContainer>
    );
};

export default ProfileSidebar;
