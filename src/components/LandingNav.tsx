import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/TUT.png";

interface LandingNavProps {
  onLogin: () => void;
}

const LandingNav: React.FC<LandingNavProps> = ({ onLogin }) => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-md" style={{ height: "60px" }}>
      <div className="flex items-center space-x-2">
       <img
        src={logo}
        alt="ICT Faculty Logo"
        className="rounded-md"
        style={{ width: "280px", height: "auto" }}
      />
        
      </div>
      <div>
        <button
          onClick={onLogin}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Admin
        </button>
      </div>
    </nav>
  );
};

export default LandingNav;
