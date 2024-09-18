// src/user-history/userInfo.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import userservice from 'src/service/userService';

export default function UserInfo() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userservice.fetchUserById(userId);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [userId]);

    return (
        <Grid item xs={12}>
            <Card sx={{ padding: 2 }}>
                <CardContent>


                    {user ? (
                        <Box>
                            <Grid container spacing={2}>

                                <Grid item xs={12} color={"blue"}>
                                    <Divider textAlign="left">Basic Info</Divider>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2"><strong>First Name:</strong> {user.prenom || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2"><strong>Last Name:</strong> {user.nom || 'N/A'}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2"><strong>Role:</strong> {user.role || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2"><strong>Enabled:</strong> {user.enabled ? 'Yes' : 'No'}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2"><strong>Email:</strong> {user.email || 'N/A'}</Typography>
                                </Grid>

                                <Grid item xs={12} color={"blue"}>
                                    <Divider textAlign="left">Dates</Divider>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2"><strong>Date of Birth:</strong> {user.dateDeNaissance ? new Date(user.dateDeNaissance).toLocaleDateString() : 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2"><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2"><strong>Member Since:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2"><strong>Last Update:</strong> {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}</Typography>
                                </Grid>

                                <Grid item xs={12} color={"blue"}>
                                    <Divider textAlign="left">Additional Info</Divider>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="body2"><strong>Solde Conge:</strong> {user.soldeConge !== null ? user.soldeConge : 'N/A'}</Typography>
                                </Grid>

                            </Grid>
                        </Box>
                    ) : (
                        <Typography variant="body1">Loading user data...</Typography>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
}
