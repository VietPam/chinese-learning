import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/chineseDigitsSlice';

export const useFavorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.chineseDigits.favorites);

  const toggleFav = (digit) => {
    dispatch(toggleFavorite(digit));
  };

  const isFavorited = (digit) => {
    return favorites.includes(digit);
  };

  return {
    favorites,
    toggleFav,
    isFavorited,
  };
};
