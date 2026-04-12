import { Box, Container, AppBar, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Learn Chinese Numbers
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2026 Learn Chinese. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};
