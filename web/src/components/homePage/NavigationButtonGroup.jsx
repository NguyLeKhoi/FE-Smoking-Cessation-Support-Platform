import React from 'react';
import { Box } from '@mui/material';

function NavigationButtonGroup({ navigationItems, activeSlide, handleSlideChange, StyledNavButton }) {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            mb: 4,
            px: 2,
            gap: 2
        }}>
            {navigationItems.map((item) => (
                <StyledNavButton
                    key={item.id}
                    active={activeSlide === item.id}
                    onClick={() => handleSlideChange(item.id)}
                >
                    {item.label}
                </StyledNavButton>
            ))}
        </Box>
    );
}

export default NavigationButtonGroup; 