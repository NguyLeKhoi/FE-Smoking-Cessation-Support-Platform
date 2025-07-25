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
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';



const menuItems = [
    { label: 'PROFILE', icon: <PersonIcon fontSize="medium" />, path: '/profile' },
    { label: 'LEADERBOARDS', icon: <EmojiEventsIcon fontSize="medium" />, path: '/leaderboard' },
    { label: 'SMOKING HABIT', icon: <SmokingRoomsIcon fontSize="medium" />, path: '/my-smoking-habit' },
    { label: 'MY SUBSCRIPTION', icon: <EmojiEventsIcon fontSize="medium" />, path: '/subscription' },
    { label: 'MY POSTS', icon: <ArticleIcon fontSize="medium" />, path: '/my-blog' },
    { label: 'QUESTS', icon: <ExploreIcon fontSize="medium" />, hasNotification: true, path: '/quests' },
    { label: 'MORE', icon: <MoreHorizIcon fontSize="medium" />, path: '/more' },
];

const SidebarContainer = styled(Paper)(({ theme }) => ({
    width: 260,
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
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(() => {
        const currentPath = location.pathname;
        const foundItem = menuItems.findIndex(item => currentPath.includes(item.path));
        return foundItem >= 0 ? foundItem : 3;
    });

    const handleItemClick = (index) => {
        setActiveItem(index);
        console.log(`Selected: ${menuItems[index].label} (${menuItems[index].path})`);

        if (menuItems[index].path === '/my-blog') {
            const userId = userData?.id;
            navigate(`/my-blog?userId=${userId}`);
        } else if (index !== 3) {
            console.log("This feature is coming soon");
        } else {
            navigate(menuItems[index].path);
        }
    };

    return (
        <SidebarContainer elevation={0}>
            {/* Logo */}
            <Box
                component={RouterLink}
                to="/"
                sx={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    pt: 3,
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
            <Box sx={{ p: 2, pt: 3 }}>
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
                            key={item.label}
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
