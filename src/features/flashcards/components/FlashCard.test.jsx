import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import chineseDigitsReducer from '../../chineseDigits/store/chineseDigitsSlice';
import uiReducer from '../../../store/uiSlice';
import progressReducer from '../../../store/progressSlice';
import flashcardsReducer from '../store/flashcardsSlice';
import { FlashCard } from './FlashCard';

const theme = createTheme();

const createTestStore = () => {
  return configureStore({
    reducer: {
      chineseDigits: chineseDigitsReducer,
      ui: uiReducer,
      progress: progressReducer,
      flashcards: flashcardsReducer,
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

describe('FlashCard', () => {
  it('should render front content initially', () => {
    renderWithProviders(
      <FlashCard
        frontContent="一"
        backContent={{ chinese: "一", pinyin: "yī", vietnamese: "một" }}
      />
    );

    expect(screen.getByText('一')).toBeInTheDocument();
    expect(screen.queryByText('yī')).not.toBeInTheDocument();
    expect(screen.queryByText('một')).not.toBeInTheDocument();
  });

  it('should show back content when flipped', () => {
    renderWithProviders(
      <FlashCard
        frontContent="一"
        backContent={{ chinese: "一", pinyin: "yī", vietnamese: "một" }}
      />
    );

    const card = screen.getByText('一');
    fireEvent.click(card);

    expect(screen.getByText('yī')).toBeInTheDocument();
    expect(screen.getByText('một')).toBeInTheDocument();
  });

  it('should call onCorrect when correct button is clicked', () => {
    const mockOnCorrect = vi.fn();
    const mockOnNext = vi.fn();

    renderWithProviders(
      <FlashCard
        frontContent="一"
        backContent={{ chinese: "一", pinyin: "yī", vietnamese: "một" }}
        onCorrect={mockOnCorrect}
        onNext={mockOnNext}
      />
    );

    // Flip the card first
    const card = screen.getByText('一');
    fireEvent.click(card);

    // Click the correct button
    const correctButton = screen.getByRole('button', { hidden: true });
    fireEvent.click(correctButton);

    expect(mockOnCorrect).toHaveBeenCalled();
  });

  it('should call onIncorrect when incorrect button is clicked', () => {
    const mockOnIncorrect = vi.fn();
    const mockOnNext = vi.fn();

    renderWithProviders(
      <FlashCard
        frontContent="一"
        backContent={{ chinese: "一", pinyin: "yī", vietnamese: "một" }}
        onIncorrect={mockOnIncorrect}
        onNext={mockOnNext}
      />
    );

    // Flip the card first
    const card = screen.getByText('一');
    fireEvent.click(card);

    // Click the incorrect button
    const incorrectButton = screen.getByRole('button', { hidden: true });
    fireEvent.click(incorrectButton);

    expect(mockOnIncorrect).toHaveBeenCalled();
  });
});