// src/admin/AdminApp.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin    from './AdminLogin';
import AdminLayout   from './AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminHero     from './pages/AdminHero';
import AdminAbout    from './pages/AdminAbout';
import AdminSkills   from './pages/AdminSkills';
import AdminProjects from './pages/AdminProjects';

const AdminApp = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="hero" replace />} />
        <Route path="hero"     element={<AdminHero />} />
        <Route path="about"    element={<AdminAbout />} />
        <Route path="skills"   element={<AdminSkills />} />
        <Route path="projects" element={<AdminProjects />} />
      </Route>
    </Routes>
  );
};

export default AdminApp;