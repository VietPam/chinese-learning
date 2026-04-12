import { Container, Typography, Box, Stack, FormControlLabel, Switch, useTheme } from '@mui/material';
import { useDarkMode } from '../../../hooks/useDarkMode';

export const SettingsPage = () => {
  const { darkMode, toggle } = useDarkMode();
  const theme = useTheme();

  // Better background for dark mode - slightly lighter for contrast
  const boxBgColor = theme.palette.mode === 'dark' 
    ? '#262626'  // Lighter dark for better contrast
    : theme.palette.background.paper;

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="sm">
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            color: theme.palette.text.primary,
          }}
        >
          Settings
        </Typography>

        <Stack spacing={2}>
          {/* Dark Mode */}
          <Box
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: boxBgColor,
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
              sx={{
                color: theme.palette.text.primary,
                '& .MuiFormControlLabel-label': {
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                },
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary, 
                mt: 1 
              }}
            >
              Toggle between light and dark mode (auto-saved)
            </Typography>
          </Box>

          {/* Language */}
          <Box
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: boxBgColor,
              transition: 'all 0.3s ease',
            }}
          >
            <Typography 
              sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                color: theme.palette.text.primary,
              }}
            >
              Language
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary 
              }}
            >
              (Coming soon)
            </Typography>
          </Box>

          {/* About */}
          <Box
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: boxBgColor,
              transition: 'all 0.3s ease',
            }}
          >
            <Typography 
              sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                color: theme.palette.text.primary,
              }}
            >
              About
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary 
              }}
            >
              Learn Chinese Numbers v1.0
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
