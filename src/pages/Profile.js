import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Avatar,
    Divider,
    CircularProgress,
} from '@mui/material';
import { fetchUserProfile, updateProfile, changePassword } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';

const profileValidationSchema = yup.object({
    name: yup.string().required('Name is required').min(3, 'Name should be at least 3 characters'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
});

const passwordValidationSchema = yup.object({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup.string().required('New password is required').min(6, 'Password should be at least 6 characters'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const Profile = () => {
    const dispatch = useDispatch();
    const { profile, loading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const profileFormik = useFormik({
        initialValues: {
            name: profile?.name || '',
            email: profile?.email || '',
        },
        enableReinitialize: true,
        validationSchema: profileValidationSchema,
        onSubmit: async (values) => {
            try {
                await dispatch(updateProfile(values)).unwrap();
                toast.success('Profile updated successfully!');
            } catch (error) {
                toast.error('Failed to update profile');
            }
        },
    });

    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: passwordValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                await dispatch(changePassword(values)).unwrap();
                toast.success('Password changed successfully!');
                resetForm();
            } catch (error) {
                toast.error('Failed to change password');
            }
        },
    });

    if (loading && !profile) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Profile Settings
            </Typography>

            <Grid container spacing={3}>
                {/* Profile Info Card */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: '0 auto',
                                    bgcolor: 'primary.main',
                                    fontSize: '3rem',
                                }}
                            >
                                {profile?.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" sx={{ mt: 2 }}>
                                {profile?.name}
                            </Typography>
                            <Typography color="text.secondary">
                                {profile?.email}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 1,
                                    px: 2,
                                    py: 0.5,
                                    bgcolor: 'primary.light',
                                    color: 'white',
                                    borderRadius: 1,
                                    display: 'inline-block'
                                }}
                            >
                                {profile?.role}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Update Profile Form */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Update Profile
                            </Typography>
                            <form onSubmit={profileFormik.handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="name"
                                            name="name"
                                            label="Full Name"
                                            value={profileFormik.values.name}
                                            onChange={profileFormik.handleChange}
                                            error={profileFormik.touched.name && Boolean(profileFormik.errors.name)}
                                            helperText={profileFormik.touched.name && profileFormik.errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            name="email"
                                            label="Email Address"
                                            value={profileFormik.values.email}
                                            onChange={profileFormik.handleChange}
                                            error={profileFormik.touched.email && Boolean(profileFormik.errors.email)}
                                            helperText={profileFormik.touched.email && profileFormik.errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={profileFormik.isSubmitting || loading}
                                        >
                                            Update Profile
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Change Password Form */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Change Password
                            </Typography>
                            <form onSubmit={passwordFormik.handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            label="Current Password"
                                            value={passwordFormik.values.currentPassword}
                                            onChange={passwordFormik.handleChange}
                                            error={passwordFormik.touched.currentPassword && Boolean(passwordFormik.errors.currentPassword)}
                                            helperText={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            label="New Password"
                                            value={passwordFormik.values.newPassword}
                                            onChange={passwordFormik.handleChange}
                                            error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                                            helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            label="Confirm New Password"
                                            value={passwordFormik.values.confirmPassword}
                                            onChange={passwordFormik.handleChange}
                                            error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                                            helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={passwordFormik.isSubmitting || loading}
                                        >
                                            Change Password
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;