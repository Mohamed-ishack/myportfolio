import React, { useEffect, useRef } from 'react';
import './About.css';

const About = ({ about }) => {
  const aboutRef = useRef(null);
  const data = about || {
    paragraphs: [
      "I'm a passionate Full Stack Developer with over 5 years of experience building web applications. I love creating elegant solutions to complex problems and continuously learning new technologies.",
      "My journey in web development started during my college years, and since then, I've worked with startups, agencies, and enterprises to deliver high-quality software solutions.",
      "When I'm not coding, you can find me reading tech blogs, contributing to open source, or exploring new hiking trails."
    ],
    stats: [
      { label: 'Projects Completed', value: '50+' },
      { label: 'Happy Clients', value: '30+' },
      { label: 'Years Experience', value: '5+' },
      { label: 'Coffee Cups', value: '100+' }
    ],
    personalInfo: {
      name: 'Mohamed Ishack',
      email: 'ishackmohamed028@gmail.com',
      location: 'Pudukkottai, TN',
      experience: 'Fresher'
    },
    profileImage: './src/images/profile.jpg',
    quote: 'Code is like humor. When you have to explain it, it is bad.',
    quoteAuthor: 'Cory House'
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content" ref={aboutRef}>
          {/* Profile Section with Image */}
          <div className="about-profile">
            <div className="profile-image-wrapper">
              <div className="profile-image-container">
                <img 
                  src={data.profileImage}
                  alt="Profile" 
                  className="profile-image"
                />
                <div className="profile-overlay">
                  <div className="social-icons">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="profile-status">
                <span className="status-dot"></span>
                Available for work
              </div>
            </div>

            <div className="profile-text">
              {data.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="about-stats">
            {data.stats.map((stat) => (
              <div key={stat.label} className="stat-item">
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Personal Information */}
          <div className="personal-info">
            <div>
              <h4>Name:</h4>
              <p>{data.personalInfo.name}</p>
            </div>
            <div>
              <h4>Email:</h4>
              <p>{data.personalInfo.email}</p>
            </div>
            <div>
              <h4>Location:</h4>
              <p>{data.personalInfo.location}</p>
            </div>
            <div>
              <h4>Experience:</h4>
              <p>{data.personalInfo.experience}</p>
            </div>
          </div>

          {/* Quote */}
          <div className="about-quote">
            <i className="fas fa-quote-left"></i>
            <p>{data.quote}</p>
            <span>- {data.quoteAuthor}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;