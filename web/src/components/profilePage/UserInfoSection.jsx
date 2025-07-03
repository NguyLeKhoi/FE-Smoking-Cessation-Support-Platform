import React from 'react';
import { Button, Typography, Box, Paper, Grid, TextField, Avatar, IconButton } from '@mui/material';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const UserInfoSection = ({
    userData,
    formData,
    isEditing,
    handleEditToggle,
    handleInputChange,
    handleSave
}) => {

    const formattedDob = React.useMemo(() => {
        if (!userData.dob) return 'Not provided';

        try {
            // Make sure the date is valid before formatting
            const date = new Date(userData.dob);
            if (isNaN(date.getTime())) {
                console.warn('Invalid date format in userData.dob:', userData.dob);
                return 'Not provided';
            }
            return format(date, 'MMMM dd, yyyy');
        } catch (err) {
            console.error('Error formatting date:', err);
            return 'Not provided';
        }
    }, [userData.dob]);

    const isEmailEditable = !userData.email;

    const avatarPreview = isEditing ? formData.avatar || userData.avatar : userData.avatar;

    const handleDateChange = (newValue) => {
        if (newValue) {
            const formattedDate = format(newValue, 'yyyy-MM-dd');
            handleInputChange({
                target: {
                    name: 'dob',
                    value: formattedDate
                }
            });
        }
    };

    // Convert string date to Date object for DatePicker
    const getDateValue = () => {
        if (formData.dob) {
            return new Date(formData.dob);
        }
        if (userData.dob) {
            return new Date(userData.dob);
        }
        return null;
    };

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
                    {avatarPreview ? (
                        <Avatar
                            src={avatarPreview}
                            alt={userData.username || 'User'}
                            sx={{
                                width: 160,
                                height: 160,
                                border: '0.5px solid',
                                borderColor: 'divider',
                                borderRadius: '10%',
                                mb: 2,
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: 160,
                                height: 160,
                                bgcolor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '64px',
                                mb: 2,
                                position: 'relative',
                                overflow: 'hidden',
                                border: '0.5px solid',
                                borderColor: 'divider',
                                borderRadius: '10%',
                            }}
                        >
                            {userData.username ? userData.username.charAt(0).toUpperCase() : '?'}
                        </Box>
                    )}

                    {/* Avatar URL input field - only shown when editing */}
                    {isEditing && (
                        <TextField
                            id="avatar-field"
                            label="Avatar URL"
                            name="avatar"
                            variant="outlined"
                            size="small"
                            value={formData.avatar}
                            onChange={handleInputChange}
                            fullWidth
                            placeholder="Enter image URL for avatar"
                            sx={{ mb: 2 }}
                            helperText="Enter a valid image URL to update your avatar"
                        />
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
                </Box>

                {/* User Information */}
                <Box sx={{ flex: 1 }}>
                    {/* Personal Information */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 3
                    }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                color: 'text.primary'
                            }}
                        >
                            Personal Information
                        </Typography>

                        {!isEditing ? (
                            <IconButton
                                onClick={handleEditToggle}
                                size="small"
                                color="primary"
                                sx={{
                                    py: 0.8,
                                    px: 1,
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
                                <EditIcon fontSize="small" />
                            </IconButton>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleEditToggle}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        py: 0.5,
                                        px: 2,
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleSave}
                                    sx={{
                                        py: 0.5,
                                        px: 2,
                                        fontSize: '0.8rem',
                                        bgcolor: '#000000',
                                        color: 'white',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 0 #00000080',
                                        textTransform: 'none',
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
                                    Save
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
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
                                        readOnly: !isEditing || !isEmailEditable
                                    }}
                                    disabled={isEditing && !isEmailEditable}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                {isEditing ? (
                                    <DatePicker
                                        label="Date of Birth"
                                        value={getDateValue()}
                                        onChange={handleDateChange}
                                        slotProps={{
                                            textField: {
                                                variant: "standard",
                                                fullWidth: true,
                                                helperText: "Select your date of birth"
                                            }
                                        }}
                                    />
                                ) : (
                                    <TextField
                                        id="dob-field"
                                        label="Date of Birth"
                                        name="dob"
                                        variant="standard"
                                        value={formattedDob}
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
};

export default UserInfoSection;