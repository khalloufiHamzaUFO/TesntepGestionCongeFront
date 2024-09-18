import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Grid, Stack, Button, MenuItem, Select, FormControl, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import { getDemandeDeCongeById, updateDemandeDeCongeStatus } from '../../service/congeDemandeService';
import ComponentSkeleton from '../component-overview/ComponentSkeleton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dot from 'components/@extended/Dot';
import { CloseOutlined } from '@ant-design/icons';
import { LoadingButton } from '@mui/lab';
import { SendOutlined } from '@ant-design/icons';
import { getSoldeByUser } from '../../service/SoldeService';

const DetailsConge = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [conge, setConge] = useState(null);
    const [soldeConge, setSoldeConge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStatus, setNewStatus] = useState('EN_ATTENTE');
    const [justification, setJustification] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResponsable, setIsResponsable] = useState(false); // For checking if the user is responsable

    const statusMap = {
        'EN_ATTENTE': { color: 'warning', title: 'Pending' },
        'APPROUVE': { color: 'success', title: 'Approved' },
        'REFUSE': { color: 'error', title: 'Rejected' }
    };

    // Check if the user is responsable or not
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')); // Assuming user data is stored in localStorage
        if (user && user.role === 'RESPONSABLE') {
            setIsResponsable(true); // User is responsable
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDemandeDeCongeById(id);
                setConge(data);
                setNewStatus(data.etat);

                if (data.utilisateur?.id) {
                    const soldeData = await getSoldeByUser(data.utilisateur.id);
                    setSoldeConge(soldeData.solde);
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch demande details.');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const handleSendClick = async () => {
        setIsLoading(true);
        try {
            await updateDemandeDeCongeStatus(id, newStatus, justification);

            toast.success("Status updated successfully and user has been notified!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            setTimeout(() => {
                navigate(-1);
            }, 3000);
        } catch (error) {
            toast.error(`Failed to update status: ${error.message}`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <ComponentSkeleton>
            <ToastContainer />

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <MainCard
                        title={
                            <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 'bold', fontSize: '20px', marginTop: '5px' }}>
                                Les détails de la demande  : {conge ? conge.motif : 'Unknown'}
                            </Typography>
                        }
                    >
                        <Stack spacing={2.5} sx={{ mt: -0.5 }}>
                            <Typography variant="h6"><strong>Nom de la demande :</strong> {conge ? conge.motif : 'Unknown'}</Typography>
                            <Typography variant="h6"><strong>Start Date:</strong> {conge ? conge.dateDebut : 'Unknown'}</Typography>
                            <Typography variant="h6"><strong>End Date:</strong> {conge ? conge.dateFin : 'Unknown'}</Typography>
                            <Typography variant="h6"><strong>Etat:</strong></Typography>
                            <FormControl fullWidth>
                                <Stack direction="row" spacing={1} marginTop={1}>
                                    <FormControl fullWidth>
                                        <Select
                                            value={newStatus}
                                            onChange={handleStatusChange}
                                            disabled={!isResponsable} // Disable if not responsable
                                        >
                                            {Object.keys(statusMap).map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Dot color={statusMap[status].color} />
                                                        <Typography>{statusMap[status].title}</Typography>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </FormControl>
                            <TextField
                                label="Motif de la décision"
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Provide a reason for your decision"
                                disabled={!isResponsable} // Disable if not responsable
                            />
                        </Stack>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2} justifyContent="flex-end" marginTop={5}>
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSendClick}
                                    loading={isLoading}
                                    endIcon={<SendOutlined />}
                                    disabled={!isResponsable} // Disable if not responsable
                                >
                                    Send
                                </LoadingButton>
                                <Button
                                    color="error"
                                    endIcon={<CloseOutlined />}
                                    onClick={handleBackClick}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Grid>
                    </MainCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <MainCard
                        title={
                            <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 'bold', fontSize: '20px', marginTop: '5px' }}>
                                Les détails du demandeur
                            </Typography>
                        }
                    >
                        <Stack spacing={3}>
                            <Typography variant="h6"><strong>Nom d'Employe:</strong> {conge && conge.utilisateur ? conge.utilisateur.nom : 'Unknown'}</Typography>
                            <Typography variant="h6"><strong>Prenom d'Employe:</strong> {conge && conge.utilisateur ? conge.utilisateur.prenom : 'Unknown'}</Typography>
                            <Typography variant="h6"><strong>Email d'Employe:</strong> {conge && conge.utilisateur ? conge.utilisateur.email : 'Unknown'}</Typography>
                            <Typography variant="h6"><strong>Cin d'Employe :</strong> {conge && conge.utilisateur ? conge.utilisateur.cin : 'Unknown'}</Typography>
                            <Typography variant="h6"><strong>Date De Naissance d'Employe:</strong> {conge && conge.utilisateur ? conge.utilisateur.dateDeNaissance : 'Unknown'}</Typography>
                            <Typography variant="h6">
                                <strong>Solde de conge restant d'Employe:</strong> {soldeConge !== null ? soldeConge : 'Unknown'}
                            </Typography>
                        </Stack>
                    </MainCard>
                </Grid>
            </Grid>
        </ComponentSkeleton>
    );
};

export default DetailsConge;
