// src/components/Navbar.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Ensure the path is correct
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('retro');

  const toggleTheme = () => {
    const newTheme = theme === 'retro' ? 'dark' : 'retro';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
      {theme === 'retro' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
    </button>
  );
};

const Navbar = ({ onLogin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-lg">
        {/* Left Side: Logo and Brand Name */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Hatchery AI Logo" className="w-10 h-10 mr-3" />
            <span className="text-xl font-bold">Hatchify AI</span>
          </Link>
        </div>

        {/* Right Side: Theme Toggle and Login Button */}
        <div className="flex-none flex items-center">
          <ThemeToggle />
          <button className="btn btn-primary ml-2" onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </div>
</>
    );
    }

export default Navbar;
