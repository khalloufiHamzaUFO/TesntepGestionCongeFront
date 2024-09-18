import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NavGroup from './NavGroup';
import menuItems from 'menu-items';

const Navigation = ({ userRole }) => {
    if (!menuItems || !menuItems.items) {
        return (
            <Typography variant="h6" color="error" align="center">
                No menu items found
            </Typography>
        );
    }

    const navGroups = menuItems.items.map((item) => (
        item.type === 'group' ? <NavGroup key={item.id} item={item} userRole={userRole} /> : null
    ));

    return <Box>{navGroups}</Box>;
};

export default Navigation;
