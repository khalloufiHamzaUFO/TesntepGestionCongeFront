import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { getAllNotif,getNotificationByUserId } from '../../../../service/notificationService';
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

function formatElapsedTime(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length < 6) {
    return 'Invalid date';
  }

  // Extract year, month, day, hour, minute, second from the array
  const [year, month, day, hour, minute, second] = dateArray;

  // Create a Date object using the extracted parts. Note that JavaScript months are 0-indexed (January is 0), so we subtract 1 from the month.
  const notificationDate = new Date(year, month - 1, day, hour, minute, second);

  if (isNaN(notificationDate.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diff = now - notificationDate;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return seconds < 10 ? "Just now" : `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}



export default function Notification() {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem('user')); // Get the user from local storage
  const userRole = storedUser?.role;
  const userId = storedUser?.id;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let notifs;
        if (userRole === 'RESPONSABLE') {
          notifs = await getAllNotif();
        } else {
          notifs = await getNotificationByUserId(userId);
        }
        setNotifications(notifs);
        setUnreadCount(notifs.length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, [userRole, userId]);

  const handleMarkAllAsRead = () => {
    setUnreadCount(0);
  };

  const handleViewAll = () => {
    setShowAll(true);
  };

  const handleViewLess = () => {
    setShowAll(false);
  };

  const iconBackColorOpen = 'grey.100';

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  return (
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
            color="secondary"
            variant="light"
            sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : 'transparent' }}
            aria-label="open notifications"
            ref={anchorRef}
            aria-controls={open ? 'profile-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
        >
          <Badge badgeContent={unreadCount} color="primary">
            <BellOutlined />
          </Badge>
        </IconButton>
        <Popper
            placement={matchesXs ? 'bottom' : 'bottom-end'}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
        >
          {({ TransitionProps }) => (
              <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                <Paper sx={{ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } }}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MainCard
                        title="Notifications"
                        elevation={0}
                        border={false}
                        content={false}
                        secondary={
                          <>
                            {unreadCount > 0 && (
                                <Tooltip title="Mark all as read">
                                  <IconButton color="success" size="small" onClick={handleMarkAllAsRead}>
                                    <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                                  </IconButton>
                                </Tooltip>
                            )}
                          </>
                        }
                    >
                      <List
                          component="nav"
                          sx={{
                            p: 0,
                            maxHeight: '400px',
                            overflowY: 'auto',
                            '& .MuiListItemButton-root': {
                              py: 0.5,
                              '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                              '& .MuiAvatar-root': avatarSX,
                              '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                            }
                          }}
                      >
                        {displayedNotifications.map((notif) => (
                            <ListItemButton key={notif.idNotif}>
                              <ListItemAvatar>
                                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                                  <MessageOutlined />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                  primary={<Typography variant="h6">{notif.titre}</Typography>}
                                  secondary={
                                    <>
                                      <Typography variant="body2">{notif.message}</Typography>
                                      <Typography variant="body2" color="textSecondary">
                                        {formatElapsedTime(notif.date)}
                                      </Typography>
                                    </>
                                  }
                              />
                              <ListItemSecondaryAction>
                                <Typography variant="caption" noWrap>
                                  {Array.isArray(notif.date) ? new Date(notif.date[0], notif.date[1] - 1, notif.date[2]).toLocaleDateString() : 'Invalid Date'}
                                </Typography>
                              </ListItemSecondaryAction>

                            </ListItemButton>
                        ))}
                      </List>
                      <Box sx={{ textAlign: 'center', mt: 1 }}>
                        {showAll ? (
                            <IconButton onClick={handleViewLess}>
                              <Typography variant="body2" color="primary">View Less</Typography>
                            </IconButton>
                        ) : (
                            <IconButton onClick={handleViewAll}>
                              <Typography variant="body2" color="primary">More</Typography>
                            </IconButton>
                        )}
                      </Box>
                    </MainCard>
                  </ClickAwayListener>
                </Paper>
              </Transitions>
          )}
        </Popper>
      </Box>
  );
}
