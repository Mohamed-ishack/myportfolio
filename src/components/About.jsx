import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Atom } from 'react-loading-indicators';
import "./About.css";

const About = () => {
  const aboutRef = useRef(null);
  const [data, setAboutData] = React.useState({
    paragraphs: [],
    stats: [],
    personalInfo: {},
    profileImage: "",
    quote: "",
    quoteAuthor: "",
  });
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    axios.get("/api/about")
      .then((response) => {
        const raw = response.data || {};
        setAboutData({
          paragraphs: raw.description ? [raw.description] : ["Click 'Edit About Section' in the Admin Panel to add your bio and experience summary."],
          stats: [
            { label: "Projects Completed", value: raw.projects || "0" },
            { label: "Happy Clients",       value: raw.clients  || "0" },
            { label: "Years Experience",    value: raw.years    || "1" },
            { label: "Coffee Cups",         value: raw.coffee   || "0" },
          ],
          personalInfo: {
            name:       raw.name       || "Your Name",
            email:      raw.email      || "your.email@example.com",
            location:   raw.location   || "City, Country",
            experience: raw.experience || "Full Stack Developer",
          },
          profileImage: raw.profileImage || "",
          quote:        raw.quote        || "Persistence is the key to success.",
          quoteAuthor:  raw.quoteAuthor  || "Someone Inspiring",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching about data:", error);
        // Provide placeholders on error as well
        setAboutData((prev) => ({
          ...prev,
          paragraphs: ["Error loading content. Please ensure the backend is running."],
          personalInfo: { name: "Error Loading", email: "", location: "", experience: "" }
        }));
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    } else {
      // Fallback: If ref is not ready, just log it. 
      // Components might already be visible due to CSS changes.
      console.log("About ref not found for observer");
    }

    return () => observer.disconnect();
  }, [isLoading]); // Re-run when loading finishes to ensure ref is captured

  if (isLoading) return <div className="loading"><Atom color="#32cd32" size="medium" text="Loading" textColor="" /></div>;

  const profileImageUrl = data.profileImage || "/default-profileimage.jpg";

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content visible" ref={aboutRef}>
          {/* Profile Section with Image */}
          <div className="about-profile">
            <div className="profile-image-wrapper">
              <div className="profile-image-container">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="profile-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-profileimage.jpg";
                  }}
                />
                <div className="profile-overlay">
                  <div className="social-icons">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-github"></i>
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
