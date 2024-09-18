import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import { CommentOutlined, LockOutlined, QuestionCircleOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function SettingTab() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate(); // Use the hook to get the navigate function

    const handleListItemClick = (event, index, path) => {
        setSelectedIndex(index);
        if (path) {
            navigate(path); // Navigate to the specified path
        }
    };

    return (
        <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
            <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
                <ListItemIcon>
                    <QuestionCircleOutlined />
                </ListItemIcon>
                <ListItemText primary="Support" />
            </ListItemButton>
            <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, '/account-settings')}>
                <ListItemIcon>
                    <UserOutlined />
                </ListItemIcon>
                <ListItemText primary="Account Settings" />
            </ListItemButton>
            <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2, '/updatepassword')}>
                <ListItemIcon>
                    <LockOutlined />
                </ListItemIcon>
                <ListItemText primary="Change your password" />
            </ListItemButton>
            <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
                <ListItemIcon>
                    <CommentOutlined />
                </ListItemIcon>
                <ListItemText primary="Feedback" />
            </ListItemButton>
            <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4)}>
                <ListItemIcon>
                    <UnorderedListOutlined />
                </ListItemIcon>
                <ListItemText primary="History" />
            </ListItemButton>
        </List>
    );
}
