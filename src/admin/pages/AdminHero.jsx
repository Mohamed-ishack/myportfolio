// src/admin/pages/AdminHero.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AdminHero = () => {
  const [form, setForm] = useState({
    name: '', role: '', description: '',
    profileImage: '', experienceYears: 0,
    projectsDone: 0, techStack: ''
  });
  const [saved, setSaved]           = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [preview, setPreview]       = useState('');
  const fileInputRef                = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/hero')
      .then((res) => {
        const raw = res.data;
        setForm({ ...raw, techStack: raw.techStack || '' });
        setPreview(raw.profileImage || '');
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle image file selection and upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // Upload to Spring Boot
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = res.data.url;

      // Update form with the real server URL
      setForm((prev) => ({ ...prev, profileImage: imageUrl }));
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
    await axios.put(`http://localhost:8080/api/hero/${form.id}`, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '16px', color: 'black' }}>Edit Hero Section</h2>
      <div style={s.card}>
        <form onSubmit={handleSubmit}>

          {/* ✅ Profile Image Upload Section */}
          <div style={s.imageSection}>
            <div style={s.previewWrapper}>
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  style={s.previewImg}
                />
              ) : (
                <div style={s.previewPlaceholder}>No Image</div>
              )}
            </div>

            <div style={s.uploadInfo}>
              <p style={s.uploadLabel}>Profile Picture</p>
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
              {form.profileImage && (
                <p style={s.urlText}>
                  Saved: <span style={{ color: '#667eea' }}>{form.profileImage}</span>
                </p>
              )}
            </div>
          </div>

          {/* Other fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
            {[
              { name: 'name',            placeholder: 'Your Name'              },
              { name: 'role',            placeholder: 'Your Role'              },
              { name: 'experienceYears', placeholder: 'Years Experience'       },
              { name: 'projectsDone',    placeholder: 'Projects Done'          },
              { name: 'techStack',       placeholder: 'Tech (React,Java,MySQL)'},
            ].map((f) => (
              <input
                key={f.name}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                style={s.input}
              />
            ))}
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            style={{ ...s.input, width: '100%', height: '80px', marginTop: '12px', resize: 'vertical', boxSizing: 'border-box' }}
          />

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button type="submit" style={s.saveBtn}>Save Changes</button>
            {saved && <span style={{ color: 'green', fontSize: '14px' }}>Saved successfully!</span>}
          </div>

        </form>
      </div>
    </div>
  );
};

const s = {
  card:               { background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  imageSection:       { display: 'flex', alignItems: 'center', gap: '24px', padding: '16px', background: '#f8f9ff', borderRadius: '10px', border: '1px solid #e0e4ff' },
  previewWrapper:     { flexShrink: 0 },
  previewImg:         { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #667eea' },
  previewPlaceholder: { width: '100px', height: '100px', borderRadius: '50%', background: '#e0e4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667eea', fontSize: '13px' },
  uploadInfo:         { display: 'flex', flexDirection: 'column', gap: '6px' },
  uploadLabel:        { fontWeight: '600', color: '#1a1a2e', margin: 0, fontSize: '15px' },
  uploadHint:         { color: '#888', fontSize: '13px', margin: 0 },
  uploadBtn:          { padding: '8px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', width: 'fit-content' },
  urlText:            { fontSize: '12px', color: '#555', margin: 0, wordBreak: 'break-all' },
  input:              { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '100%', color: '#1a1a2e', background: '#fafafa' },
  saveBtn:            { padding: '10px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
};

export default AdminHero;