import React, { useEffect, useState } from 'react';
import { Card, Box, Typography, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import feedbackService from '../../services/feedbackService';

const SingleFeedbackCard = ({ rating_star, comment, users }) => {
    const validRating = typeof rating_star === 'number' ? rating_star : 0;
    const validComment = comment || 'No comment provided';
    const username = users?.username || 'Anonymous';
    const avatar = users?.avatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';

    return (
        <Card sx={{ p: 3, maxHeight: 200, minHeight: 100, width: 350, borderRadius: 3, boxShadow: 2, mx: 'auto' }}>
            {/* User Info Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundImage: avatar ? `url(${avatar})` : 'none',
                        backgroundColor: avatar ? 'transparent' : '#e0e0e0',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#333',
                        mr: 1
                    }}
                >
                    {!avatar && username.charAt(0).toUpperCase()}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                    {username}
                </Typography>
            </Box>

            {/* Star Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {[...Array(5)].map((_, i) => (
                    <StarIcon
                        key={i}
                        sx={{ color: i < validRating ? '#FFD700' : '#e0e0e0', fontSize: 20 }}
                    />
                ))}
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                    {validRating} / 5
                </Typography>
            </Box>

            {/* Comment */}
            <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontSize: '0.9rem' }}>
                "{validComment}"
            </Typography>
        </Card>
    );
};

const FeedbackCard = ({ coachId, onFeedbackAdded }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to add new feedback to the list
    const addNewFeedback = (newFeedback) => {
        console.log('Adding new feedback to card:', newFeedback);
        // Ensure the feedback has required properties
        if (newFeedback && typeof newFeedback.rating_star === 'number' && newFeedback.comment) {
            setFeedbacks(prevFeedbacks => {
                const updatedFeedbacks = [newFeedback, ...prevFeedbacks];
                console.log('Updated feedbacks:', updatedFeedbacks);
                return updatedFeedbacks;
            });
        } else {
            console.log('Invalid feedback data:', newFeedback);
        }
    };

    // Expose the addNewFeedback function to parent component
    React.useEffect(() => {
        console.log('Setting up onFeedbackAdded callback');
        if (onFeedbackAdded) {
            onFeedbackAdded(addNewFeedback);
        } else {
            console.log('onFeedbackAdded is not provided');
        }
    }, [onFeedbackAdded]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            setLoading(true);
            try {
                console.log('Fetching feedbacks for coachId:', coachId);
                const data = await feedbackService.getFeedbackByCoachId(coachId);
                console.log('API response for feedbacks:', data);
                setFeedbacks(Array.isArray(data.data?.data) ? data.data.data : []);
            } catch (e) {
                setFeedbacks([]);
            } finally {
                setLoading(false);
            }
        };
        if (coachId) fetchFeedbacks();
    }, [coachId]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}><CircularProgress /></Box>;
    }
    if (!feedbacks.length) {
        return <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', my: 3 }}>No feedback yet.</Typography>;
    }

    return (
        <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={feedbacks.length > 1}
            style={{ padding: '24px 0', maxWidth: 440 }}
        >
            {feedbacks.map((fb, idx) => (
                <SwiperSlide key={idx}>
                    <SingleFeedbackCard
                        rating_star={fb.rating_star}
                        comment={fb.comment}
                        users={fb.users}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default FeedbackCard;
