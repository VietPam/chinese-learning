import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFavorites } from '../store/chineseDigitsSlice';
import { storageService } from '../../../services/storageService';

export const useLocalStorageFavorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.chineseDigits.favorites);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = storageService.getFavorites();
    if (savedFavorites && savedFavorites.length > 0) {
      dispatch(setFavorites(savedFavorites));
    }
  }, [dispatch]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    storageService.setFavorites(favorites);
  }, [favorites]);

  return favorites;
};
