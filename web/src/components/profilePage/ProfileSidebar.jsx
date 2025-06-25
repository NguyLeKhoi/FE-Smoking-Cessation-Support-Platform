import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Badge, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExploreIcon from '@mui/icons-material/Explore';
import ArticleIcon from '@mui/icons-material/Article';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BlockIcon from '@mui/icons-material/Block';


const menuItems = [
    { label: 'LEADERBOARDS', icon: <EmojiEventsIcon fontSize="medium" />, path: '/leaderboards' },
    { label: 'QUESTS', icon: <ExploreIcon fontSize="medium" />, hasNotification: true, path: '/quests' },
    { label: 'MY POSTS', icon: <ArticleIcon fontSize="medium" />, path: '/my-blog' },
    { label: 'PROFILE', icon: <PersonIcon fontSize="medium" />, path: '/profile' },
    { label: 'QUIT PLAN', icon: <BlockIcon fontSize="medium" />, path: '/quit-plan' },
    { label: 'MORE', icon: <MoreHorizIcon fontSize="medium" />, path: '/more' },
];

// Custom styled components using theme colors
const SidebarContainer = styled(Paper)(({ theme }) => ({
    width: 240,
    height: '100vh',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.03)',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.primary,
    borderRight: `1px solid ${theme.palette.divider}`,
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 10,
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

const ProfileSidebar = ({ userData }) => {
    const location = useLocation();
    const navigate = useNavigate(); // Added useNavigate hook
    const [activeItem, setActiveItem] = useState(() => {
        const currentPath = location.pathname;
        const foundItem = menuItems.findIndex(item => currentPath.includes(item.path));
        return foundItem >= 0 ? foundItem : 3; // Default to PROFILE (index 3)
    });

    const handleItemClick = (index) => {
        setActiveItem(index);
        console.log(`Selected: ${menuItems[index].label} (${menuItems[index].path})`);

        // Handle navigation based on the menu item
        if (menuItems[index].path === '/my-blog') {
            // Navigate to user's blog posts page - use userData.id if available
            const userId = userData?.id || 'dc0ef526-ec2b-4ff4-8aa0-308d0c8e499e'; // Use hardcoded ID as fallback
            navigate(`/my-blog?userId=${userId}`);
        } else if (index !== 3) { // For items other than PROFILE and MY BLOG
            // Show toast or notification for "Coming Soon" features
            console.log("This feature is coming soon");
            // You could add a toast notification here
        } else {
            // Navigate to the default path for this menu item
            navigate(menuItems[index].path);
        }
    };

    return (
        <SidebarContainer elevation={0}>
            {/* Logo Section - Now at the very top */}
            <Box
                component={RouterLink}
                to="/"
                sx={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    pt: 3, // Add padding to the top and bottom
                    ml: 2,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: '#000000',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        ml: 2,

                    }}
                >
                    Zerotine
                </Typography>
            </Box>

            {/* Menu Section */}
            <Box sx={{ p: 2, pt: 3 }}> {/* Add padding to the content container */}
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
                        <StyledListItem
                            component={RouterLink}
                            to={item.path}
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
                    ))}
                </List>
            </Box>
        </SidebarContainer>
    );
};

export default ProfileSidebar;
