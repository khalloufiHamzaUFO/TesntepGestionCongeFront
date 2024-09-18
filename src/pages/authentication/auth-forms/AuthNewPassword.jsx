import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import AnimateButton from 'components/@extended/AnimateButton';
import userService from "../../../service/userService";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ================================|| AUTH RESET PASSWORD - FORM ||================================ //

export default function AuthResetPassword() {
    const { email } = useParams();  // Get the email from the URL
    const navigate = useNavigate();  // For navigation after successful reset
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError('Both fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await userService.resetPassword(email, newPassword);
            toast.success('Password reset successfully! Redirecting to login...', {
                position: "bottom-right",
                autoClose: 3000, // 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect after 3 seconds
        } catch (err) {
            console.error('Error resetting password:', err);
            toast.error('Failed to reset password. Please try again later.', {
                position: "bottom-right",
                autoClose: 5000, // 5 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    return (
        <form noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
                <InputLabel htmlFor="new-password">New Password</InputLabel>
                <OutlinedInput
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter new password"
                    fullWidth
                    error={Boolean(error)}
                />
                <InputLabel htmlFor="confirm-password">Confirm New Password</InputLabel>
                <OutlinedInput
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                    fullWidth
                    error={Boolean(error)}
                />
                {error && (
                    <FormHelperText error id="password-error">
                        {error}
                    </FormHelperText>
                )}
                <AnimateButton>
                    <Button
                        disableElevation
                        disabled={!newPassword || !confirmPassword}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Set New Password
                    </Button>
                </AnimateButton>
            </Stack>
            <ToastContainer />
        </form>
    );
}
