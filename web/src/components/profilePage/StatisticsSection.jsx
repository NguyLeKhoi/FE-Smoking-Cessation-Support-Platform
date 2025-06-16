import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';

const StatisticsSection = ({ statisticsData }) => {
    return (
        <Box sx={{ mt: 4 }}>
                 <Typography
                   variant="h5"
                   sx={{
                     fontWeight: 'bold',
                     mb: 3,
                     color: 'text.primary',
                     fontSize: '32px'
                   }}
                 >
                   Statistics
                 </Typography>
                 <Grid container spacing={4}>
                   {statisticsData.map((stat, index) => (
                     <Grid item xs={12} sm={6} key={index}>
                       <Paper
                         elevation={0}
                         sx={{
                           p: 3,
                           height: '120px',
                           width: '100%',
                           minWidth: '200px',
                           bgcolor: 'section.light',
                           borderRadius: 3,
                           border: '1px solid',
                           borderColor: 'divider',
                           transition: 'all 0.2s ease-in-out',
                           '&:hover': {
                             transform: 'translateY(-2px)',
                             bgcolor: 'section.main',
                             borderColor: 'text.secondary',
                           },
                           display: 'flex',
                           alignItems: 'flex-start',
                           gap: 2,
                           boxSizing: 'border-box',
                         }}
                       >
                         <Box
                           sx={{
                             display: 'flex',
                             alignItems: 'flex-start',
                             justifyContent: 'flex-start',
                             fontSize: '24px',
                             flexShrink: 0,
                             mt: 1,
                           }}
                         >
                           {stat.icon}
                         </Box>
                         <Box sx={{
                           flex: 1,
                           textAlign: 'left',
                           overflow: 'hidden',
                         }}>
                           <Typography
                             variant="h4"
                             sx={{
                               color: 'text.primary',
                               fontWeight: 'bold',
                               mb: 0.5,
                               fontSize: '36px',
                               textAlign: 'left',
                               whiteSpace: 'nowrap',
                               overflow: 'hidden',
                               textOverflow: 'ellipsis',
                             }}
                           >
                             {stat.value}
                           </Typography>
                           <Typography
                             variant="body1"
                             sx={{
                               color: 'text.secondary',
                               fontSize: '16px',
                               textAlign: 'left',
                               whiteSpace: 'nowrap',
                               overflow: 'hidden',
                               textOverflow: 'ellipsis',
                             }}
                           >
                             {stat.label}
                           </Typography>
                         </Box>
                       </Paper>
                     </Grid>
                   ))}
                 </Grid>
               </Box>
    );
};

export default StatisticsSection;