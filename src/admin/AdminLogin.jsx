// src/admin/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/admin/login', {
        username,
        password
      });
      if (res.data.success) {
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/admin/hero');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={{...styles.title, color:"black"}}>Admin Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label style={{...styles.label, color: "black"}}>Username</label>
            <input
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={{...styles.label, color: "black"}}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button style={styles.btn} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f5f5f5' },
  card:    { background:'white', padding:'40px', borderRadius:'10px', boxShadow:'0 5px 15px rgba(0,0,0,0.1)', width:'360px' },
  title:   { marginBottom:'24px', textAlign:'center' },
  field:   { marginBottom:'16px', display:'flex', flexDirection:'column', gap:'6px' },
  input:   { padding:'10px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'14px' },
  btn:     { width:'100%', padding:'10px', background:'#667eea', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'15px' },
  error:   { color:'red', marginBottom:'12px', fontSize:'14px' }
};

export default AdminLogin;