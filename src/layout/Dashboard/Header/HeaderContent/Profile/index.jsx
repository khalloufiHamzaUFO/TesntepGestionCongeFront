import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';

// Import the fetchUser service
import userService from '../../../../../service/userService';
import authService from '../../../../../service/authService' // Update the path to your authService

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
            {value === index && children}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`
    };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
    const theme = useTheme();

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const [value, setValue] = useState(0);
    const [userData, setUserData] = useState({ name: 'John Doe', role: 'UI/UX Designer' });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Fetch user data when the component mounts
    useEffect(() => {
        const getUserData = async () => {
            try {
                const user = await userService.fetchUser();
                setUserData({ name: user.nom+" "+user.prenom || 'John Doe', role: user.role || 'UI/UX Designer' });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUserData();
    }, []);

    const iconBackColorOpen = 'grey.100';

    const handleLogout = () => {
        authService.logout(); // Call the logout function from authService
    };
    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <ButtonBase
                sx={{
                    p: 0.25,
                    bgcolor: open ? iconBackColorOpen : 'transparent',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'secondary.lighter' },
                    '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 }
                }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 0.5 }}>
                    <Avatar alt="profile user" src={avatar1} size="sm" />
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        {userData.name}
                    </Typography>
                </Stack>
            </ButtonBase>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
                        <Paper sx={{ boxShadow: theme.customShadows.z1, width: 290, minWidth: 240, maxWidth: { xs: 250, md: 290 } }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard elevation={0} border={false} content={false}>
                                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                                        <Grid container justifyContent="space-between" alignItems="center">
                                            <Grid item>
                                                <Stack direction="row" spacing={1.25} alignItems="center">
                                                    <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} />
                                                    <Stack>
                                                        <Typography variant="h6">{userData.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {userData.role}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                            <Grid item>
                                                <Tooltip title="Logout">
                                                    <IconButton size="large" sx={{ color: 'text.primary' }}  onClick={handleLogout}>
                                                        <LogoutOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </CardContent>

                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                                            <Tab
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    textTransform: 'capitalize'
                                                }}
                                                icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                                                label="Profile"
                                                {...a11yProps(0)}
                                            />
                                            <Tab
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    textTransform: 'capitalize'
                                                }}
                                                icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                                                label="Setting"
                                                {...a11yProps(1)}
                                            />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={value} index={0} dir={theme.direction}>
                                        <ProfileTab />
                                    </TabPanel>
                                    <TabPanel value={value} index={1} dir={theme.direction}>
                                        <SettingTab />
                                    </TabPanel>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
}

TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.number, index: PropTypes.number, other: PropTypes.any };
