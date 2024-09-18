import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, Button, Stack, Typography,
    Pagination, TextField, MenuItem, Select, InputLabel, FormControl, Box, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import Dot from 'components/@extended/Dot';
import { getAllConges, deleteDemandeDeCongeById, findAllDemandsByUser } from '../../service/congeDemandeService';
import { Info } from '@mui/icons-material';

const statusMap = {
    'EN_ATTENTE': { color: 'warning', title: 'Pending' },
    'APPROUVE': { color: 'success', title: 'Approved' },
    'REFUSE': { color: 'error', title: 'Rejected' }
};

const formatDate = (date) => {
    if (!date) return 'Unknown';
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString(); // You can use toLocaleDateString or toLocaleString for more detailed output
};

const formatElapsedTime = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const parsedDate = new Date(date);
    const diffMs = now - parsedDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays} day(s) ago`;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) return `${diffHours} hour(s) ago`;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes > 0) return `${diffMinutes} minute(s) ago`;

    return 'Just now';
};

const CongesTable = () => {
    const [conges, setConges] = useState([]);
    const [filteredConges, setFilteredConges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedConge, setSelectedConge] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userRole = storedUser?.role;
    const userId = storedUser?.id;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                if (userRole === 'RESPONSABLE') {
                    data = await getAllConges();
                } else if (userRole === 'EMPLOYE') {
                    data = await findAllDemandsByUser(userId);
                }
                if (data && data.length > 0) {
                    setConges(data.reverse());
                } else {
                    setConges([]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch conges:', err);
                setError('Failed to load data.');
                setLoading(false);
            }
        };

        fetchData();
    }, [userRole, userId]);

    useEffect(() => {
        const filtered = conges
            .filter(conge =>
                conge.motif.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (selectedStatus ? conge.etat === selectedStatus : true)
            );
        setFilteredConges(filtered);
    }, [conges, searchQuery, selectedStatus]);

    const handleEdit = (id) => {
        navigate(`/editConge/${id}`);
    };

    const handleView = async (id) => {
        try {
            const conge = await getAllConges().then(data => data.find(item => item.id === id));
            setSelectedConge(conge);
            setOpenDetailsDialog(true);
        } catch (err) {
            console.error('Failed to fetch conge details:', err);
            setError('Failed to load details.');
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setOpenDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedId) {
            try {
                await deleteDemandeDeCongeById(selectedId);
                setConges(conges.filter(conge => conge.id !== selectedId));
                setOpenDialog(false);
            } catch (error) {
                console.error('Failed to delete the demande:', error);
                setError('Failed to delete the demande.');
                setOpenDialog(false);
            }
        }
    };

    const handleDeleteCancel = () => {
        setOpenDialog(false);
    };

    const handleAdd = () => {
        navigate('/addForm');
    };

    const handleViewDetails = (id) => {
        navigate(`/detailsConge/${id}`);
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedConges = filteredConges.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredConges.length / itemsPerPage);

    return (
        <>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {!loading && !error && (
                <>
                    <Box display="flex" justifyContent="space-between" p={2} alignItems="center">
                        <Box flexGrow={1} mr={2}>
                            <TextField
                                label="Search by Motif"
                                variant="outlined"
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Box>
                        <Box flexGrow={1} mr={2}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {Object.keys(statusMap).map(status => (
                                        <MenuItem key={status} value={status}>
                                            {statusMap[status].title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    {filteredConges.length > 0 ? (
                        <>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Motif</TableCell>
                                            <TableCell>Start Date</TableCell>
                                            <TableCell>End Date</TableCell>
                                            <TableCell>Employe Nom</TableCell>
                                            <TableCell>Employe Prenom</TableCell>
                                            <TableCell>Etat</TableCell>
                                            <TableCell>Created At</TableCell>
                                            <TableCell>Last Update</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedConges.map((conge) => (
                                            <TableRow key={conge.id}>
                                                <TableCell>{conge.motif}</TableCell>
                                                <TableCell>{conge.dateDebut}</TableCell>
                                                <TableCell>{conge.dateFin}</TableCell>
                                                <TableCell>
                                                    {conge.utilisateur ? conge.utilisateur.nom : 'Unknown'}
                                                </TableCell>
                                                <TableCell>
                                                    {conge.utilisateur ? conge.utilisateur.prenom : 'Unknown'}
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Dot color={statusMap[conge.etat]?.color || 'primary'} />
                                                        <Typography>{statusMap[conge.etat]?.title || 'Unknown'}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(conge.createdAt)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatElapsedTime(conge.updatedAt)}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleViewDetails(conge.id)} color="info">
                                                        <Info />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleEdit(conge.id)} color="primary">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDeleteClick(conge.id)} color="secondary">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box display="flex" justifyContent="center" p={2}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        </>
                    ) : (
                        <Typography>No leave requests available.</Typography>
                    )}

                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this leave request?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteCancel} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteConfirm} color="secondary">
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} fullWidth maxWidth="sm">
                        <DialogTitle>Leave Request Details</DialogTitle>
                        <DialogContent>
                            {selectedConge && (
                                <Box>
                                    <Typography variant="h6">Motif: {selectedConge.motif}</Typography>
                                    <Typography variant="body1">Start Date: {selectedConge.dateDebut}</Typography>
                                    <Typography variant="body1">End Date: {selectedConge.dateFin}</Typography>
                                    <Typography variant="body1">Employe Nom: {selectedConge.utilisateur?.nom}</Typography>
                                    <Typography variant="body1">Employe Prenom: {selectedConge.utilisateur?.prenom}</Typography>
                                    <Typography variant="body1">Status: {statusMap[selectedConge.etat]?.title}</Typography>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDetailsDialog(false)} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    );
};

export default CongesTable;
