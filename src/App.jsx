import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { MainLayout } from './components/Layout/MainLayout';
import { homeRoutes } from './features/home';
import { chineseDigitsRoutes } from './features/chineseDigits';
import { quizRoutes } from './features/quiz';
import { settingsRoutes } from './features/settings';
import './index.css';

function App() {
  // Combine all routes
  const allRoutes = [...homeRoutes, ...chineseDigitsRoutes, ...quizRoutes, ...settingsRoutes];

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            {allRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
