import { useState } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton, useMediaQuery, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import SettingsIcon from '@mui/icons-material/Settings';
import FlashCardIcon from '@mui/icons-material/Style';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const menuItems = [
  { label: 'Home', path: '/', icon: HomeIcon },
  { label: 'Learning', path: '/chinese-digits', icon: SchoolIcon },
  { label: 'Flash Cards', path: '/flashcards', icon: FlashCardIcon },
  { label: 'Quiz', path: '/chinese-digits-quiz', icon: QuizIcon },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
];

export const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Learn Chinese Numbers
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
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
              const IconComponent = item.icon;
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
                  <IconComponent
                    sx={{
                      mr: 2,
                      color: isActive ? theme.palette.primary.main : 'inherit',
                    }}
                  />
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

      <Box
        component="main"
        sx={{
          flex: 1,
          py: 4,
          width: '100%',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          width: '100%',
          backgroundColor: theme.palette.mode === 'dark' ? '#262626' : theme.palette.grey[100],
          textAlign: 'center',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          © 2026 Learn Chinese. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};
