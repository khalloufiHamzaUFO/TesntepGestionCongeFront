import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { strengthColor, strengthIndicator } from 'utils/password-strength'; // Importing password strength utilities
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// project import
import MainCard from 'components/MainCard';
import userService from "../../service/userService";

export default function UpdatePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [level, setLevel] = useState({});

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setNewPassword(value);
        changePassword(value);
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('❌ Passwords do not match!', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: { fontWeight: '600' }
            });
            return;
        }

        try {
            await userService.changePassword( currentPassword, newPassword);
            toast.success('🎉 Password changed successfully!', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: { fontWeight: '600' }
            });
        } catch (error) {
            toast.error(`❌ ${error.response.data.message}`, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: { fontWeight: '600' }
            });
        }
    };

    return (
        <Grid container spacing={3} alignItems="flex-start">
            <Grid item xs={12}>
                <Typography variant="h4">Update Password</Typography>
            </Grid>

            <Grid item xs={12} md={8}>
                <MainCard sx={{ mt: 2, minHeight: 350 }} content={false}>
                    <Box sx={{ padding: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Current Password"
                                        name="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="New Password"
                                        name="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={handlePasswordChange}
                                        fullWidth
                                    />
                                    {/* Password Strength Indicator */}
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item>
                                                <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle1" fontSize="0.75rem">
                                                    {level?.label}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Update Password
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </MainCard>
            </Grid>

            {/* ToastContainer renders the toast notifications */}
            <ToastContainer />
        </Grid>
    );
}
