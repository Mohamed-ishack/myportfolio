import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Atom } from 'react-loading-indicators';

const AdminAbout = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    experience: '',
    description: '',
    profileImage: '',
    quote: '',
    quoteAuthor: '',
    projects: '',
    clients: '',
    years: '',
    coffee: '',
  });
  const [saved, setSaved]         = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]     = useState('');
  const fileInputRef              = useRef(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/about`)
      .then((res) => {
        if (res.data) {
          setForm(res.data);
          setPreview(res.data.profileImage || '');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching about data:', err);
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    try {
      if (form.id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/about/${form.id}`, form);
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/about`, form);
        setForm((prev) => ({ ...prev, id: res.data.id }));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving about data:', err);
      alert('Failed to save changes.');
    }
  };

  if (isLoading) return <div className="loading"><Atom color="#32cd32" size="medium" text="Loading About Data..." textColor="" /></div>;

  return (
    <div className="admin-page">
      <h2 style={{ ...s.heading, color: 'black' }}>Edit About Section</h2>
      <div className="admin-card">
        <form onSubmit={handleSubmit}>

          {/* ✅ Profile Image Upload */}
          <h4 style={s.subheading}>Profile Picture</h4>
          <div style={s.imageSection} className="admin-image-section">
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

          {/* Personal Info - Responsive Grid */}
          <h4 style={s.subheading}>Personal Info</h4>
          <div className="admin-grid grid-2">
            {[
              { name: 'name',       placeholder: 'Your Name'                  },
              { name: 'email',      placeholder: 'Your Email'                 },
              { name: 'location',   placeholder: 'Your Location'              },
              { name: 'experience', placeholder: 'Experience (e.g. Fresher)'  },
            ].map((f) => (
              <input
                key={f.name}
                name={f.name}
                value={form[f.name] || ''}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="admin-input"
              />
            ))}
          </div>

          {/* Description */}
          <h4 style={s.subheading}>Description</h4>
          <textarea
            name="description"
            value={form.description || ''}
            onChange={handleChange}
            placeholder="About description paragraph"
            className="admin-input"
            style={{ height: '100px', resize: 'vertical' }}
          />

          {/* Stats - Responsive Grid */}
          <h4 style={s.subheading}>Stats</h4>
          <div className="admin-grid grid-4">
            {[
              { name: 'projects', placeholder: 'Projects (e.g. 3+)' },
              { name: 'clients',  placeholder: 'Clients (e.g. 0)'   },
              { name: 'years',    placeholder: 'Years (e.g. 0)'     },
              { name: 'coffee',   placeholder: 'Coffee (e.g. 100+)' },
            ].map((f) => (
              <input
                key={f.name}
                name={f.name}
                value={form[f.name] || ''}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="admin-input"
              />
            ))}
          </div>

          {/* Quote - Responsive Grid */}
          <h4 style={s.subheading}>Quote</h4>
          <div className="admin-grid grid-2">
            <input
              name="quote"
              value={form.quote || ''}
              onChange={handleChange}
              placeholder="Inspirational quote"
              className="admin-input"
            />
            <input
              name="quoteAuthor"
              value={form.quoteAuthor || ''}
              onChange={handleChange}
              placeholder="Quote author"
              className="admin-input"
            />
          </div>

          {/* Submit */}
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button type="submit" style={s.btnPrimary}>Save Changes</button>
            {saved && <span style={{ color: 'green', fontSize: '14px' }}>Saved successfully!</span>}
          </div>

        </form>
      </div>
    </div>
  );
};

const s = {
  heading:            { marginBottom: '16px', fontSize: '20px' },
  subheading:         { margin: '16px 0 10px', fontSize: '15px', color: '#555', fontWeight: '600' },
  card:               { background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  grid2:              { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  grid4:              { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' },
  input:              { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '100%', boxSizing: 'border-box', color: '#1a1a2e', background: '#fafafa' },
  btnPrimary:         { padding: '10px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  imageSection:       { display: 'flex', alignItems: 'center', gap: '24px', padding: '16px', background: '#f8f9ff', borderRadius: '10px', border: '1px solid #e0e4ff' },
  previewWrapper:     { flexShrink: 0 },
  previewImg:         { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #667eea' },
  previewPlaceholder: { width: '100px', height: '100px', borderRadius: '50%', background: '#e0e4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667eea', fontSize: '13px' },
  uploadInfo:         { display: 'flex', flexDirection: 'column', gap: '6px' },
  uploadLabel:        { fontWeight: '600', color: '#1a1a2e', margin: 0, fontSize: '15px' },
  uploadHint:         { color: '#888', fontSize: '13px', margin: 0 },
  uploadBtn:          { padding: '8px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', width: 'fit-content' },
  urlText:            { fontSize: '12px', color: '#555', margin: 0, wordBreak: 'break-all' },
};

export default AdminAbout;