import { Container, Stack, Typography, Box, useTheme } from '@mui/material';
import { FeatureCard } from '../components/FeatureCard';
import { featuresData } from '../data/features';

export const HomePage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 4,
        width: '100%',
        minHeight: '100%',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              color: theme.palette.text.primary,
            }}
          >
            Learn Chinese Numbers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: 16,
            }}
          >
            Hãy chọn một tính năng để bắt đầu
          </Typography>
        </Box>

        {/* Features */}
        <Stack spacing={0}>
          {featuresData.map((feature) => (
            <FeatureCard
              key={feature.id}
              id={feature.id}
              title={feature.title}
              description={feature.description}
              path={feature.path}
              icon={feature.icon}
              color={feature.color}
              borderColor={feature.borderColor}
              stats={feature.stats}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};
