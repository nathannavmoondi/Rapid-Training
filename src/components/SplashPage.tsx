import React, { useEffect } from 'react';
import './SplashPage.css';
import aiHuman from '../assets/ai human.png';

const SplashPage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyOrClick = () => {
      onClose();
    };
    window.addEventListener('keydown', handleKeyOrClick);
    window.addEventListener('mousedown', handleKeyOrClick);
    return () => {
      window.removeEventListener('keydown', handleKeyOrClick);
      window.removeEventListener('mousedown', handleKeyOrClick);
    };
  }, [onClose]);

  return (
    <div className="splash-overlay">
      <div className="splash-modal">
        <button className="splash-close" onClick={onClose} aria-label="Close">×</button>
        <img src={aiHuman} alt="AI Human" className="splash-ai-img" />
        <h1 className="splash-title">Welcome to Rapid Skill</h1>
        <div className="splash-cyber-rectangle" />
        <div className="splash-tech-bg" />
        <div className="splash-bottom-text">
          <span className="splash-cool-font">AI Helping You Learn Better</span>
        </div>
        <div className="splash-press-any">press any key to continue...</div>
      </div>
    </div>
  );
};

export default SplashPage;
