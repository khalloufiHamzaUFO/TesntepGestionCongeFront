import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { addDemandeDeConge } from '../../service/congeDemandeService';

const AddDemandeForm = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reason, setReason] = useState('');
    const [etat, setEtat] = useState('');
    const [error, setError] = useState(null);   
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            setError('No user is logged in.');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate || !reason) {
            setError('All fields are required.');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;

        if (!userId) {
            setError('No user ID found.');
            return;
        }

        const demandeDeConge = {
            dateDebut: startDate.toISOString().split('T')[0],
            dateFin: endDate.toISOString().split('T')[0],
            motif: reason,
            etat: "EN_ATTENTE",
            utilisateur: { id: userId },
        };

        console.log('User ID:', userId);
        console.log('Demande de Conge:', demandeDeConge);
        
        try {
            await addDemandeDeConge(demandeDeConge, userId);
            navigate('/demandes');
        } catch (err) {
            setError('Failed to add leave request. Please try again later.');
            console.error(err);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
                Create New Leave Request
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Motif"
                            fullWidth
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Start Date"
                            required
                            customInput={<TextField label="Start Date" fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="End Date"
                            required
                            customInput={<TextField label="End Date" fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default AddDemandeForm;