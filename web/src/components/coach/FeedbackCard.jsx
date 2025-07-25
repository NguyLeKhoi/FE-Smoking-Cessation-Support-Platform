import React, { useEffect, useState } from 'react';
import { Card, Box, Typography, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import feedbackService from '../../services/feedbackService';

const SingleFeedbackCard = ({ rating_star, comment }) => (
    <Card sx={{ p: 3, height: 100, width: 350, borderRadius: 3, boxShadow: 2, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {[...Array(5)].map((_, i) => (
                <StarIcon
                    key={i}
                    sx={{ color: i < rating_star ? '#FFD700' : '#e0e0e0', fontSize: 24 }}
                />
            ))}
            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                {rating_star} / 5
            </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic' }}>
            "{comment}"
        </Typography>
    </Card>
);

const FeedbackCard = ({ coachId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    <SingleFeedbackCard rating_star={fb.rating_star} comment={fb.comment} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default FeedbackCard;
