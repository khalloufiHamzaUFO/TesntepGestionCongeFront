// material-ui
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <MainCard>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h1" color="error" gutterBottom>
                    403
                </Typography>
                <Typography variant="h4" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                    You do not have permission to view this page.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoBack}>
                    Go Back
                </Button>
            </Box>
        </MainCard>
    );
}