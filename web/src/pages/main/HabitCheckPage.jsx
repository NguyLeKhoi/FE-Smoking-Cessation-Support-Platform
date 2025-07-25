import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import smokingService from '../../services/smokingService';
import Lottie from 'lottie-react';
import catNoir from '../../assets/animations/cat_noir.json';
import LoadingPage from '../LoadingPage';
import BlackButton from '../../components/buttons/BlackButton';
import WhiteButton from '../../components/buttons/WhiteButton';

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

    if (loading) return <LoadingPage />;
    if (hasActiveQuitPlan) {
        return (
            <div style={{ minHeight: '100vh', width: '100vw', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ zIndex: 2, fontSize: 30, fontWeight: 600, color: '#333', textAlign: 'center', position: 'relative' }}>
                    You already took the quiz!<br />
                    Complete a Quit Plan to take another quiz!
                </div>
                <div style={{ zIndex: 2, marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                    <BlackButton
                        onClick={() => navigate('/')}
                        sx={{ minWidth: 260, fontWeight: 700, fontSize: '1.1rem', py: 1.5 }}
                    >
                        Back to Home Page
                    </BlackButton>
                    <WhiteButton
                        onClick={() => navigate('/quit-plan')}
                        sx={{ minWidth: 260, fontWeight: 700, fontSize: '1.1rem', py: 1.5, border: '1px solid #3f332b', color: '#3f332b', bgcolor: 'white' }}
                    >
                        View my Quit Plan
                    </WhiteButton>
                </div>
                <div style={{ position: 'fixed', right: 0, top: 0, display: 'flex', justifyContent: 'flex-end', zIndex: 1, pointerEvents: 'none', transform: 'rotate(180deg)' }}>
                    <Lottie animationData={catNoir} style={{ width: 700, height: 620 }} loop={true} />
                </div>
                <div style={{ position: 'fixed', left: 0, bottom: 0, display: 'flex', justifyContent: 'flex-start', zIndex: 1, pointerEvents: 'none' }}>
                    <Lottie animationData={catNoir} style={{ width: 600, height: 620 }} loop={true} />
                </div>
            </div>
        );
    }
    return null;
};

export default HabitCheckPage;
