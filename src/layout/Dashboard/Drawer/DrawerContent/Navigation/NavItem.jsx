import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// Utility function to get user role
const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.role : 'GUEST';
};

export default function NavItem({ item, level }) {
    const theme = useTheme();
    const userRole = getUserRole(); // Get the current user role

    const { pathname } = useLocation();
    const isSelected = !!matchPath({ path: item.url, end: false }, pathname);

    // Check if user has the required role to access the menu item
    const hasAccess = !item.roles || item.roles.length === 0 || item.roles.includes(userRole);

    // Only render if the user has access
    if (!hasAccess) return null;

    return (
        <ListItemButton selected={isSelected} component={Link} to={item.url}>
            {item.icon && (
                <ListItemIcon>
                    <item.icon style={{ color: isSelected ? theme.palette.primary.main : 'inherit' }} />
                </ListItemIcon>
            )}
            <ListItemText
                primary={
                    <Typography variant="h6" color={isSelected ? 'primary.main' : 'text.primary'}>
                        {item.title}
                    </Typography>
                }
            />
        </ListItemButton>
    );
}

NavItem.propTypes = {
    item: PropTypes.shape({
        url: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        icon: PropTypes.elementType,
        roles: PropTypes.arrayOf(PropTypes.string)
    }),
    level: PropTypes.number
};
