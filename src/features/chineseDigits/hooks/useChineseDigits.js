import { useSelector } from 'react-redux';

export const useChineseDigits = () => {
  const digits = useSelector((state) => state.chineseDigits.digits);
  return digits;
};
