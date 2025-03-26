import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { text: 'Messages', icon: <MailIcon />, path: '/messages' },
  { text: 'Bookmarks', icon: <BookmarkIcon />, path: '/bookmarks' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  { text: 'More', icon: <MoreHorizIcon />, path: '/more' },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              py: 1.5,
              fontSize: '1rem',
            }}
            onClick={() => handleNavigation('/compose/tweet')}
          >
            Tweet
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 