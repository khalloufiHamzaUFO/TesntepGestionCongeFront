import React, { useState } from 'react';
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
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');  // Clear any existing errors
        if (!email) {
            setError('Email is required');
            toast.error('Email is required', { position: "bottom-right", theme: "colored" });
        } else {
            try {
                // Call the service method to send the reset password email
                await userService.sendResetPasswordEmail(email);
                toast.success('Reset link sent! Check your email.', { position: "bottom-right", theme: "colored" });
            } catch (err) {
                console.error('Error sending reset password email:', err);

                // Extract error message from backend response or use fallback
                const backendMessage = err.message || 'Failed to send reset email. Please try again later.';

                // Show the specific backend error message in toast
                toast.error(backendMessage, { position: "bottom-right", theme: "colored" });

                setError(backendMessage); // Also set error in form
            }
        }
    };

    return (
        <>
            <form noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <InputLabel htmlFor="email-reset">Email Address</InputLabel>
                    <OutlinedInput
                        id="email-reset"
                        type="email"
                        value={email}
                        name="email"
                        onBlur={() => setError('')}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter email address"
                        fullWidth
                        error={Boolean(error)}
                    />
                    {error && (
                        <FormHelperText error id="email-reset-error">
                            {error}
                        </FormHelperText>
                    )}
                    <AnimateButton>
                        <Button
                            disableElevation
                            disabled={!email}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Send Reset Link
                        </Button>
                    </AnimateButton>
                </Stack>
            </form>
            {/* Toast Container for Notifications */}
            <ToastContainer />
        </>
    );
}
