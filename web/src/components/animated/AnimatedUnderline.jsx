import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export const AnimatedUnderline = ({ children, color = "secondary.main", textColor, active = false }) => {
    return (
        <Box sx={{
            position: "relative",
            display: "inline-block",
            padding: "8px 0",
            "&:hover::after": {
                transform: "scaleX(1)",
                opacity: 1
            },
            "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "2px",
                backgroundColor: color,
                transform: active ? "scaleX(1)" : "scaleX(0)", // Show underline when active
                transformOrigin: "center",
                transition: "transform 0.3s ease, opacity 0.3s ease",
                opacity: active ? 1 : 0, // Full opacity when active
                borderRadius: "20px",
            }
        }}>
            {React.cloneElement(children, {
                sx: {
                    ...children.props.sx,
                    position: "relative",
                    zIndex: 1,
                    color: textColor || children.props.color,
                    fontWeight: active ? 600 : children.props.sx?.fontWeight || 500 
                }
            })}
        </Box>
    );
};

//for navigation items
export const AnimatedUnderlineLink = ({ to, label, isScrolled, color = "#F13067", active = false }) => {
    return (
        <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
            <AnimatedUnderline color={color} active={active}>
                <Typography color={isScrolled ? "black" : "white"} fontWeight={active ? 600 : 500}>
                    {label}
                </Typography>
            </AnimatedUnderline>
        </Link>
    );
};

AnimatedUnderline.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string,
    textColor: PropTypes.string,
    active: PropTypes.bool
};

AnimatedUnderlineLink.propTypes = {
    to: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isScrolled: PropTypes.bool.isRequired,
    color: PropTypes.string,
    active: PropTypes.bool
};

export default AnimatedUnderlineLink;
