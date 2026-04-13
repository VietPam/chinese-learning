import { Box, Drawer, List, ListItemButton, ListItemText, Typography, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const menuItems = [
  { label: 'Home', path: '/', iconName: 'Home' },
  { label: 'Learning', path: '/chinese-digits', iconName: 'School' },
  { label: 'Flash Cards', path: '/flashcards', iconName: 'Style' },
  { label: 'Quiz', path: '/chinese-digits-quiz', iconName: 'Quiz' },
  { label: 'Settings', path: '/settings', iconName: 'Settings' },
];

const iconMap = {
  Home: '🏠',
  School: '🎓',
  Style: '💳',
  Quiz: '📝',
  Settings: '⚙️',
};

export const NavigationDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleMenuItemClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          width: 280,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: theme.palette.background.paper,
        }}
        role="presentation"
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            🎓
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Learn Chinese
          </Typography>
          <Typography variant="caption">
            Numbers Edition
          </Typography>
        </Box>

        {/* Menu Items */}
        <List sx={{ flex: 1, pt: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                onClick={() => handleMenuItemClick(item.path)}
                sx={{
                  mx: 1,
                  mb: 1,
                  borderRadius: 1,
                  backgroundColor: isActive
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(144, 202, 249, 0.12)'
                      : 'rgba(25, 118, 210, 0.08)'
                    : 'transparent',
                  borderLeft: isActive ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                  pl: 2.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(144, 202, 249, 0.08)'
                        : 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                <Box sx={{ mr: 2, fontSize: 20 }}>
                  {iconMap[item.iconName]}
                </Box>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? theme.palette.primary.main : 'inherit',
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider />

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <Typography variant="caption" display="block">
            v1.0
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Swipe to close
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};