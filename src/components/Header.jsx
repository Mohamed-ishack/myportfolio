import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import './Header.css';

const Header = ({ darkMode, setDarkMode, isAdminPage = false, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
    closeMenu();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="hero" smooth={true} duration={500}>
            <h2>Portfolio.</h2>
          </Link>
        </div>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <ul>
            {isAdminPage ? (
              <li>
                <a href="/" onClick={(event) => { event.preventDefault(); handleNavigation('/'); }}>
                  Home
                </a>
              </li>
            ) : (
              <>
                <li><Link to="hero" smooth={true} duration={500} onClick={closeMenu}>Home</Link></li>
                <li><Link to="about" smooth={true} duration={500} onClick={closeMenu}>About</Link></li>
                <li><Link to="skills" smooth={true} duration={500} onClick={closeMenu}>Skills</Link></li>
                <li><Link to="projects" smooth={true} duration={500} onClick={closeMenu}>Projects</Link></li>
                <li><Link to="contact" smooth={true} duration={500} onClick={closeMenu}>Contact</Link></li>
                <li>
                  <a href="/admin" onClick={(event) => { event.preventDefault(); handleNavigation('/admin'); }}>
                    Admin
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="nav-controls">
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button className="mobile-toggle" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;