import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './contexts/AuthProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes';
import 'react-toastify/dist/ReactToastify.css';
import './style/main.scss';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop={false}
          />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
