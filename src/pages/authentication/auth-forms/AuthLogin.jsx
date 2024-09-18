import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import FirebaseSocial from './FirebaseSocial';

// service import
import loginService from '../../../service/authService';
import userService from "../../../service/userService";

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      const response = await loginService.login({
        email: values.email,
        password: values.password,
      });

      console.log("Login successful", response);

      // Fetch user and save to localStorage
      const fetchedUser = await userService.fetchUser(values.email);

      console.log("Fetched User:", fetchedUser); // Debug log

      // Save user to localStorage (ensure the role is correctly saved)
      localStorage.setItem('user', JSON.stringify(fetchedUser));

      // Trigger a state update or force a component re-render
      window.location.href = '/dashboard/default'; // Redirect and force re-render
    } catch (error) {
      console.error("Login failed", error);

      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.statusText;

        // Display the error message using a toast
        toast.error(`Request failed with status ${error.response.status}: ${errorMessage}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (error.request) {
        toast.error('No response from server. Please check your network connection.', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(`Error: ${error.message}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <>
        <Formik
            initialValues={{
              email: '',
              password: '',
              submit: null,
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required'),
            })}
            onSubmit={handleSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-login">Email Address</InputLabel>
                      <OutlinedInput
                          id="email-login"
                          type="email"
                          value={values.email}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          fullWidth
                          error={Boolean(touched.email && errors.email)}
                      />
                    </Stack>
                    {touched.email && errors.email && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                          {errors.email}
                        </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-login">Password</InputLabel>
                      <OutlinedInput
                          fullWidth
                          error={Boolean(touched.password && errors.password)}
                          id="password-login"
                          type={showPassword ? 'text' : 'password'}
                          value={values.password}
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
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
                          placeholder="Enter password"
                      />
                    </Stack>
                    {touched.password && errors.password && (
                        <FormHelperText error id="standard-weight-helper-text-password-login">
                          {errors.password}
                        </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} sx={{ mt: -1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <FormControlLabel
                          control={
                            <Checkbox
                                checked={checked}
                                onChange={(event) => setChecked(event.target.checked)}
                                name="checked"
                                color="primary"
                                size="small"
                            />
                          }
                          label={<Typography variant="h6">Keep me sign in</Typography>}
                      />
                      <Link variant="h6" component={RouterLink} to="/forgot-my-password" color="text.primary">
                        Forgot Password?
                      </Link>
                    </Stack>
                  </Grid>
                  {errors.submit && (
                      <Grid item xs={12}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                      </Grid>
                  )}
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                        Login
                      </Button>
                    </AnimateButton>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider>
                      <Typography variant="caption"> Login with</Typography>
                    </Divider>
                  </Grid>
                  <Grid item xs={12}>
                    <FirebaseSocial />
                  </Grid>
                </Grid>
              </form>
          )}
        </Formik>
        <ToastContainer />
      </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
