import { Box, Chip } from '@mui/material';

export const StatsChips = ({ stats, variant = 'outlined', size = 'small' }) => {
  return (
    <Box sx={{
      display: 'flex',
      gap: 1,
      flexWrap: 'wrap',
      justifyContent: { xs: 'center', sm: 'flex-end' }
    }}>
      {stats.map((stat, index) => (
        <Chip
          key={index}
          label={`${stat.icon} ${stat.value}`}
          color={stat.color}
          variant={variant}
          size={size}
          sx={{
            fontWeight: 'bold',
            minWidth: { xs: 60, sm: 'auto' },
            justifyContent: 'center'
          }}
        />
      ))}
    </Box>
  );
};