import { LinearProgress, useTheme } from '@mui/material';

export const ProgressBar = ({ value, height = 8, showValue = false, ...props }) => {
  const theme = useTheme();

  return (
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height,
        borderRadius: 4,
        backgroundColor: theme.palette.grey[300],
        '& .MuiLinearProgress-bar': {
          borderRadius: 4,
          backgroundColor: theme.palette.primary.main,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
};