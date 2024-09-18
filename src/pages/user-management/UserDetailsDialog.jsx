import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { formatDistanceToNow } from 'date-fns';

const UserDetailsDialog = ({ open, onClose, user }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>User Details</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {user ? (
                        <>
                            <strong>Name:</strong> {user.prenom} {user.nom}<br />
                            <strong>CIN:</strong> {user.cin}<br />
                            <strong>Role:</strong> {user.role}<br />
                            <strong>Status:</strong> {user.enabled ? 'Active' : 'Inactive'}<br />
                            <strong>Last Login:</strong> {formatDistanceToNow(new Date(user.lastLogin[0], user.lastLogin[1] - 1, user.lastLogin[2]), { addSuffix: true })}
                        </>
                    ) : (
                        'No user data available'
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

UserDetailsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object,
};

export default UserDetailsDialog;
