import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import smokingService from '../../services/smokingService';
import Lottie from 'lottie-react';
import catNoir from '../../assets/animations/cat_noir.json';

const HabitCheckPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [hasActiveQuitPlan, setHasActiveQuitPlan] = useState(null);

    useEffect(() => {
        const checkQuitPlan = async () => {
            setLoading(true);
            try {
                const res = await smokingService.getHasActiveQuitPlan();
                const active = res?.data?.hasActiveQuitPlan ?? res?.hasActiveQuitPlan;
                if (active === false) {
                    navigate('/smoking-quiz', { replace: true });
                } else {
                    setHasActiveQuitPlan(true);
                }
            } catch (e) {
                setHasActiveQuitPlan(null);
            } finally {
                setLoading(false);
            }
        };
        checkQuitPlan();
    }, [navigate]);

    if (loading) return <div>Loading...</div>;
    if (hasActiveQuitPlan) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <Lottie animationData={catNoir} style={{ width: 320, height: 320 }} loop={true} />
                <div style={{ marginTop: 24, fontSize: 20, fontWeight: 600, color: '#333', textAlign: 'center' }}>
                    You already have an active quit plan!<br />
                    Keep up the great work!
                </div>
            </div>
        );
    }
    return null;
};

export default HabitCheckPage;
