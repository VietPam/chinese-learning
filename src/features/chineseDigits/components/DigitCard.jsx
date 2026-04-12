import { Card, CardContent, Typography, Box } from '@mui/material';

export const DigitCard = ({ chineseChar, pinyin }) => {
  return (
    <Card
      sx={{
        elevation: 3,
        minHeight: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 6,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          p: 3,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: 48,
            fontWeight: 'bold',
            mb: 1,
            color: '#000',
          }}
        >
          {chineseChar}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: 18,
            color: '#000',
          }}
        >
          {pinyin}
        </Typography>
      </CardContent>
    </Card>
  );
};
