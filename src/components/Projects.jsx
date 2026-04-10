import React, { useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import './Projects.css';

const Projects = ({ projects }) => {
  const [filter, setFilter] = useState('all');
  
  const projectData = projects?.length ? projects : [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "fullstack",
      description: "A full-featured e-commerce platform with payment integration, user authentication, and admin dashboard.",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "https://via.placeholder.com/400x300",
      github: "https://github.com",
      demo: "https://demo.com"
    },
    {
      id: 2,
      title: "Task Management App",
      category: "frontend",
      description: "A collaborative task management application with real-time updates and drag-and-drop functionality.",
      tech: ["React", "Redux", "Socket.io", "Tailwind"],
      image: "https://via.placeholder.com/400x300",
      github: "https://github.com",
      demo: "https://demo.com"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      category: "frontend",
      description: "Real-time weather dashboard with interactive maps and 7-day forecast.",
      tech: ["React", "OpenWeather API", "Chart.js"],
      image: "https://via.placeholder.com/400x300",
      github: "https://github.com",
      demo: "https://demo.com"
    },
    {
      id: 4,
      title: "Social Media API",
      category: "backend",
      description: "RESTful API for a social media platform with JWT authentication and real-time notifications.",
      tech: ["Node.js", "Express", "MongoDB", "JWT"],
      image: "https://via.placeholder.com/400x300",
      github: "https://github.com",
      demo: "https://demo.com"
    }
  ];

  const categories = [
    'all',
    ...Array.from(new Set(projectData.map((project) => project.category)))
  ];
  const filteredProjects = filter === 'all'
    ? projectData
    : projectData.filter((p) => p.category === filter);

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        
        <div className="project-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                  </a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;