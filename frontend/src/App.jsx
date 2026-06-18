import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Landing from './pages/Landing.jsx';
import MemberDashboard from './pages/MemberDashboard.jsx';
import StaffDashboard from './pages/StaffDashboard.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-[#e8ff00] font-['Bebas_Neue'] text-3xl tracking-widest animate-pulse">
          ASCEND
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'staff' ? '/staff' : '/dashboard'} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-[#e8ff00] font-['Bebas_Neue'] text-3xl tracking-widest animate-pulse">
          ASCEND
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          token && user
            ? <Navigate to={user.role === 'staff' ? '/staff' : '/dashboard'} replace />
            : <Login />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="member">
            <MemberDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute requiredRole="staff">
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
