import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import authService from '../../../service/authService';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// react-toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AuthRegister() {
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Use navigate for programmatic navigation

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('');
    }, []);

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            console.log(values);  // Debug: Check if dateNaissance is correctly populated

            const formattedValues = {
                nom: values.lastname,
                prenom: values.firstname,
                cin: values.cin,
                dateNaissance: values.dateNaissance ? values.dateNaissance.toISOString().split('T')[0] : null,  // Convert to YYYY-MM-DD format
                email: values.email,
                password: values.password
            };
            console.log(formattedValues);

            const response = await authService.register(formattedValues);
            console.log("Registration successful:", response);

            // Trigger success toast
            toast.success("Registration successful! Please check your email to activate your account.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // Redirect after a 3-second delay
            setTimeout(() => {
                navigate('/login'); // Redirect after a delay to allow the user to read the message
            }, 3000); // Delay for 3 seconds
        } catch (error) {
            console.error("Registration error:", error);

            // Handle specific error message
            const errorMessage = error.message || 'An unexpected error occurred.';

            // Trigger error toast
            toast.error(errorMessage, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // Also set the form's submit error
            setErrors({ submit: errorMessage });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    firstname: '',
                    lastname: '',
                    cin: '',
                    dateNaissance: null,
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    firstname: Yup.string().max(255).required('First Name is required'),
                    lastname: Yup.string().max(255).required('Last Name is required'),
                    cin: Yup.string()
                        .matches(/^[0-9]{8}$/, 'Numero CIN must be exactly 8 digits')
                        .required('Numero CIN is required'),
                    dateNaissance: Yup.date().nullable().required('Birthdate is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={handleSubmit} // Use the handleSubmit function
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                                    <OutlinedInput
                                        id="firstname-signup"
                                        type="text"
                                        value={values.firstname}
                                        name="firstname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="John"
                                        fullWidth
                                        error={Boolean(touched.firstname && errors.firstname)}
                                    />
                                </Stack>
                                {touched.firstname && errors.firstname && (
                                    <FormHelperText error id="helper-text-firstname-signup">
                                        {errors.firstname}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.lastname && errors.lastname)}
                                        id="lastname-signup"
                                        type="text"
                                        value={values.lastname}
                                        name="lastname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        inputProps={{}}
                                    />
                                </Stack>
                                {touched.lastname && errors.lastname && (
                                    <FormHelperText error id="helper-text-lastname-signup">
                                        {errors.lastname}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="cin-signup">Numero CIN*</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.cin && errors.cin)}
                                        id="cin-signup"
                                        type="text"
                                        value={values.cin}
                                        name="cin"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="12345678"
                                        inputProps={{ maxLength: 8 }}
                                    />
                                </Stack>
                                {touched.cin && errors.cin && (
                                    <FormHelperText error id="helper-text-cin-signup">
                                        {errors.cin}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="dateNaissance-signup">Birthdate*</InputLabel>
                                    <ReactDatePicker
                                        id="dateNaissance-signup"
                                        selected={values.dateNaissance} // Bind the Formik value to the date picker
                                        onChange={(date) => setFieldValue('dateNaissance', date)} // Correctly set Formik's field value
                                        dateFormat="yyyy/MM/dd"
                                        placeholderText="Select a date" // Provide a placeholder
                                        customInput={
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.dateNaissance && errors.dateNaissance)}
                                                placeholder="YYYY/MM/DD"
                                            />
                                        }
                                    />
                                    {touched.dateNaissance && errors.dateNaissance && (
                                        <FormHelperText error id="helper-text-dateNaissance-signup">
                                            {errors.dateNaissance}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                        id="email-signup"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="demo@company.com"
                                        inputProps={{}}
                                    />
                                </Stack>
                                {touched.email && errors.email && (
                                    <FormHelperText error id="helper-text-email-signup">
                                        {errors.email}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-signup">Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="password-signup"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    color="secondary"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="******"
                                        inputProps={{}}
                                    />
                                </Stack>
                                {touched.password && errors.password && (
                                    <FormHelperText error id="helper-text-password-signup">
                                        {errors.password}
                                    </FormHelperText>
                                )}
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
                                <Typography variant="body2">
                                    By Signing up, you agree to our &nbsp;
                                    <Link variant="subtitle2" component={RouterLink} to="#">
                                        Terms of Service
                                    </Link>
                                    &nbsp; and &nbsp;
                                    <Link variant="subtitle2" component={RouterLink} to="#">
                                        Privacy Policy
                                    </Link>
                                </Typography>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                        Create Account
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>

            {/* Toast Container for Notifications */}
            <ToastContainer />
        </>
    );
}
