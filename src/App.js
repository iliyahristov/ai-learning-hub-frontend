import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './redux/store';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import MaterialView from './pages/MaterialView';
import GenerateMaterial from './pages/GenerateMaterial';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import Quiz from './pages/Quiz';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <BrowserRouter>
              <div className="app">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } />
                    <Route path="/courses" element={
                      <PrivateRoute>
                        <Courses />
                      </PrivateRoute>
                    } />
                    <Route path="/courses/:id" element={
                      <PrivateRoute>
                        <CourseDetails />
                      </PrivateRoute>
                    } />
                    <Route path="/materials/:id" element={
                      <PrivateRoute>
                        <MaterialView />
                      </PrivateRoute>
                    } />
                    <Route path="/generate" element={
                      <PrivateRoute>
                        <GenerateMaterial />
                      </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } />
                    <Route path="/progress" element={
                      <PrivateRoute>
                        <Progress />
                      </PrivateRoute>
                    } />
                    <Route path="/quiz/:quizId" element={
                      <PrivateRoute>
                        <Quiz />
                      </PrivateRoute>
                    } />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </AuthProvider>
          <ToastContainer position="bottom-right" />
        </ThemeProvider>
      </Provider>
  );
}

export default App;