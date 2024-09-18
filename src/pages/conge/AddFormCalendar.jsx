import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Button, Dialog, DialogActions, DialogContent, TextField, Typography, Fab } from '@mui/material';
import { UploadOutlined, PlusCircleOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addDemandeDeConge, getAllConges, editDemandeDeConge, deleteDemandeDeCongeById } from '../../service/congeDemandeService';

const CalendarView = () => {
    const [events, setEvents] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const fileInputRef = useRef(null);

    const getColorForStatus = (status) => {
        switch (status) {
            case 'REFUSE':
                return 'red';
            case 'EN_ATTENTE':
                return '#fdd926';
            case 'APPROUVE':
                return '#a4e519';
            default:
                return 'gray';
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const conges = await getAllConges();
                const formattedEvents = conges.map(conge => {
                    const color = getColorForStatus(conge.etat);
                    return {
                        id: conge.id,
                        title: conge.motif,
                        start: conge.dateDebut,
                        end: conge.dateFin,
                        backgroundColor: color,
                        borderColor: color,
                        textColor: 'white',
                    };
                });
                setEvents(formattedEvents);
            } catch (err) {
                toast.error('Failed to load events.');
            }
        };
        fetchEvents();
    }, []);

    const isValidDateSelection = (start, end) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
    
        if (start < tomorrow) {
            return false;
        }
    
        return true;
    };
    
    const handleDateSelect = (selectInfo) => {
        const start = new Date(selectInfo.startStr);
        const end = new Date(selectInfo.endStr);

        if (!isValidDateSelection(start, end)) {
            toast.error('Please select days starting from tomorrow.');
        } else {
            setStartDate(selectInfo.startStr.split('T')[0]);
            setEndDate(selectInfo.endStr.split('T')[0]);
            setReason('');
            setEditMode(false);
            setDialogOpen(true);
        }
    };

    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        setSelectedEventId(event.id);
        setStartDate(event.startStr);
        setEndDate(event.endStr);
        setReason(event.title);
        setEditMode(true);
        setDialogOpen(true);
    };

    const handleFabClick = () => {
        setDialogOpen(true);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        // Validate date selection
        if (!isValidDateSelection(start, end)) {
            toast.error('Please select days starting from tomorrow.');
            return;
        }
    
        // Ensure all required fields are filled
        if (!startDate || !endDate || !reason) {
            toast.error('All fields are required.');
            return;
        }
    
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;
    
        if (!userId) {
            toast.error('No user ID found.');
            return;
        }
    
        // Create formData to send with the request
        const formData = new FormData();
        formData.append('dateDebut', startDate);
        formData.append('dateFin', endDate);
        formData.append('motif', reason);
        formData.append('etat', 'EN_ATTENTE');  // Default status
        formData.append('utilisateurId', userId);
    
        if (selectedFile) {
            formData.append('files', selectedFile);  // Add file if selected
        }
    
        try {
            // Check if in edit mode or adding a new leave request
            if (editMode && selectedEventId) {
                await editDemandeDeConge(selectedEventId, formData);
                toast.success('Leave request updated successfully.');
            } else {
                // Try to add new leave request
                await addDemandeDeConge(formData, userId);
                toast.success('Leave request added successfully.');
            }
    
            // Fetch updated leave requests and update the calendar
            const conges = await getAllConges();
            const formattedEvents = conges.map(conge => ({
                id: conge.id,
                title: conge.motif,
                start: conge.dateDebut,
                end: conge.dateFin,
                backgroundColor: getColorForStatus(conge.etat),
                borderColor: getColorForStatus(conge.etat),
            }));
    
            setEvents(formattedEvents); 
            setDialogOpen(false); 
    
        } catch (err) {
            console.error('Error in handleSubmit:', err.message);
    
            // Handle insufficient leave balance specifically
            if (err.message === 'Insufficient leave balance') {
                toast.error('You do not have enough leave balance.');
            } else {
                // General error handling
                toast.error('Failed to add or edit leave request. Please try again later.');
            }
        }
    };

    const handleDelete = async () => {
        if (!selectedEventId) {
            toast.error('No event selected for deletion.');
            return;
        }

        try {
            await deleteDemandeDeCongeById(selectedEventId);
            const conges = await getAllConges();
            const formattedEvents = conges.map(conge => ({
                id: conge.id,
                title: conge.motif,
                start: conge.dateDebut,
                end: conge.dateFin,
                backgroundColor: getColorForStatus(conge.etat),
                borderColor: getColorForStatus(conge.etat),
            }));
            setEvents(formattedEvents);
            setDialogOpen(false);
            toast.success('Leave request deleted successfully.');
        } catch (err) {
            toast.error('Failed to delete leave request. Please try again later.');
        }
    };

    return (
        <div>
            <ToastContainer />
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,listYear'
                }}
                views={{
                    listYear: { buttonText: 'Agenda' }
                }}
                events={events}
                selectable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
            />
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: 'fixed',
                    width: '60px',
                    height: '60px',
                    bottom: '60px',
                    right: '70px',
                    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.4)',
                    zIndex: 1000,
                    '&:hover': {
                        transform: 'scale(1.1)',
                    },
                }}
                onClick={handleFabClick}
            >
                <PlusOutlined style={{ fontSize: '1.6rem', color: '#fff' }} />
            </Fab>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogContent>
                    <Typography variant="h6" marginTop={3}>{editMode ? 'Edit Leave Request' : 'Add Leave Request'}</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Motif"
                            fullWidth
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            margin="normal"
                            marginTop="3"
                            multiline
                            rows={4} // Sets the number of rows in the textarea
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            type="date"
                            label="Start Date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            margin="normal"
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            type="date"
                            label="End Date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            margin="normal"
                            sx={{ marginBottom: 2 }}
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' , marginTop:'5px'}}
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="outlined"
                            color="info"
                            startIcon={<UploadOutlined />}
                            onClick={handleButtonClick}
                            sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 2 , marginTop:3}}
                        >
                            {selectedFile ? selectedFile.name : 'Upload File'}
                        </Button>
                        <DialogActions>
                            <Button onClick={() => setDialogOpen(false)} 
                                color="error"
                                endIcon={<CloseOutlined />}
>
                                Cancel
                            </Button>
                            <Button type="submit" color="primary" variant='outlined'  startIcon={<PlusCircleOutlined />}>
                                {editMode ? 'Update' : 'Add'}
                            </Button>
                            {editMode && (
                                <Button onClick={handleDelete} color="secondary">
                                    Delete
                                </Button>
                            )}
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CalendarView;
