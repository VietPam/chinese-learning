import { Card, CardContent, Typography, Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const FeatureCard = ({ id, title, description, path, icon, color, borderColor, stats }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      onClick={() => navigate(path)}
      sx={{
        cursor: 'pointer',
        mb: 3,
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: isDark ? theme.palette.background.paper : color,
        border: `2px solid ${isDark ? theme.palette.divider : borderColor}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-12px)',
          boxShadow: isDark
            ? '0 16px 32px rgba(255, 255, 255, 0.1)'
            : `0 16px 32px ${borderColor}40`,
        },
      }}
    >
      <CardContent
        sx={{
          width: '100%',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          flex: 1,
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            fontSize: 56,
            mb: 2,
            lineHeight: 1,
          }}
        >
          {icon}
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            color: isDark ? 'text.primary' : '#000',
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: isDark ? 'text.secondary' : '#555',
            mb: 2,
            flex: 1,
          }}
        >
          {description}
        </Typography>

        {/* Stats */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            fontSize: '0.85rem',
            color: isDark ? 'text.secondary' : borderColor,
            fontWeight: 500,
          }}
        >
          📊 {stats}
        </Box>

        {/* Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: borderColor,
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            mt: 'auto',
            '&:hover': {
              backgroundColor: borderColor,
              opacity: 0.9,
            },
            endIcon: <ArrowForwardIcon />,
          }}
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
};
