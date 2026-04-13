import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const ActionButton = ({
  children,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      sx={{
        backgroundColor: variant === 'contained' ? theme.palette.primary.main : 'transparent',
        color: variant === 'contained' ? theme.palette.common.white : theme.palette.primary.main,
        border: variant === 'outlined' ? `1px solid ${theme.palette.primary.main}` : 'none',
        '&:hover': {
          backgroundColor: variant === 'contained'
            ? theme.palette.primary.dark
            : theme.palette.primary.light + '20',
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};