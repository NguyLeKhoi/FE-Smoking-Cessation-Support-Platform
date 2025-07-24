import React, { useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
import { useNavigate, Route, Routes } from "react-router-dom";
import {
  fetchCurrentUser,
  updateCurrentUser,
} from "../../services/userService";
import ProfileSidebar from "../../components/profilePage/ProfileSidebar";
import UserInfoSection from "../../components/profilePage/UserInfoSection";
import StatisticsSection from "../../components/profilePage/StatisticsSection";
import AchievementSection from "../../components/profilePage/AchievementSection";
import LoadingPage from "../LoadingPage";
import { HttpStatusCode } from "axios";

export default function ProfilePage({ handleLogout }) {
  const navigate = useNavigate();
  const [statisticsData, setStatisticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const onLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      try {
        const response = await fetchCurrentUser();
        if (response.statusCode === HttpStatusCode.Ok) {
          const stats = mapUserToStatisticsData(response.data);
          setStatisticsData(stats);
        }
      } finally {
        setLoading(false);
      }
    };
    loadUserProfile();
  }, []);
  const mapUserToStatisticsData = (user) => [
    {
      icon: "💧",
      value: user.streak?.toString() || "0",
      label: "Day streak",
      color: "#64748b",
    },
    {
      icon: "⚡",
      value: user.point?.toString() || "0",
      label: "Total XP",
      color: "#f59e0b",
    },
    {
      icon: "🏅",
      value: "Gold",
      label: "Current league",
      color: "#f59e0b",
    },
    {
      icon: "🏆",
      value: user.leaderboard[0]?.rank?.toString() || 0,
      label:
        user.leaderboard[0]?.rank != null
          ? `Top ${user.leaderboard[0].rank} finishes of ${user.leaderboard[0]?.rank_type || ""
          }`
          : "No ranking data",

      color: "#f59e0b",
    },
  ];

  // Always render the components so their useEffects run
  return (
    <>
      {(loading || loadingUserInfo || loadingAchievements) && <LoadingPage />}
      <Box sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflow: 'visible',
        // Hide content if loading
        opacity: (loading || loadingUserInfo || loadingAchievements) ? 0 : 1,
        pointerEvents: (loading || loadingUserInfo || loadingAchievements) ? 'none' : 'auto',
      }}>
        <ProfileSidebar userData={null} />
        {/* Main content */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 4,
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}>
          <UserInfoSection onLoaded={() => { console.log('[ProfilePage] setLoadingUserInfo(false)'); setLoadingUserInfo(false); }} />
          <StatisticsSection statisticsData={statisticsData} />
          <Box sx={{ mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            </Box>
            <AchievementSection onLoaded={() => { console.log('[ProfilePage] setLoadingAchievements(false)'); setLoadingAchievements(false); }} />
          </Box>
          <Button
            variant="contained"
            onClick={onLogoutClick}
            sx={{
              mt: 5,
              py: 1.5,
              bgcolor: '#000000',
              color: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 0 #00000080',
              '&:hover': {
                bgcolor: '#000000cd',
                boxShadow: '0 2px 0 #00000080',
                transform: 'translateY(2px)',
              },
              '&:active': {
                boxShadow: '0 0 0 #00000080',
                transform: 'translateY(4px)',
              },
            }}
          >
            Log Out
          </Button>
        </Box>
      </Box>
    </>
  );
}