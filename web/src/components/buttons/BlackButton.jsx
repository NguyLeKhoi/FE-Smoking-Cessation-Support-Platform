import React from 'react';
import Button from '@mui/material/Button';

const BlackButton = ({ children, sx = {}, ...props }) => (
    <Button
        variant="contained"
        disableElevation
        sx={{
            py: 1.5,
            bgcolor: '#000000',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 0 #00000080',
            fontSize: '1.2rem',
            '&:hover': {
                bgcolor: '#000000cd',
                boxShadow: '0 2px 0 #00000080',
                transform: 'translateY(2px)',
            },
            '&:active': {
                boxShadow: '0 0 0 #00000080',
                transform: 'translateY(4px)',
            },
            ...sx,
        }}
        {...props}
    >
        {children}
    </Button>
);

export default BlackButton;
