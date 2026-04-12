import { Container, Typography, Box, Stack, FormControlLabel, Switch, useTheme } from '@mui/material';
import { useDarkMode } from '../../../hooks/useDarkMode';

export const SettingsPage = () => {
  const { darkMode, toggle } = useDarkMode();
  const theme = useTheme();

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="sm">
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Settings
        </Typography>

        <Stack spacing={2}>
          {/* Dark Mode */}
          <Box
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.3s ease',
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={toggle}
                />
              }
              label="Dark Mode"
            />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Toggle between light and dark mode (auto-saved)
            </Typography>
          </Box>

          {/* Language */}
          <Box
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.3s ease',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
              Language
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              (Coming soon)
            </Typography>
          </Box>

          {/* About */}
          <Box
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.3s ease',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
              About
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Learn Chinese Numbers v1.0
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
