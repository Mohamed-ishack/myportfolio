import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaExternalLinkAlt, FaDownload } from 'react-icons/fa';
import './Hero.css';

const Hero = ({ hero }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const data = hero || {
    name: 'Mohamed Ishack',
    role: 'Full Stack Developer',
    description: 'I build exceptional and accessible digital experiences for the web.',
    profileImage: './src/images/profile.jpg',
    experienceYears: 0,
    projectsDone: 3,
    techStack: ['React', 'Node.js', 'Python', 'MongoDB'],
    social: [
      { name: 'GitHub', url: 'https://github.com' },
      { name: 'LinkedIn', url: 'https://linkedin.com' },
      { name: 'Twitter', url: 'https://twitter.com' },
      { name: 'Email', url: 'mailto:ishackmohamed028@gmail.com' }
    ]
  };

  const socialIconMap = {
    GitHub: FaGithub,
    LinkedIn: FaLinkedin,
    Twitter: FaTwitter,
    Email: FaEnvelope
  };

  return (
    <section id="hero" className="hero">
      {/* Animated Background Elements */}
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
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
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
                <a href="/resume.pdf" download className="btn btn-outline">
                  <FaDownload /> Resume
                </a>
              </div>

              <div className="social-links">
                {data.social.map((item) => {
                  const Icon = socialIconMap[item.name] || FaExternalLinkAlt;
                  return (
                    <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="social-link">
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="profile-card">
              <div className="profile-image-wrapper">
                <div className="profile-image-container">
                  <img 
                    src={data.profileImage}
                    alt="Profile" 
                    className="profile-image"
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