import React from 'react';
import { FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          Made with <FaHeart /> by Mohamed Ishack | © 2026 All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;