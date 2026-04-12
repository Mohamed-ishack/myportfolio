import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import "./Projects.css";

const SkeletonCard = () => (
  <div className="project-card skeleton">
    <div className="skeleton-image"></div>
    <div className="project-info">
      <div className="skeleton-line title"></div>
      <div className="skeleton-line text"></div>
      <div className="skeleton-line short"></div>
      <div className="skeleton-tags">
        <div className="skeleton-tag"></div>
        <div className="skeleton-tag"></div>
        <div className="skeleton-tag"></div>
      </div>
    </div>
  </div>
);

const Projects = () => {
  const [filter, setFilter] = useState("all");
  const [projectData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Single useEffect (CORRECT)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/projects");
        setProjectData(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
    console.log("Projects render");
  }, []);

  // ✅ Memoize categories
  const categories = React.useMemo(
    () => ["all", ...Array.from(new Set(projectData.map((p) => p.category)))],
    [projectData],
  );

  // ✅ Memoize filtered list
  const filteredProjects = React.useMemo(
    () =>
      filter === "all"
        ? projectData
        : projectData.filter((p) => p.category === filter),
    [filter, projectData],
  );

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">My Projects</h2>

        {/* Filter buttons */}
        <div className="project-filters">
          {isLoading
            ? ["all", "frontend", "backend", "fullstack"].map((cat) => (
                <button key={cat} className="filter-btn skeleton-btn"></button>
              ))
            : categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${filter === cat ? "active" : ""}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
        </div>

        {/* Projects grid */}
        <div className="projects-grid">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, idx) => <SkeletonCard key={idx} />)
            : filteredProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-image">
                    <img
                      src={project.image || "/default-project.jpg"}
                      alt={project.title}
                      onError={(e) => {
                        e.target.src = "/default-project.jpg";
                      }}
                    />
                    <div className="project-overlay">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaGithub />
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    </div>
                  </div>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tech">
                      {project.tech?.map((tech, idx) => (
                        <span key={idx} className="tech-tag">
                          {tech}
                        </span>
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
