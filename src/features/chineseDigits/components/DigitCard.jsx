import { Card, CardContent, Typography, Box, IconButton, CircularProgress, useTheme } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAudio } from '../hooks/useAudio';
import { useFavorites } from '../hooks/useFavorites';

export const DigitCard = ({ digit, chineseChar, pinyin, vietnamese }) => {
  const theme = useTheme();
  const { play, isPlaying, isSupported } = useAudio();
  const { isFavorited, toggleFav } = useFavorites();

  const isFavored = isFavorited(digit);

  return (
    <Card
      sx={{
        elevation: 3,
        minHeight: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        transition: 'all 0.3s ease',
        px: 3,
        '&:hover': {
          elevation: 6,
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Favorite button (left) */}
      <IconButton
        onClick={() => toggleFav(digit)}
        sx={{
          color: isFavored ? 'error.main' : 'action.disabled',
          padding: '8px',
          '&:hover': {
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
          },
        }}
        title={isFavored ? 'Bỏ yêu thích' : 'Yêu thích'}
      >
        {isFavored ? (
          <FavoriteIcon sx={{ fontSize: 24 }} />
        ) : (
          <FavoriteBorderIcon sx={{ fontSize: 24 }} />
        )}
      </IconButton>

      {/* Center content */}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          p: 0,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: 48,
            fontWeight: 'bold',
            color: theme.palette.text.primary,
          }}
        >
          {chineseChar}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: 18,
            color: theme.palette.text.secondary,
            mt: 1,
          }}
        >
          {pinyin}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: 14,
            color: theme.palette.text.secondary,
            mt: 0.5,
            fontStyle: 'italic',
          }}
        >
          {vietnamese}
        </Typography>
      </CardContent>

      {/* Audio button (right) */}
      {isSupported && (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            onClick={() => play(chineseChar, 'zh-CN')}
            disabled={isPlaying}
            sx={{
              color: isPlaying ? 'primary.main' : 'primary.main',
              padding: '8px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
              },
              '&:disabled': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
            title={isPlaying ? 'Đang phát âm...' : 'Phát âm'}
          >
            <VolumeUpIcon sx={{ fontSize: 24 }} />
          </IconButton>
          {isPlaying && (
            <CircularProgress
              size={40}
              sx={{
                position: 'absolute',
                color: 'primary.main',
              }}
            />
          )}
        </Box>
      )}
    </Card>
  );
};
