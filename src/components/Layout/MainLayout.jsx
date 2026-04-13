import { useState } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { NavigationDrawer } from './NavigationDrawer';

export const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
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

      <NavigationDrawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
      />

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
