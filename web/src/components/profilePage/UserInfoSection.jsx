import React from 'react';
import { Button, Typography, Box, Paper, Grid, TextField, Avatar } from '@mui/material';
import { format } from 'date-fns';

const UserInfoSection = ({
    userData,
    formData,
    isEditing,
    handleEditToggle,
    handleInputChange,
    handleSave
}) => {
    // Format date of birth if available
    const formattedDob = userData.dob
        ? format(new Date(userData.dob), 'MMMM dd, yyyy')
        : 'Not provided';

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: 'section.light',
                border: '1px solid',
                borderColor: 'divider',
                mb: 4
            }}
        >
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                {/* Avatar Section - Left Side */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '200px'
                }}>
                    {userData.avatar ? (
                        <Avatar
                            src={userData.avatar}
                            alt={userData.username || 'User'}
                            sx={{
                                width: 160,
                                height: 160,
                                border: '4px solid',
                                borderColor: 'primary.main',
                                mb: 2,
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: 160,
                                height: 160,
                                borderRadius: '50%',
                                bgcolor: '#f0f0f0',
                                border: '4px solid',
                                borderColor: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '64px',
                                mb: 2,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {userData.username ? userData.username.charAt(0).toUpperCase() : '?'}
                        </Box>
                    )}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: 'text.primary'
                        }}
                    >
                        {userData.username}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            textAlign: 'center'
                        }}
                    >
                        Member since {userData.joined}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {!isEditing ? (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleEditToggle}
                                sx={{
                                    mt: 1,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 3,
                                }}
                            >
                                Edit Profile
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleSave}
                                    sx={{
                                        mt: 1,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        px: 3,
                                        bgcolor: 'primary.main',
                                        '&:hover': { bgcolor: 'primary.dark' }
                                    }}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleEditToggle}
                                    sx={{
                                        mt: 1,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        px: 3,
                                        width: '100%',
                                    }}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>

                {/* User Information - Right Side */}
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            mb: 3,
                            color: 'text.primary'
                        }}
                    >
                        Personal Information
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    id="email-field"
                                    label="Email"
                                    name="email"
                                    variant="standard"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    disabled={isEditing}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    id="phone-field"
                                    label="Phone Number"
                                    name="phone_number"
                                    variant="standard"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    fullWidth
                                    InputProps={{ readOnly: !isEditing }}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    id="first-name-field"
                                    label="First Name"
                                    name="first_name"
                                    variant="standard"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    InputProps={{ readOnly: !isEditing }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    id="dob-field"
                                    label="Date of Birth"
                                    name="dob"
                                    variant="standard"
                                    value={isEditing ? formData.dob : formattedDob}
                                    onChange={handleInputChange}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true // Always read-only regardless of edit mode
                                    }}
                                    disabled={isEditing} // Only visually disable when in edit mode
                                    type={isEditing ? 'date' : 'text'}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    id="last-name-field"
                                    label="Last Name"
                                    name="last_name"
                                    variant="standard"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    InputProps={{ readOnly: !isEditing }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
};

export default UserInfoSection;