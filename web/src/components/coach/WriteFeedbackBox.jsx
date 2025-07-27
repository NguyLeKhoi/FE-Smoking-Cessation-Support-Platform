import React, { useState } from 'react';
import { Box, TextField, CircularProgress, IconButton } from '@mui/material';
import BlackButton from '../buttons/BlackButton';
import StarIcon from '@mui/icons-material/Star';

const WriteFeedbackBox = ({
    submitting,
    newFeedback,
    setNewFeedback,
    onSubmit,
    ratingStar = 0,
    setRatingStar
}) => {
    const [hoverStar, setHoverStar] = useState(null);
    console.log('ratingStar prop:', ratingStar);
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', mb: 0 }}>
            {/* Star Rating Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
                {[1, 2, 3, 4, 5].map((star) => {

                    const filled = hoverStar !== null ? star <= hoverStar : star <= ratingStar;
                    return (
                        <IconButton
                            key={star}
                            onClick={() => setRatingStar && setRatingStar(star)}
                            onMouseEnter={() => setHoverStar(star)}
                            onMouseLeave={() => setHoverStar(null)}
                            sx={{ p: 0.5 }}
                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            disabled={submitting}
                        >
                            <StarIcon
                                sx={{
                                    fontSize: 32,
                                    color: filled ? '#FFD700' : '#fff',
                                    stroke: '#FFD700',
                                    strokeWidth: 1.5,
                                }}
                            />
                        </IconButton>
                    );
                })}
            </Box>
            <TextField
                multiline
                minRows={2}
                placeholder={'Share your experience with this coach!'}
                value={newFeedback}
                onChange={e => {
                    const value = e.target.value;
                    if (value.length <= 150) {
                        setNewFeedback(value);
                    }
                }}
                inputProps={{
                    minLength: 10,
                    maxLength: 150
                }}
                helperText={`${newFeedback.length}/150 characters (minimum 10 required)`}
                error={newFeedback.length > 0 && newFeedback.length < 10}
                sx={{ flex: 1, mb: 2, width: 650 }}
                size="small"
            />
            <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                <BlackButton
                    onClick={onSubmit}
                    sx={{ borderRadius: 2, width: 200, fontSize: '1rem' }}
                    disabled={submitting || !newFeedback.trim() || newFeedback.length < 10}
                >
                    {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit Feedback'}
                </BlackButton>
            </Box>
        </Box>
    );
};

export default WriteFeedbackBox;
