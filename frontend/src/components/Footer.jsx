import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        <Link to="/terms" className="footer-link">Terms of Service</Link>
      </div>
      <p className="footer-copy">&copy; {new Date().getFullYear()} SafeHaven. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
