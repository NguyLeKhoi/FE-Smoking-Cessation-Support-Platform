import React, { useRef, useState, useEffect } from 'react';
import { Button, Typography, Box, Paper, Grid, TextField, Avatar, IconButton, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { format } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import mediaService from '../../services/mediaService';
import { fetchCurrentUser, updateCurrentUser } from '../../services/userService';
import { toast } from 'react-toastify';

const UserInfoSection = ({ onUserUpdated }) => {
    const fileInputRef = useRef();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        dob: '',
        phone_number: '',
        avatar: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setLoading(true);
                const response = await fetchCurrentUser();
                setUserData(response.data);
                setFormData({
                    email: response.data.email || '',
                    first_name: response.data.first_name || '',
                    last_name: response.data.last_name || '',
                    dob: response.data.dob || '',
                    phone_number: response.data.phone_number || '',
                    avatar: response.data.avatar || '',
                });
            } catch (err) {
                setError('Failed to load user profile. Please try again later.');
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };
        loadUserProfile();
    }, []);

    const handleEditToggle = () => {
        setIsEditing((prev) => {
            const next = !prev;
            if (next) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    avatar: userData?.avatar || ''
                }));
            }
            return next;
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const updatedUserData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_number: formData.phone_number,
                avatar: formData.avatar,
                dob: formData.dob
            };
            setLoading(true);
            const response = await updateCurrentUser(updatedUserData);
            setUserData(prevData => ({
                ...prevData,
                ...response.data,
                dob: response.data.dob || prevData.dob
            }));
            setFormData(prevFormData => ({
                ...prevFormData,
                first_name: response.data.first_name || prevFormData.first_name,
                last_name: response.data.last_name || prevFormData.last_name,
                phone_number: response.data.phone_number || prevFormData.phone_number,
                avatar: response.data.avatar || prevFormData.avatar,
                email: prevFormData.email,
                dob: response.data.dob || prevFormData.dob
            }));
            setIsEditing(false);
            setError(null);
            if (onUserUpdated) onUserUpdated(response.data);
        } catch (err) {
            // Show detailed error messages if available
            let errorMsg = 'Failed to update profile. Please try again.';
            if (err.response && err.response.data) {
                if (Array.isArray(err.response.data.message)) {
                    errorMsg = err.response.data.message.join(' ');
                } else if (typeof err.response.data.message === 'string') {
                    errorMsg = err.response.data.message;
                }
            }
            setError(errorMsg);
            console.error('Error updating profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const formattedDob = React.useMemo(() => {
        if (!userData?.dob) return 'Not provided';
        try {
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
    }, [userData?.dob]);

    const isEmailEditable = !userData?.email;
    const avatarPreview = isEditing ? formData.avatar || userData?.avatar : userData?.avatar;

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

    const getDateValue = () => {
        if (formData.dob) {
            return new Date(formData.dob);
        }
        if (userData?.dob) {
            return new Date(userData.dob);
        }
        return null;
    };

    // Avatar upload handler
    const handleAvatarUpload = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const formDataData = new FormData();
        formDataData.append('images', file);
        try {
            const res = await mediaService.uploadImages(formDataData);
            let newAvatarUrl = '';
            if (res && Array.isArray(res.data) && res.data.length > 0 && res.data[0].url) {
                newAvatarUrl = res.data[0].url;
            }
            if (newAvatarUrl) {
                setFormData((prev) => ({ ...prev, avatar: newAvatarUrl }));
            }
        } catch (error) {
            let errorMsg = 'Avatar upload failed. Please try again.';
            if (error.response && error.response.data && error.response.data.message) {
                if (error.response.data.message.includes('Inappropriate image content detected')) {
                    errorMsg = 'Inappropriate image content detected. Please choose another image.';
                } else {
                    errorMsg = error.response.data.message;
                }
            }
            toast.error(errorMsg);
            console.error('Avatar upload failed:', error);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}><CircularProgress /></Box>;
    }
    if (error) {
        return <Box sx={{ color: 'error.main', textAlign: 'center', p: 2 }}>{error}</Box>;
    }
    if (!userData) {
        return <Box sx={{ color: 'error.main', textAlign: 'center', p: 2 }}>No profile data available</Box>;
    }

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
                    minWidth: '200px',
                    position: 'relative'
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

                    {/* Avatar upload button */}
                    {isEditing && (
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarUpload}
                            />
                            <IconButton
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                sx={{
                                    position: 'absolute',
                                    bottom: 60,
                                    right: 16,
                                    bgcolor: 'white',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: 1,
                                    width: 40,
                                    height: 40,
                                    zIndex: 2,
                                    '&:hover': { bgcolor: '#f0f0f0' },
                                }}
                            >
                                <PhotoCamera fontSize="medium" />
                            </IconButton>
                        </>
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