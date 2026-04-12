import { Container, Typography, Box, Stack, FormControlLabel, Switch } from '@mui/material';
import { useState } from 'react';

export const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

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
              border: '1px solid #ddd',
              borderRadius: 2,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              }
              label="Dark Mode"
            />
            <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
              (Feature coming soon)
            </Typography>
          </Box>

          {/* Language */}
          <Box
            sx={{
              p: 2,
              border: '1px solid #ddd',
              borderRadius: 2,
            }}
          >
            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
              Language
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              (Coming soon)
            </Typography>
          </Box>

          {/* About */}
          <Box
            sx={{
              p: 2,
              border: '1px solid #ddd',
              borderRadius: 2,
            }}
          >
            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
              About
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Learn Chinese Numbers v1.0
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
