import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const AchievementSection = ({ achievements }) => {

    return (
       <Box sx={{ mt: 5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        color: 'text.primary',
                        fontSize: '32px'
                      }}>
                      Achievements
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 'medium',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      VIEW ALL
                    </Typography>
                  </Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 0,
                      bgcolor: 'background.paper',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Smoke-Free Streak Achievement */}
                    <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            flexShrink: 0
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: '40px',
                              color: 'white',
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                            }}
                          >
                            🚭
                          </Box>
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: -5,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              bgcolor: '#ff6b6b',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              px: 1,
                              py: 0,
                              borderRadius: 1,
                              border: '2px solid white',
                              whiteSpace: 'nowrap',
                              minWidth: 'fit-content',
                              textAlign: 'center'
                            }}
                          >
                            LEVEL 6
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                              Smoke-Free Streak
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              63/75 days
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            Maintain a 75-day smoke-free streak
                          </Typography>
                          <Box
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'section.main',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              sx={{
                                width: `${(63 / 75) * 100}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #ff6b6b, #ff8e53)',
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    {/* Health Recovery Achievement */}
                    <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            flexShrink: 0
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: '40px',
                              color: 'white',
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                            }}
                          >
                            ❤️
                          </Box>
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: -5,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              bgcolor: '#e74c3c',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              px: 1,
                              py: 0,
                              borderRadius: 1,
                              border: '2px solid white',
                              whiteSpace: 'nowrap',
                              minWidth: 'fit-content',
                              textAlign: 'center'
                            }}
                          >
                            LEVEL 9
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                              Health Recovery
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              183/200 days
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            Reach 200 days to restore lung function
                          </Typography>
                          <Box
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'section.main',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              sx={{
                                width: `${(183 / 200) * 100}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #e74c3c, #c0392b)',
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    {/* Money Saved Achievement */}
                    <Box sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #f7b733, #fc4a1a)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            flexShrink: 0
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: '40px',
                              color: 'white',
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                            }}
                          >
                            💰
                          </Box>
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: -5,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              bgcolor: '#f7b733',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              px: 1,
                              py: 0,
                              borderRadius: 1,
                              border: '2px solid white',
                              whiteSpace: 'nowrap',
                              minWidth: 'fit-content',
                              textAlign: 'center'
                            }}
                          >
                            LEVEL 10
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                              Money Saved
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              $1000/$1000
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            You've saved $1000 by not buying cigarettes
                          </Typography>
                          <Box
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'section.main',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, #f7b733, #fc4a1a)',
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
    );
};

export default AchievementSection;