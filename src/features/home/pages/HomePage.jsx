import { Container, Stack, Typography, Box } from '@mui/material';
import { FeatureCard } from '../components/FeatureCard';
import { featuresData } from '../data/features';

export const HomePage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              color: '#000',
            }}
          >
            Learn Chinese Numbers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
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
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};
