import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import DemandsTable from './UserHistory';
import UserInfo from './userInfo'; // Importing the new UserInfo component

export default function UserManagementDefault() {
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* User Info Section */}
            <Grid item xs={12} md={4}> {/* Adjust the grid size to 30% (4/12) */}
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">User Details</Typography>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <UserInfo /> {/* Displaying the user info here */}
                </MainCard>
            </Grid>

            {/* User History Section */}
            <Grid item xs={12} md={8}> {/* Adjust the grid size to 70% (8/12) */}
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">User History</Typography>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <DemandsTable />
                </MainCard>
            </Grid>
        </Grid>
    );
}
