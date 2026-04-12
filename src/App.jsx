import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import store from './store/store';
import { MainLayout } from './components/Layout/MainLayout';
import { homeRoutes } from './features/home';
import { chineseDigitsRoutes } from './features/chineseDigits';
import { quizRoutes } from './features/quiz';
import { settingsRoutes } from './features/settings';
import { flashcardsRoutes } from './features/flashcards';
import { lightTheme, darkTheme } from './theme/theme';
import './index.css';

function AppContent() {
  // Combine all routes
  const allRoutes = [...homeRoutes, ...chineseDigitsRoutes, ...quizRoutes, ...settingsRoutes, ...flashcardsRoutes];
  const darkMode = useSelector((state) => state.ui.darkMode);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            {allRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
