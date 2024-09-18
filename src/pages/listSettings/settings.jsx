import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// project import
import MainCard from 'components/MainCard';
// assets
import userService from "../../service/userService"; // Service to fetch user data

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cinError, setCinError] = useState('');
    const [dateError, setDateError] = useState('');

    useEffect(() => {
        // Fetch user data from the service
        userService.fetchUser()
            .then((userData) => {
                // Ensure date is formatted as YYYY-MM-DD
                if (userData.dateDeNaissance) {
                    userData.dateDeNaissance = new Date(userData.dateDeNaissance).toISOString().split('T')[0];
                }
                setUser(userData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Failed to fetch user data:', error);
                setError('Failed to load user data');
                setLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "cin") {
            if (!/^\d{8}$/.test(value)) {
                setCinError("CIN must be exactly 8 digits");
            } else {
                setCinError('');
            }
        }
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        if (new Date(date) > new Date()) {
            setDateError('Date of Birth cannot be in the future');
        } else {
            setDateError('');
            setUser((prevUser) => ({
                ...prevUser,
                dateDeNaissance: date,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cinError || dateError) {
            toast.error('Please fix the errors before submitting', {
                position: "bottom-right"
            });
            return;
        }

        try {
            const updatedUser = await userService.updateUser(user);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            toast.success('User information updated successfully', {
                position: "bottom-right"
            });
        } catch (err) {
            console.error('Failed to update user information:', err);
            setError('Failed to update user information');
            toast.error('Failed to update user information', {
                position: "bottom-right"
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleImageUpload = async (e) => {
        console.log("pic");
    }

    return (
        <Grid container spacing={3} alignItems="flex-start">
            <ToastContainer position="bottom-right" />
            <Grid item xs={12}>
                <Typography variant="h4">Account Settings</Typography>
            </Grid>

            <Grid item xs={12} md={8}>
                <MainCard sx={{ mt: 2, minHeight: 450 }} content={false}>
                    <Box sx={{ padding: 3 }}>
                        {/* Account Verified and Enabled Message */}
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'green' }}>
                            ✅ Account is verified and enabled
                        </Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="First Name"
                                        name="prenom"
                                        value={user.prenom || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Last Name"
                                        name="nom"
                                        value={user.nom || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={user.email || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="CIN Number"
                                        name="cin"
                                        value={user.cin || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        error={!!cinError}
                                        helperText={cinError}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Date of Birth"
                                        name="dateDeNaissance"
                                        type="date"
                                        value={user.dateDeNaissance || ''}
                                        onChange={handleDateChange}
                                        fullWidth
                                        error={!!dateError}
                                        helperText={dateError}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Role"
                                        name="role"
                                        value={user.role || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Solde Conge"
                                        name="soldeConge"
                                        value={user.soldeConge || 'N/A'}
                                        onChange={handleInputChange}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Update Information
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </MainCard>
            </Grid>

            <Grid item xs={12} md={4} sx={{ mt: 2 }}>
                <MainCard sx={{ minHeight: 450 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                        <Avatar
                            alt="User Avatar"
                            src={user.avatar || '/static/images/avatar/1.jpg'}
                            sx={{ width: 100, height: 100, mb: 2 }}
                        />
                        <Button variant="contained" component="label">
                            Upload an ID Scan
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </Button>
                        <Typography variant="caption" sx={{ mt: 1 }}>
                            * recommended size minimum 550px
                        </Typography>
                    </Box>
                </MainCard>
            </Grid>
        </Grid>
    );
}
