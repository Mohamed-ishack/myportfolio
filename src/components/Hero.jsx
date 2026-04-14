import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaInstagram } from "react-icons/fa";
import "./Hero.css";
import axios from "axios";
import { Atom } from 'react-loading-indicators';

const SOCIAL_LINKS = [
  { name: "GitHub", url: "https://github.com/your-username", icon: FaGithub },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/mohamed-ishack-52a845351", icon: FaLinkedin },
  { name: "Instagram", url: "https://instagram.com/introvert_ishxq", icon: FaInstagram },
  { name: "Email", url: "mailto:ishackmohamed028@gmail.com", icon: FaEnvelope },
];

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    name: "",
    role: "",
    description: "",
    profileImage: "",
    experienceYears: 0,
    projectsDone: 0,
    techStack: [],
  });

  useEffect(() => {
    setIsVisible(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/hero`)
      .then((response) => {
        const raw = response.data;
        const techStack = Array.isArray(raw.techStack)
          ? raw.techStack
          : typeof raw.techStack === "string"
            ? raw.techStack.split(",").map((t) => t.trim())
            : [];
        setData({ ...raw, techStack });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hero data:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="loading"><Atom color="#32cd32" size="medium" text="Loading Hero..." textColor="" /></div>;

  return (
    <section id="hero" className="hero">
      <div className="animated-bg">
        <div className="gradient-bg"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        <div className="particles"></div>
      </div>

      <div className="container">
        <div className={`hero-content ${isVisible ? "visible" : ""}`}>
            <div className="hero-left">
            <div className="hero-text">
              <div className="greeting">Welcome to my portfolio</div>
              <h1>
                Hi, I'm <span className="highlight">{data.name}</span>
                <span className="wave-emoji">👋</span>
              </h1>
              <h2>
                <span className="typed-text">{data.role}</span>
              </h2>
              <p>{data.description}</p>

              <div className="hero-buttons">
                <Link to="contact" smooth={true} duration={500} className="btn btn-primary">
                  Get In Touch
                </Link>
                <Link to="projects" smooth={true} duration={500} className="btn btn-secondary">
                  View Projects
                </Link>
                <a href="/myresume.pdf" download className="btn btn-outline">
                  <FaDownload /> Resume
                </a>
              </div>

              <div className="social-links">
                {SOCIAL_LINKS.map((item) => (

                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <item.icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="profile-card">
              <div className="profile-image-wrapper">
                <div className="profile-image-container">
                  <img
                    src={data.profileImage || "/default-profileimage.jpg"}
                    alt="Profile"
                    className="profile-image"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-profileimage.jpg"; }}
                  />
                  <div className="profile-glow"></div>
                  <div className="profile-border"></div>
                </div>
                <div className="experience-badge">
                  <div className="exp-number">{data.experienceYears}+</div>
                  <div className="exp-text">Years of Experience</div>
                </div>
                <div className="projects-badge">
                  <div className="projects-number">{data.projectsDone}+</div>
                  <div className="projects-text">Projects Done</div>
                </div>
              </div>

              <div className="tech-stack">
                {data.techStack.map((tech) => (
                  <div key={tech} className="tech-icon">{tech}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <Link to="about" smooth={true} duration={500}>
          <span></span>
        </Link>
      </div>
    </section>
  );
};

export default Hero;