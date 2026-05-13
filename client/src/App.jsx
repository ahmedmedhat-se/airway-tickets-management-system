import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import HomePage      from './pages/HomePage';
import FlightsPage   from './pages/FlightsPage';
import MyTripsPage   from './pages/MyTripsPage';
import AdminPage     from './pages/AdminPage';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';

function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Full-screen auth pages */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Shared layout with navbar */}
          <Route element={<RootLayout />}>
            <Route index          element={<HomePage />} />
            <Route path="flights" element={<FlightsPage />} />

            <Route path="my-trips" element={
              <ProtectedRoute><MyTripsPage /></ProtectedRoute>
            } />

            <Route path="admin" element={
              <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
