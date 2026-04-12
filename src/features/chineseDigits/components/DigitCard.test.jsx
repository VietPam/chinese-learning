import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import chineseDigitsReducer from '../store/chineseDigitsSlice';
import uiReducer from '../../../store/uiSlice';
import progressReducer from '../../../store/progressSlice';
import { DigitCard } from './DigitCard';

const theme = createTheme();

const createTestStore = () => {
  return configureStore({
    reducer: {
      chineseDigits: chineseDigitsReducer,
      ui: uiReducer,
      progress: progressReducer,
    },
  });
};

const renderWithProviders = (component) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </Provider>
  );
};

describe('DigitCard', () => {
  it('should render digit card with Vietnamese meaning', () => {
    renderWithProviders(
      <DigitCard
        digit={1}
        chineseChar="一"
        pinyin="yī"
        vietnamese="một"
      />
    );

    expect(screen.getByText('一')).toBeInTheDocument();
    expect(screen.getByText('yī')).toBeInTheDocument();
    expect(screen.getByText('một')).toBeInTheDocument();
  });

  it('should render all digits with Vietnamese meanings', () => {
    const digits = [
      { digit: 0, chineseChar: '零', pinyin: 'líng', vietnamese: 'không' },
      { digit: 5, chineseChar: '五', pinyin: 'wǔ', vietnamese: 'năm' },
      { digit: 10, chineseChar: '十', pinyin: 'shí', vietnamese: 'mười' },
    ];

    digits.forEach(({ digit, chineseChar, pinyin, vietnamese }) => {
      const { unmount } = renderWithProviders(
        <DigitCard
          digit={digit}
          chineseChar={chineseChar}
          pinyin={pinyin}
          vietnamese={vietnamese}
        />
      );

      expect(screen.getByText(chineseChar)).toBeInTheDocument();
      expect(screen.getByText(pinyin)).toBeInTheDocument();
      expect(screen.getByText(vietnamese)).toBeInTheDocument();

      unmount();
    });
  });
});