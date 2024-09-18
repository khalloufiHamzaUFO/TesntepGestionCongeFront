import React, { useEffect, useState } from 'react';
import { getAllConges } from '../../service/congeDemandeService'; // Import only the needed service
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Typography
} from '@mui/material';
import Dot from 'components/@extended/Dot'; // Ensure this component is correctly imported

const statusMap = {
    'EN_ATTENTE': { color: 'warning', title: 'Pending' },
    'APPROUVE': { color: 'success', title: 'Approved' },
    'REFUSE': { color: 'error', title: 'Rejected' }
};

const AcceptedConge = () => {
    const [conges, setConges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllConges();
                // Filter data to show only accepted requests
                const acceptedConges = data.filter(conge => conge.etat === 'APPROUVE');
                setConges(acceptedConges);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch conges:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Motif</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Etat</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {conges.map((conge) => (
                        <TableRow key={conge.id}>
                            <TableCell>{conge.id}</TableCell>
                            <TableCell>{conge.motif}</TableCell>
                            <TableCell>{conge.dateDebut}</TableCell>
                            <TableCell>{conge.dateFin}</TableCell>
                            <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Dot color={statusMap[conge.etat]?.color || 'primary'} />
                                    <Typography>{statusMap[conge.etat]?.title || 'Unknown'}</Typography>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AcceptedConge;
