import React from 'react';
import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content, sx = {} }) => {
    const markdownStyles = {
        '& h1, & h2, & h3, & h4, & h5, & h6': {
            marginTop: 2,
            marginBottom: 1,
            fontWeight: 600,
        },
        '& h1': { fontSize: '2rem' },
        '& h2': { fontSize: '1.5rem' },
        '& h3': { fontSize: '1.25rem' },
        '& p': {
            marginBottom: 1,
            lineHeight: 1.6,
        },
        '& ul, & ol': {
            marginLeft: 2,
            marginBottom: 1,
        },
        '& li': {
            marginBottom: 0.5,
        },
        '& blockquote': {
            borderLeft: '4px solid #ddd',
            paddingLeft: 2,
            margin: '1rem 0',
            fontStyle: 'italic',
            color: 'text.secondary',
        },
        '& code': {
            backgroundColor: 'grey.100',
            padding: '2px 4px',
            borderRadius: 1,
            fontFamily: 'monospace', // Keep monospace for code
            fontSize: '0.875rem',
        },
        '& pre': {
            backgroundColor: 'grey.100',
            padding: 2,
            borderRadius: 1,
            overflow: 'auto',
            '& code': {
                backgroundColor: 'transparent',
                padding: 0,
            },
        },
        '& a': {
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 1,
        },
        '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: 2,
        },
        '& th, & td': {
            border: '1px solid #ddd',
            padding: 1,
            textAlign: 'left',
        },
        '& th': {
            backgroundColor: 'grey.100',
            fontWeight: 600,
        },
        ...sx
    };

    return (
        <Box sx={markdownStyles}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || ''}
            </ReactMarkdown>
        </Box>
    );
};

export default MarkdownRenderer;