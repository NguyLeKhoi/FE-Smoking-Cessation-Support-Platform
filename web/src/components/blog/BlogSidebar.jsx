import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Paper, Tooltip, Badge } from '@mui/material';
import { styled } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import SupportIcon from '@mui/icons-material/Support';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';


export const POST_TYPE = {
  HEALTH_BENEFITS: 'health_benefits',
  SUCCESS_STORIES: 'success_stories',
  TOOLS_AND_TIPS: 'tools_and_tips',
  SMOKING_DANGERS: 'smoking_dangers',
  SUPPORT_RESOURCES: 'support_resources',
  NEWS_AND_RESEARCH: 'news_and_research',
};

const categoryItems = [
  {
    label: 'HEALTH BENEFITS',
    icon: <FavoriteIcon fontSize="small" />,
    path: '/blog/category/health_benefits',
    type: POST_TYPE.HEALTH_BENEFITS,
    description: 'Discover the positive health changes after quitting'
  },
  {
    label: 'SUCCESS STORIES',
    icon: <EmojiEventsIcon fontSize="small" />,
    path: '/blog/category/success_stories',
    type: POST_TYPE.SUCCESS_STORIES,
    description: 'Inspiring stories from former smokers'
  },
  {
    label: 'TOOLS & TIPS',
    icon: <BuildIcon fontSize="small" />,
    path: '/blog/category/tools_and_tips',
    type: POST_TYPE.TOOLS_AND_TIPS,
    description: 'Practical strategies to quit smoking'
  },
  {
    label: 'SMOKING DANGERS',
    icon: <WarningIcon fontSize="small" />,
    path: '/blog/category/smoking_dangers',
    type: POST_TYPE.SMOKING_DANGERS,
    description: 'Health risks associated with smoking'
  },
  {
    label: 'SUPPORT RESOURCES',
    icon: <SupportIcon fontSize="small" />,
    path: '/blog/category/support_resources',
    type: POST_TYPE.SUPPORT_RESOURCES,
    description: 'Find help in your quit journey'
  },
  {
    label: 'NEWS & RESEARCH',
    icon: <NewspaperIcon fontSize="small" />,
    path: '/blog/category/news_and_research',
    type: POST_TYPE.NEWS_AND_RESEARCH,
    description: 'Latest studies and developments'
  },
];

const navigationItems = [
  { label: 'SAVED ARTICLES', icon: <BookmarkIcon fontSize="small" />, path: '/blog/saved', hasNotification: true }
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

const SectionTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0, 0, 0, 2),
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontWeight: 600
}));

/**
 * BlogSidebar component for navigating blog categories
 */
const BlogSidebar = ({ newPosts = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active category based on URL path
  const [activeItem, setActiveItem] = useState(() => {
    const currentPath = location.pathname;
    const categoryIndex = categoryItems.findIndex(item =>
      currentPath.includes(item.type) || currentPath.includes(item.path)
    );

    // Check if we're on a navigation page
    const navIndex = navigationItems.findIndex(item =>
      currentPath.includes(item.path)
    );

    if (categoryIndex >= 0) {
      return { section: 'categories', index: categoryIndex };
    } else if (navIndex >= 0) {
      return { section: 'navigation', index: navIndex };
    }

    return { section: 'categories', index: -1 };
  });

  const handleCategoryClick = (section, index) => {
    setActiveItem({ section, index });

    // Navigate to the selected category or page
    if (section === 'categories') {
      if (index >= 0) {
        navigate(categoryItems[index].path);
      } else {
        navigate('/blog');
      }
    } else {
      navigate(navigationItems[index].path);
    }
  };

  return (
    <SidebarContainer elevation={0}>

      {/* Blog Navigation */}
      <Box sx={{
        p: 2,
        pt: 6,
        mt: 4,
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* All Articles option */}
        <StyledListItem
          active={activeItem.section === 'categories' && activeItem.index === -1 ? 1 : 0}
          onClick={() => handleCategoryClick('categories', -1)}
          sx={{ mb: 3 }}
        >
          <ListItemText
            primary={
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                All Articles
              </Typography>
            }
          />
        </StyledListItem>

        {/* Categories Section */}
        <SectionTitle variant="overline">CATEGORIES</SectionTitle>
        <List sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 0, mb: 3 }}>
          {categoryItems.map((item, index) => (
            <Tooltip
              key={index}
              title={item.description}
              placement="right"
            >
              <StyledListItem
                active={activeItem.section === 'categories' && activeItem.index === index ? 1 : 0}
                onClick={() => handleCategoryClick('categories', index)}
              >
                <ListItemIcon sx={{
                  color: activeItem.section === 'categories' && activeItem.index === index
                    ? 'primary.main'
                    : 'text.secondary',
                  minWidth: 36
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={<IconText>{item.label}</IconText>}
                />
              </StyledListItem>
            </Tooltip>
          ))}
        </List>

        {/* Navigation Section */}
        <SectionTitle variant="overline">EXPLORE</SectionTitle>
        <List sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 0 }}>
          {navigationItems.map((item, index) => (
            <StyledListItem
              key={index}
              active={activeItem.section === 'navigation' && activeItem.index === index ? 1 : 0}
              onClick={() => handleCategoryClick('navigation', index)}
            >
              <ListItemIcon sx={{
                color: activeItem.section === 'navigation' && activeItem.index === index
                  ? 'primary.main'
                  : 'text.secondary',
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

export default BlogSidebar;