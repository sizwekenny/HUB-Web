import LandingNav from './LandingNav';
import Footer from './Footer';
import React, { useState, useEffect } from 'react';
// Import images from assets
import campus1 from '../assets/emalahleni.jpg';
import campus2 from '../assets/polokwane.png';
import campus3 from '../assets/south.jpg';

interface LandingPageProps {
  onSelect: (page: 'home' | 'manual') => void;
  onLogin: () => void;
}

const questions = [
  "Need assistance with registration or student services?",
  "Want to know more about our campuses?",
  "Looking to explore new opportunities in ICT?",
  "Your journey to success starts here!",
];

const LandingPage: React.FC<LandingPageProps> = ({ onSelect, onLogin }) => {
  const heroHeight = 'calc(100vh - 80px)'; // 80px for nav
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Adjust this value to control blur amount
  const blurAmount = 4; // in pixels

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }, 4000); // 4 seconds per question
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <LandingNav onLogin={onLogin} />

      {/* Background images side by side, normal (no skew) with blur */}
      <div
        className="absolute top-[80px] left-0 right-0 flex z-0 overflow-hidden"
        style={{ height: heroHeight }}
      >
        {[campus1, campus2, campus3].map((imgSrc, index) => (
          <div className="w-1/3" key={index}>
            <img
              src={imgSrc}
              alt={`Campus ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ filter: `blur(${blurAmount}px)` }}
            />
          </div>
        ))}
      </div>

      {/* Content overlay */}
      <div
        className="relative z-20 flex flex-col items-center justify-center"
        style={{ height: heroHeight }}
      >
        {/* Title */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-5">
            Welcome to Our Faculty of ICT Hub Guide
          </h1>
          <p className="text-2xl text-black-900 max-w-3xl mx-auto">
            Discover excellence across our four distinctive campuses, each offering unique opportunities for learning, growth, and innovation.
          </p>
        </div>

        {/* Campus buttons on top of images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-5xl px-4">
          <button
            onClick={() => onSelect('home')}
            className="bg-indigo-600 text-white px-10 py-5 text-lg font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg"
          >
            South Campus
          </button>
          <button
            className="bg-red-600 text-white px-10 py-5 text-lg font-semibold rounded-lg hover:bg-red-700 transition shadow-lg"
          >
            eMalahleni Campus
          </button>
          <button
            className="bg-yellow-600 text-white px-10 py-5 text-lg font-semibold rounded-lg hover:bg-yellow-700 transition shadow-lg"
          >
            Polokwane Campus
          </button>
        </div>

        {/* Rotating questions */}
        <div className="h-12 overflow-hidden mb-12 text-xl font-medium text-black-800">
          {questions.map((q, index) => (
            <p
              key={index}
              className={`text-center transition-opacity duration-700 ${
                index === currentQuestion ? 'opacity-100 animate-fade-slide' : 'opacity-0 pointer-events-none'
              }`}
            >
              {q}
            </p>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
