import React from 'react';
import { Box, TextField, CircularProgress } from '@mui/material';
import BlackButton from '../buttons/BlackButton';

const WriteFeedbackBox = ({
    submitting,
    newFeedback,
    setNewFeedback,
    onSubmit
}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', mb: 3 }}>
            <TextField
                multiline
                minRows={2}
                placeholder={'Write your feedback...'}
                value={newFeedback}
                onChange={e => setNewFeedback(e.target.value)}
                sx={{ flex: 1, mb: 2, width: 600 }}
                size="small"
            />
            <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                <BlackButton
                    onClick={onSubmit}
                    sx={{ borderRadius: 2, width: 200, fontSize: '1rem' }}
                    disabled={submitting || !newFeedback.trim()}
                >
                    {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit Feedback'}
                </BlackButton>
            </Box>
        </Box>
    );
};

export default WriteFeedbackBox;
