import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { List, Typography, Box } from '@mui/material';
import NavItem from './NavItem';

export default function NavGroup({ item }) {
    const navItems = item.children?.map((menuItem) => {
        switch (menuItem.type) {
            case 'collapse':
                return (
                    <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
                        collapse - only available in paid version
                    </Typography>
                );
            case 'item':
                return <NavItem key={menuItem.id} item={menuItem} level={1} />;
            default:
                return (
                    <Typography key={menuItem.id} variant="h6" color="error" align="center">
                        Fix - Group Collapse or Items
                    </Typography>
                );
        }
    });

    return (
        <List
            subheader={
                item.title ? (
                    <Box sx={{ pl: 3, mb: 1.5 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            {item.title}
                        </Typography>
                    </Box>
                ) : null
            }
            sx={{ mb: 1.5, py: 0, zIndex: 0 }}
        >
            {navItems}
        </List>
    );
}

NavGroup.propTypes = { item: PropTypes.object };
