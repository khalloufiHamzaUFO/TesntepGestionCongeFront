import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// material-ui
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
// project import
import Dot from 'components/@extended/Dot';
import { formatDistanceToNow } from 'date-fns';
import userService from "../../service/userService";
import { useNavigate } from 'react-router-dom';

import defaultAvatar from '../../assets/images/users/avatar-1.png';

const headCells = [
    { id: 'name', align: 'left', disablePadding: false, label: 'Name' }, // Merged Name column
    { id: 'cin', align: 'left', disablePadding: false, label: 'CIN' },
    { id: 'role', align: 'left', disablePadding: false, label: 'Role' },
    { id: 'lastLogin', align: 'right', disablePadding: false, label: 'Last Login' },
    { id: 'enabled', align: 'center', disablePadding: false, label: 'Status' },
    { id: 'actions', align: 'center', disablePadding: false, label: 'Actions' },
];

// ==============================|| USER TABLE - HEADER ||============================== //

function UserTableHead({ order, orderBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// ==============================|| ORDER STATUS (ENABLED) ||============================== //

function UserStatus({ status }) {
    const color = status ? 'success' : 'error';
    const title = status ? 'Active' : 'Inactive';

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
}

// ==============================|| USER TABLE ||============================== //
export default function UserTable() {
    const [users, setUsers] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false); // State to control the dialog
    const order = 'asc';
    const orderBy = 'name'; // Update to sort by the merged Name column
    const navigate = useNavigate();

    useEffect(() => {
        userService.findUsers().then(setUsers);
    }, []);

    const handleMenuClick = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleToggleStatus = async () => {
        if (selectedUser) {
            await userService.toggleUserStatus(selectedUser.email);
            const updatedUsers = users.map((user) =>
                user.email === selectedUser.email ? { ...user, enabled: !user.enabled } : user
            );
            setUsers(updatedUsers);
            handleMenuClose();
        }
    };

    const handleNameClick = async (user) => {
        try {
            // Fetch user details asynchronously
            const userDetails = await userService.fetchUserByEmail(user.email);

            // Log the name, ID, and CIN
            console.log(`Name: ${userDetails.prenom} ${userDetails.nom}, ID: ${userDetails.id}, CIN: ${userDetails.cin}`);

            navigate(`/user-history/${userDetails.id}`); // Navigate to the user history page
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleViewDetails = async () => {
        if (selectedUser) {
            try {
                const userDetails = await userService.fetchUserByEmail(selectedUser.email);
                setSelectedUser(userDetails);
                setDialogOpen(true); // Open the dialog only after setting the user details
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        }
        handleMenuClose();
    };

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table aria-labelledby="tableTitle">
                    <UserTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {users.map((user, index) => {
                            let lastLoginFormatted = 'Never logged in';

                            // Check if lastLogin is present and is a valid array
                            if (user.lastLogin && Array.isArray(user.lastLogin)) {
                                console.log('Last login for user:', user.email, user.lastLogin); // Log the lastLogin value

                                if (user.lastLogin.length >= 6) {
                                    const [year, month, day, hour, minute, second] = user.lastLogin;

                                    // Check if values are numbers
                                    if (
                                        !isNaN(year) && !isNaN(month) && !isNaN(day) &&
                                        !isNaN(hour) && !isNaN(minute) && !isNaN(second)
                                    ) {
                                        const lastLoginDate = new Date(year, month - 1, day, hour, minute, second);

                                        // Check if the constructed Date is valid
                                        if (!isNaN(lastLoginDate.getTime())) {
                                            lastLoginFormatted = formatDistanceToNow(lastLoginDate, { addSuffix: true });
                                        } else {
                                            console.warn(`Invalid date created for user: ${user.email}`);
                                        }
                                    }
                                }
                            }

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    tabIndex={-1}
                                    key={`${user.cin}-${index}`} // Ensure unique keys
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{ color: 'dodgerblue', cursor: 'pointer' }}
                                        onClick={() => handleNameClick(user)} // Pass the entire user object
                                    >
                                        {`${user.prenom || 'N/A'} ${user.nom || 'N/A'}`} {/* Merged Name */}
                                    </TableCell>
                                    <TableCell>{user.cin || 'N/A'}</TableCell>
                                    <TableCell>{user.role || 'N/A'}</TableCell>
                                    <TableCell align="right">{lastLoginFormatted}</TableCell>
                                    <TableCell align="center">
                                        <UserStatus status={user.enabled} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={(event) => handleMenuClick(event, user)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={handleViewDetails}>Details</MenuItem>
                                            <MenuItem onClick={handleToggleStatus}>
                                                {selectedUser && selectedUser.enabled ? "Disable" : "Enable"}
                                            </MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for user details */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>User Details</DialogTitle>
                <DialogContent>
                    <Card>
                        <CardHeader
                            avatar={
                                <Avatar
                                    alt={selectedUser?.prenom || 'User'}
                                    src={defaultAvatar} // Use default avatar for now
                                    sx={{ width: 56, height: 56 }}
                                />
                            }
                            title={`${selectedUser?.prenom || 'N/A'} ${selectedUser?.nom || 'N/A'}`}
                            subheader={selectedUser?.email || 'N/A'}
                        />
                        <CardContent>
                            <Typography variant="body1">
                                <strong>CIN:</strong> {selectedUser?.cin || 'N/A'}<br />
                                <strong>Role:</strong> {selectedUser?.role || 'N/A'}<br />
                                <strong>Status:</strong> {selectedUser?.enabled ? 'Active' : 'Inactive'}<br />
                                <strong>Date of Birth:</strong> {selectedUser?.dateDeNaissance ? new Date(selectedUser.dateDeNaissance).toLocaleDateString() : 'N/A'}<br />
                                <strong>Member since:</strong> {new Date(selectedUser?.createdAt).toLocaleDateString()}<br /> {/* Show only the date */}
                                <strong>Last update:</strong> {new Date(selectedUser?.updatedAt).toLocaleDateString()}<br /> {/* Show only the date */}
                            </Typography>

                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}