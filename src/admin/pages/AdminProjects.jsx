import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Atom } from 'react-loading-indicators';

const empty = { title: '', category: '', description: '', tech: '', image: '', github: '', demo: '' };

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);

  const fetchProjects = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/projects`)
      .then((res) => { setProjects(res.data); setIsLoading(false); })
      .catch((err) => console.error(err));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (isLoading) return <div className="loading"><Atom color="#32cd32" size="medium" text="Loading" textColor="" /></div>;

  // ✅ Upload image to Spring Boot
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview instantly
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = res.data.url;
      setForm((prev) => ({ ...prev, image: imageUrl }));
      setPreview(imageUrl);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/projects/${editId}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/projects`, form);
      }
      setForm(empty);
      setEditId(null);
      setPreview('');
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (project) => {
    setEditId(project.id);
    setForm({
      title: project.title,
      category: project.category,
      description: project.description,
      tech: Array.isArray(project.tech) ? project.tech.join(',') : project.tech,
      image: project.image,
      github: project.github,
      demo: project.demo,
    });
    setPreview(project.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/projects/${id}`);
    fetchProjects();
  };

  const handleCancel = () => {
    setForm(empty);
    setEditId(null);
    setPreview('');
  };

  return (
    <div className="admin-page">
      <h2 style={{ marginBottom: '16px', color: 'black' }}>{editId ? 'Edit Project' : 'Add New Project'}</h2>

      <div className="admin-card">
        <form onSubmit={handleSubmit}>

          <div style={s.imageSection} className="admin-image-section">
            <div style={s.previewWrapper}>
              {preview ? (
                <img
                  src={preview}
                  alt="Project Preview"
                  style={s.previewImg}
                />
              ) : (
                <div style={s.previewPlaceholder}>No Image</div>
              )}
            </div>

            <div style={s.uploadInfo}>
              <p style={s.uploadLabel}>Project Image</p>
              <p style={s.uploadHint}>JPG, PNG — max 5MB</p>
              <button
                type="button"
                style={s.uploadBtn}
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Choose Image'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {form.image && (
                <p style={s.urlText}>
                  Saved: <span style={{ color: '#667eea' }}>{form.image}</span>
                </p>
              )}
            </div>
          </div>

          <div className="admin-grid grid-2" style={{ marginTop: '16px' }}>
            {[
              { name: 'title', placeholder: 'Project Title' },
              { name: 'category', placeholder: 'Category (fullstack/frontend/backend)' },
              { name: 'tech', placeholder: 'Tech (React,Node.js,MongoDB)' },
              { name: 'github', placeholder: 'GitHub URL' },
              { name: 'demo', placeholder: 'Demo URL' },
            ].map((f) => (
              <input
                key={f.name}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="admin-input"
                required={['title', 'category', 'tech'].includes(f.name)}
              />
            ))}
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Project Description"
            className="admin-input"
            style={{ height: '80px', resize: 'vertical', marginTop: '10px' }}
            required
          />

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <button style={s.btnPrimary} type="submit">
              {editId ? 'Update Project' : 'Add Project'}
            </button>
            {editId && (
              <button style={s.btnSecondary} type="button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 style={{ ...s.heading, color: 'black' }}>All Projects</h2>
      <div className="table-container">
        <table className="admin-table" style={{ color: 'black' }}>
          <thead>
            <tr style={{ ...s.theadRow, color: 'black' }}>
              <th style={s.th}>Image</th>
              <th style={s.th}>Title</th>
              <th style={s.th}>Category</th>
              <th style={s.th}>Tech</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} style={s.tr}>
                <td style={s.td}>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      style={s.thumbnail}
                      onError={(e) => { e.target.onerror = null; }}
                    />
                  ) : (
                    <div style={s.noThumb}>No img</div>
                  )}
                </td>
                <td style={s.td}>{p.title}</td>
                <td style={s.td}>{p.category}</td>
                <td style={s.td}>
                  {Array.isArray(p.tech) ? p.tech.join(', ') : p.tech}
                </td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const s = {
  heading: { marginBottom: '16px', fontSize: '20px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '100%', boxSizing: 'border-box', color: '#1a1a2e', background: '#fafafa' },
  btnPrimary: { padding: '10px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnSecondary: { padding: '10px 24px', background: '#e2e8f0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { background: '#f7f7f7' },
  th: { padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #eee' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px', fontSize: '14px', color: '#1a1a2e' },
  editBtn: { padding: '6px 14px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
  deleteBtn: { padding: '6px 14px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  imageSection: { display: 'flex', alignItems: 'center', gap: '24px', padding: '16px', background: '#f8f9ff', borderRadius: '10px', border: '1px solid #e0e4ff' },
  previewWrapper: { flexShrink: 0 },
  previewImg: { width: '120px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #667eea' },
  previewPlaceholder: { width: '120px', height: '80px', borderRadius: '8px', background: '#e0e4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667eea', fontSize: '13px' },
  uploadInfo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  uploadLabel: { fontWeight: '600', color: '#1a1a2e', margin: 0, fontSize: '15px' },
  uploadHint: { color: '#888', fontSize: '13px', margin: 0 },
  uploadBtn: { padding: '8px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', width: 'fit-content' },
  urlText: { fontSize: '12px', color: '#555', margin: 0, wordBreak: 'break-all' },
  thumbnail: { width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover' },
  noThumb: { width: '60px', height: '40px', borderRadius: '4px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#999' },
};

export default AdminProjects;