import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode, setDarkMode } from '../store/uiSlice';

export const useDarkMode = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);

  const toggle = () => {
    dispatch(toggleDarkMode());
  };

  const setMode = (mode) => {
    dispatch(setDarkMode(mode));
  };

  return {
    darkMode,
    toggle,
    setMode,
  };
};
