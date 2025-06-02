import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'Work Sans, sans-serif',
        h3: {
            fontWeight: 700,
            color: '#3f332b',
        },
        h6: {
            color: '#3f332b',
        },
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#7D7D7D',
        },
        background: {
            default: '#F9F7F4',
            paper: '#ffffff',
        },
        text: {
            primary: '#3f332b',
            secondary: '#5f5349',
        },
        section: {
            light: '#ffffff',
            main: '#EAEBD0',
            dark: '#dfdfc0',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
        MuiBox: {
            styleOverrides: {
                root: {
                    transition: 'all 0.3s ease-in-out',
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: '16px',
                    paddingRight: '16px',
                },
            },
        },
    },
});

export default theme;
