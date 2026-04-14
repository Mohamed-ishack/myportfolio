// src/admin/AdminLayout.jsx
import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="admin-container">
      {/* Sidebar Backdrop for Mobile */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="admin-logo" style={{ marginBottom: 0 }}>Admin Panel</h2>
          <button className="menu-toggle-btn" style={{ display: 'none' }} onClick={toggleSidebar}>
            {/* This button is only shown via CSS media queries if needed, but we used the header one mostly */}
            <FaTimes />
          </button>
        </div>

        <nav className="admin-nav">
          {[
            { to: '/admin/hero',     label: 'Hero'     },
            { to: '/admin/about',    label: 'About'    },
            { to: '/admin/skills',   label: 'Skills'   },
            { to: '/admin/projects', label: 'Projects' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="admin-nav-link"
              onClick={closeSidebar}
              style={({ isActive }) => ({
                background: isActive ? '#667eea' : 'transparent',
                color:      isActive ? 'white'   : '#ccc',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* Mobile Header (Sticky) */}
        <header className="admin-mobile-header">
          <button className="menu-toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <span style={{ fontWeight: 'bold' }}>Admin Panel</span>
          <div style={{ width: '24px' }}></div> {/* Spacer for symmetry */}
        </header>

        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;