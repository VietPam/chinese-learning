import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { MainLayout } from './components/Layout/MainLayout';
import { chineseDigitsRoutes } from './features/chineseDigits';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            {chineseDigitsRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            <Route path="/" element={<Navigate to="/chinese-digits" />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
