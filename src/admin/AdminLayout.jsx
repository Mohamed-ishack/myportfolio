// src/admin/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Admin Panel</h2>
        <nav style={styles.nav}>
          {[
            { to: '/admin/hero',     label: 'Hero'     },
            { to: '/admin/about',    label: 'About'    },
            { to: '/admin/skills',   label: 'Skills'   },
            { to: '/admin/projects', label: 'Projects' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...styles.navLink,
                background: isActive ? '#667eea' : 'transparent',
                color:      isActive ? 'white'   : '#ccc',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container:  { display:'flex', minHeight:'100vh' },
  sidebar:    { width:'220px', background:'#1e1e2f', display:'flex', flexDirection:'column', padding:'24px 16px' },
  logo:       { color:'white', marginBottom:'32px', fontSize:'18px', textAlign:'center' },
  nav:        { display:'flex', flexDirection:'column', gap:'8px', flex:1 },
  navLink:    { padding:'10px 16px', borderRadius:'8px', textDecoration:'none', fontSize:'15px', transition:'all 0.2s' },
  logoutBtn:  { padding:'10px', background:'#e53e3e', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' },
  main:       { flex:1, padding:'32px', background:'#f7f7f7', overflowY:'auto' }
};

export default AdminLayout;