import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// project import
import MainCard from 'components/MainCard';
// assets
import defaultAvatar from 'assets/images/users/avatar-1.png';
import userService from "../../service/userService"; // Service to fetch user data
import { getSoldeByUser } from "../../service/SoldeService"; // Import the getSoldeByUser function

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [soldeConge, setSoldeConge] = useState(null); // State for solde conge
    const [loadingSolde, setLoadingSolde] = useState(true); // State to manage solde loading

    useEffect(() => {
        // Fetch user data from the service
        userService.fetchUser() // Assuming it fetches the logged-in user's data
            .then(async (userData) => {
                setUser(userData);

                // Fetch solde conge based on the user's ID
                if (userData?.id) {
                    try {
                        const soldeData = await getSoldeByUser(userData.id); // Fetch solde using user's ID
                        setSoldeConge(soldeData.solde); // Assuming soldeData contains the solde field
                    } catch (error) {
                        console.error('Failed to fetch solde conge:', error);
                    }
                }

                setLoadingSolde(false); // Set solde loading to false
            })
            .catch((error) => console.error('Failed to fetch user data:', error));
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Handle the image upload logic here
            console.log("Uploaded file:", file);
        }
    };

    return (
        <Grid container spacing={3} alignItems="flex-start"> {/* Ensure alignment to top */}
            <Grid item xs={12}>
                <Typography variant="h4">My Profile</Typography>
            </Grid>

            <Grid item xs={12} md={8}>
                <MainCard sx={{ mt: 2, minHeight: 350 }} content={false}> {/* Set minHeight to ensure the card is taller */}
                    <Box sx={{ padding: 3 }}>
                        {/* Profile Details */}
                        <Typography variant="h5" gutterBottom>
                            Your details
                        </Typography>
                        {user ? (
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>First Name:</strong> {user.prenom || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Last Name:</strong> {user.nom || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Email:</strong> {user.email || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Role:</strong> {user.role || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Enabled:</strong> {user.enabled ? 'Yes' : 'No'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Date of Birth:</strong> {user.dateDeNaissance ? new Date(user.dateDeNaissance).toLocaleDateString() : 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Solde Conge:</strong>
                                        {loadingSolde ? 'Loading...' : soldeConge !== null ? soldeConge : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Member since:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Last update:</strong> {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}</Typography>
                                </Grid>
                            </Grid>
                        ) : (
                            <Typography variant="body1">Loading user data...</Typography>
                        )}
                    </Box>
                </MainCard>
            </Grid>

            <Grid item xs={12} md={4}>
                <MainCard sx={{ mt: 2, minHeight: 350 }}> {/* Same minHeight to match the height of the other card */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                        <Avatar
                            alt="User Avatar"
                            src={user?.avatarUrl || defaultAvatar} // Replace with user's actual avatar if available
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
