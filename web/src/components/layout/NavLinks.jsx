import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AnimatedUnderline } from '../animated/AnimatedUnderline';

const NavLinks = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        {
            path: '/',
            label: 'Home'
        },
        {
            path: '/blog',
            label: 'Blog'
        },
        {
            path: '/coaches-list',
            label: 'Coaches'
        },
        {
            path: '/membership-plans',
            label: 'Membership'
        },
      
    ];

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            height: '100%'
        }}>
            {navItems.map((item) => (
                <Box
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <AnimatedUnderline active={currentPath === item.path}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#000000',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: currentPath === item.path ? 600 : 500,
                                '&:hover': {
                                    fontWeight: 600
                                },
                                padding: '4px 0'
                            }}
                        >
                            {item.label}
                        </Typography>
                    </AnimatedUnderline>
                </Box>
            ))}
        </Box>
    );
};

export default NavLinks;