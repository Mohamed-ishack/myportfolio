import React, { useEffect, useState } from 'react';
import { addProject, deleteProject, loginAdmin, updateProfile, updateSkills, uploadImage } from '../api';
import './Admin.css';

const Admin = ({ portfolio, onRefresh, onNavigate }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'frontend',
    description: '',
    tech: '',
    image: 'https://via.placeholder.com/400x300',
    github: '',
    demo: ''
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    location: '',
    experience: '',
    profileImage: '',
    description: '',
    yearsExperience: '',
    projectsDone: '',
    clients: ''
  });
  const [skillForm, setSkillForm] = useState({
    category: 'Frontend',
    name: '',
    icon: 'React',
    level: 75
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedProjectImage, setSelectedProjectImage] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  useEffect(() => {
    if (portfolio?.about && portfolio?.hero) {
      setProfileForm({
        name: portfolio.about.personalInfo.name || portfolio.hero.name || '',
        email: portfolio.about.personalInfo.email || '',
        location: portfolio.about.personalInfo.location || '',
        experience: portfolio.about.personalInfo.experience || portfolio.hero.role || '',
        profileImage: portfolio.hero.profileImage || '',
        description: portfolio.hero.description || '',
        yearsExperience: portfolio.hero.experienceYears || '',
        projectsDone: portfolio.hero.projectsDone || '',
        clients: portfolio.about.stats?.[1]?.value || ''
      });
    }
  }, [portfolio]);

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('adminToken', adminToken);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [adminToken]);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (adminToken) {
        try {
          // Try to make a simple authenticated request to validate the token
          const response = await fetch('/api/portfolio', {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          if (!response.ok) {
            // Token is invalid, clear it
            setAdminToken('');
          }
        } catch (error) {
          // If there's an error, assume token is invalid
          setAdminToken('');
        }
      }
    };
    validateToken();
  }, []); // Only run on mount

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (event) => {
    const { name, value } = event.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (event) => {
    const { name, value } = event.target;
    setSkillForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const data = await loginAdmin(loginForm);
      setAdminToken(data.token);
      setStatusMessage('Login successful.');
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const handleLogout = () => {
    setAdminToken('');
    localStorage.removeItem('adminToken');
    setSelectedProjectImage(null);
    setSelectedProfileImage(null);
    setStatusMessage('Logged out successfully.');
    if (onNavigate) {
      onNavigate('/');
    }
  };

  const handleProjectImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedProjectImage(file);
    if (file) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setProjectForm((prev) => ({ ...prev, image: previewUrl }));
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedProfileImage(file);
    if (file) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfileForm((prev) => ({ ...prev, profileImage: previewUrl }));
    }
  };

  const uploadFile = async (file) => {
    if (!file) return null;
    try {
      setUploading(true);
      const result = await uploadImage(file, adminToken);
      return result.imageUrl;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const submitProject = async (event) => {
    event.preventDefault();
    try {
      let imageUrl = projectForm.image;
      
      // Upload image if a file was selected
      if (selectedProjectImage) {
        imageUrl = await uploadFile(selectedProjectImage);
      }

      await addProject({
        title: projectForm.title,
        category: projectForm.category,
        description: projectForm.description,
        tech: projectForm.tech.split(',').map((item) => item.trim()).filter(Boolean),
        image: imageUrl,
        github: projectForm.github,
        demo: projectForm.demo
      }, adminToken);
      
      setProjectForm({
        title: '',
        category: 'frontend',
        description: '',
        tech: '',
        image: 'https://via.placeholder.com/400x300',
        github: '',
        demo: ''
      });
      setSelectedProjectImage(null);
      setStatusMessage('Project added successfully.');
      onRefresh();
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    try {
      let profileImageUrl = profileForm.profileImage;
      
      // Upload image if a file was selected
      if (selectedProfileImage) {
        profileImageUrl = await uploadFile(selectedProfileImage);
      }

      await updateProfile({
        hero: {
          name: profileForm.name,
          role: profileForm.experience,
          description: profileForm.description,
          profileImage: profileImageUrl,
          experienceYears: Number(profileForm.yearsExperience) || 0,
          projectsDone: Number(profileForm.projectsDone) || 0
        },
        about: {
          personalInfo: {
            name: profileForm.name,
            email: profileForm.email,
            location: profileForm.location,
            experience: profileForm.experience
          },
          profileImage: profileImageUrl,
          stats: [
            { label: 'Projects Completed', value: `${profileForm.projectsDone || 0}+` },
            { label: 'Happy Clients', value: profileForm.clients || '0+' },
            { label: 'Years Experience', value: `${profileForm.yearsExperience || 0}+` },
            { label: 'Coffee Cups', value: '100+' }
          ]
        }
      }, adminToken);
      
      setSelectedProfileImage(null);
      setStatusMessage('Profile updated successfully.');
      onRefresh();
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const deleteProjectById = async (projectId) => {
    try {
      await deleteProject(projectId, adminToken);
      setStatusMessage('Project removed successfully.');
      onRefresh();
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const removeSkill = async (categoryTitle, skillName) => {
    try {
      const updatedSkills = (portfolio?.skills || [])
        .map((category) => {
          if (category.title !== categoryTitle) return category;
          return {
            ...category,
            skills: category.skills.filter((skill) => skill.name !== skillName)
          };
        })
        .filter((category) => category.skills.length > 0);

      await updateSkills(updatedSkills, adminToken);
      setStatusMessage('Skill removed successfully.');
      onRefresh();
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const submitSkill = async (event) => {
    event.preventDefault();
    try {
      const skillsList = portfolio?.skills || [];
      const categoryIndex = skillsList.findIndex((item) => item.title === skillForm.category);
      let updatedSkills = [];

      if (categoryIndex === -1) {
        updatedSkills = [
          ...skillsList,
          {
            title: skillForm.category,
            skills: [
              {
                name: skillForm.name,
                icon: skillForm.icon,
                level: Number(skillForm.level)
              }
            ]
          }
        ];
      } else {
        updatedSkills = skillsList.map((category, index) => {
          if (index !== categoryIndex) return category;
          return {
            ...category,
            skills: [
              ...category.skills,
              {
                name: skillForm.name,
                icon: skillForm.icon,
                level: Number(skillForm.level)
              }
            ]
          };
        });
      }

      await updateSkills(updatedSkills, adminToken);
      setSkillForm({ ...skillForm, name: '', level: 75 });
      setStatusMessage('Skill added successfully.');
      onRefresh();
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const skillCategories = portfolio?.skills?.map((category) => category.title) || [
    'Frontend',
    'Backend',
    'Database'
  ];

  return (
    <section id="admin" className="admin-panel">
      <div className="container">
        <h2 className="section-title">Admin Panel</h2>
        {!adminToken ? (
          <div className="admin-login-card">
            <p className="admin-description">
              Enter your admin username and password to update portfolio data.
            </p>
            <form onSubmit={handleLogin} className="login-form">
              <label>Username</label>
              <input name="username" value={loginForm.username} onChange={handleLoginChange} required />

              <label>Password</label>
              <input name="password" value={loginForm.password} onChange={handleLoginChange} type="password" required />

              <button type="submit" className="admin-submit">Login</button>
            </form>
            <p className="admin-help">Use /admin and login with your username and password.</p>
          </div>
        ) : (
          <>
            <div className="admin-logout-row">
              <button className="admin-logout" onClick={handleLogout}>Logout</button>
            </div>
            <p className="admin-description">
              Use this panel to add new projects, update your profile details, change your profile picture, and manage skills dynamically.
            </p>

            <div className="admin-grid">
              <div className="admin-card">
                <h3>Add New Project</h3>
                <form onSubmit={submitProject}>
                  <label>Project Title</label>
                  <input name="title" value={projectForm.title} onChange={handleProjectChange} required />

                  <label>Category</label>
                  <select name="category" value={projectForm.category} onChange={handleProjectChange}>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Fullstack</option>
                  </select>

                  <label>Description</label>
                  <textarea name="description" value={projectForm.description} onChange={handleProjectChange} required />

                  <label>Tech Tags (comma separated)</label>
                  <input name="tech" value={projectForm.tech} onChange={handleProjectChange} placeholder="React, Node.js, MongoDB" />

                  <label>Project Image</label>
                  <input type="file" accept="image/*" onChange={handleProjectImageChange} />
                  {projectForm.image && projectForm.image.startsWith('blob:') && (
                    <div className="image-preview">
                      <img src={projectForm.image} alt="Project preview" style={{ maxWidth: '200px', maxHeight: '150px' }} />
                    </div>
                  )}

                  <label>GitHub URL</label>
                  <input name="github" value={projectForm.github} onChange={handleProjectChange} />

                  <label>Demo URL</label>
                  <input name="demo" value={projectForm.demo} onChange={handleProjectChange} />

                  <button type="submit" className="admin-submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Add Project'}
                  </button>
                </form>
              </div>

              <div className="admin-card">
                <h3>Update Profile</h3>
                <form onSubmit={submitProfile}>
                  <label>Name</label>
                  <input name="name" value={profileForm.name} onChange={handleProfileChange} required />

                  <label>Email</label>
                  <input name="email" value={profileForm.email} onChange={handleProfileChange} type="email" required />

                  <label>Location</label>
                  <input name="location" value={profileForm.location} onChange={handleProfileChange} />

                  <label>Role / Experience</label>
                  <input name="experience" value={profileForm.experience} onChange={handleProfileChange} />

                  <label>Profile Image</label>
                  <input type="file" accept="image/*" onChange={handleProfileImageChange} />
                  {profileForm.profileImage && profileForm.profileImage.startsWith('blob:') && (
                    <div className="image-preview">
                      <img src={profileForm.profileImage} alt="Profile preview" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '50%' }} />
                    </div>
                  )}

                  <label>Hero Description</label>
                  <textarea name="description" value={profileForm.description} onChange={handleProfileChange} />

                  <label>Years of Experience</label>
                  <input name="yearsExperience" value={profileForm.yearsExperience} onChange={handleProfileChange} type="number" />

                  <label>Projects Completed</label>
                  <input name="projectsDone" value={profileForm.projectsDone} onChange={handleProfileChange} type="number" />

                  <label>Happy Clients</label>
                  <input name="clients" value={profileForm.clients} onChange={handleProfileChange} />

                  <button type="submit" className="admin-submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Save Profile'}
                  </button>
                </form>
              </div>

              <div className="admin-card skill-card">
                <h3>Add Skill</h3>
                <form onSubmit={submitSkill}>
                  <label>Category</label>
                  <select name="category" value={skillForm.category} onChange={handleSkillChange}>
                    {skillCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <label>Skill Name</label>
                  <input name="name" value={skillForm.name} onChange={handleSkillChange} required />

                  <label>Icon Name</label>
                  <input name="icon" value={skillForm.icon} onChange={handleSkillChange} placeholder="React, JavaScript, MongoDB" />

                  <label>Skill Level</label>
                  <input name="level" value={skillForm.level} onChange={handleSkillChange} type="number" min="0" max="100" />

                  <button type="submit" className="admin-submit">Add Skill</button>
                </form>
              </div>

              <div className="admin-card admin-list-card">
                <h3>Existing Projects</h3>
                {portfolio?.projects?.length > 0 ? (
                  <ul className="admin-list">
                    {portfolio.projects.map((project) => (
                      <li key={project.id} className="admin-list-item">
                        <span>{project.title}</span>
                        <button type="button" className="admin-delete" onClick={() => deleteProjectById(project.id)}>
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No projects added yet.</p>
                )}
              </div>

              <div className="admin-card admin-list-card">
                <h3>Current Skills</h3>
                {portfolio?.skills?.length > 0 ? (
                  <div className="skill-list">
                    {portfolio.skills.map((category) => (
                      <div key={category.title} className="skill-category">
                        <h4>{category.title}</h4>
                        <ul className="admin-list">
                          {category.skills.map((skill) => (
                            <li key={skill.name} className="admin-list-item">
                              <span>{skill.name}</span>
                              <button type="button" className="admin-delete" onClick={() => removeSkill(category.title, skill.name)}>
                                Delete
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No skills added yet.</p>
                )}
              </div>
            </div>
          </>
        )}

        {statusMessage && <div className="admin-status">{statusMessage}</div>}
      </div>
    </section>
  );
};

export default Admin;
