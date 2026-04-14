import { useState, useEffect } from 'react';
import axios from 'axios';
import { Atom } from 'react-loading-indicators';
import './AdminSkills.css'

const empty = { name: '', icon: '', level: '', category: '' };

const CATEGORIES = ['Frontend', 'Backend', 'Database'];

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const fetchSkills = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/skills`)
      .then((res) => {
        // res.data is grouped [{title, skills}]
        // flatten into single array for table view
        const flat = res.data.flatMap((group) =>
          group.skills.map((sk) => ({ ...sk, category: group.title }))
        );
        setSkills(flat);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching skills:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, level: parseInt(form.level) };
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/skills/${editId}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/skills`, payload);
      }
      setForm(empty);
      setEditId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchSkills();
    } catch (err) {
      console.error('Error saving skill:', err);
    }
  };

  const handleEdit = (skill) => {
    setEditId(skill.id);
    setForm({
      name: skill.name,
      icon: skill.icon,
      level: skill.level,
      category: skill.category,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/skills/${id}`);
      fetchSkills();
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  const handleCancel = () => { setForm(empty); setEditId(null); };

  return (
    <div className="admin-page">
      <h2 style={{ ...s.heading, color: '#1a1a2e' }}>{editId ? 'Edit Skill' : 'Add Skill'}</h2>
      {isLoading ? (
        <div className="loading" style={{ minHeight: '300px' }}>
          <Atom color="#32cd32" size="medium" text="Loading Skills..." textColor="" />
        </div>
      ) : (
        <>

      {/* Form Card */}
      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          <div className="admin-grid grid-4">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Skill Name (e.g. React)"
              className="admin-input"
              required
            />

            <input
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="Icon Key (e.g. React, Node.js)"
              className="admin-input"
              required
            />

            <input
              name="level"
              type="number"
              min="1"
              max="100"
              value={form.level}
              onChange={handleChange}
              placeholder="Level (1-100)"
              className="admin-input"
              required
            />

            {/* Category dropdown */}
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="admin-input"
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="submit" style={s.btnPrimary}>
              {editId ? 'Update Skill' : 'Add Skill'}
            </button>
            {editId && (
              <button type="button" style={s.btnSecondary} onClick={handleCancel}>
                Cancel
              </button>
            )}
            {saved && <span style={{ color: 'green', fontSize: '14px' }}>Saved successfully!</span>}
          </div>
        </form>
      </div>

      {/* Skills Tables grouped by category */}
      <h2 style={{ ...s.heading, color: '#1a1a2e' }}>All Skills</h2>
      <div className="admin-card">
        {CATEGORIES.map((cat) => {
            const catSkills = skills.filter((sk) => sk.category === cat);
            if (catSkills.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: '24px' }}>
                <h4 style={{ ...s.catLabel, color: '#1a1a2e' }}>{cat}</h4>
                <div className="table-container">
                  <table className="admin-table" style={{ color: '#1a1a2e' }}>
                    <thead>
                      <tr style={{ ...s.theadRow, color: '#1a1a2e' }}>
                        <th style={{ ...s.th, color: '#1a1a2e' }}>Name</th>
                        <th style={{ ...s.th, color: '#1a1a2e' }}>Icon Key</th>
                        <th style={{ ...s.th, color: '#1a1a2e' }}>Level</th>
                        <th style={{ ...s.th, color: '#1a1a2e' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {catSkills.map((skill) => (
                        <tr key={skill.id} style={s.tr}>
                          <td style={s.td}>{skill.name}</td>
                          <td style={s.td}>{skill.icon}</td>
                          <td style={s.td}>
                            {/* Level bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={s.barBg}>
                                <div style={{ ...s.barFill, width: `${skill.level}%` }}></div>
                              </div>
                              <span style={{ fontSize: '13px', minWidth: '32px' }}>{skill.level}%</span>
                            </div>
                          </td>
                          <td style={s.td}>
                            <button style={s.editBtn} onClick={() => handleEdit(skill)}>Edit</button>
                            <button style={s.deleteBtn} onClick={() => handleDelete(skill.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
};

const s = {
  heading: { marginBottom: '16px', fontSize: '20px' },
  catLabel: { fontSize: '15px', fontWeight: '600', color: '#667eea', marginBottom: '8px' },
  card: { background: 'white', borderRadius: '10px', padding: '24px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  btnPrimary: { padding: '10px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  btnSecondary: { padding: '10px 24px', background: '#e2e8f0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { background: '#f7f7f7' },
  th: { padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #eee', fontSize: '14px' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px', fontSize: '14px' },
  editBtn: { padding: '6px 14px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
  deleteBtn: { padding: '6px 14px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  barBg: { background: '#eee', borderRadius: '4px', height: '8px', width: '100px' },
  barFill: { background: '#667eea', borderRadius: '4px', height: '8px', transition: 'width 0.3s' },
};

export default AdminSkills;