import Footer from './Footer';
import React, { useState, useEffect } from 'react';
import campus1 from '../assets/emalahleni.jpg';
import campus2 from '../assets/polokwane.png';
import campus3 from '../assets/south.jpg';
import logo from '../assets/TUT2.png';
import LandingNav from './LandingNav';

interface LandingPageProps {
  onSelect: (page: 'home' | 'manual' | 'emaHome' | 'polHome') => void;
  onLogin: () => void;
}


const questions = [
  "Need assistance with registration or student services?",
  "Want to know more about our campuses?",
  "Looking to explore new opportunities in ICT?",
  "Your journey to success starts here!",
];

const images = [campus1, campus2, campus3];

const LandingPage: React.FC<LandingPageProps> = ({ onSelect, onLogin }) => {
  const heroHeight = '100vh';
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const qInterval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }, 4000);
    return () => clearInterval(qInterval);
  }, []);

  useEffect(() => {
    const imgInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(imgInterval);
  }, []);

  return (
    <div className="relative min-h-screen bg-blue-900 overflow-hidden">

      {/* Logo on top-left */}
      <img
        src={logo}
        alt="ICT Faculty Logo"
        className="absolute top-7 left-4 z-30"
        style={{ width: '300px', height: 'auto' }}
      />
      <button
        onClick={onLogin}
        className="absolute top-12 right-10 z-30 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Admin
      </button>
      {/* Background Slideshow */}
      <div
        className="absolute top-0 left-0 right-0 z-0 overflow-hidden"
        style={{ height: heroHeight }}
      >

        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Campus ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out 
              ${index === currentImage ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
            style={{ height: heroHeight }}
          />
        ))}

        {/* Strong top & side gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 pointer-events-none" />

        {/* Floating bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full animate-bubble"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                bottom: `-${Math.random() * 20}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center px-4"
        style={{ height: heroHeight }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 animate-fade-in">
          Welcome to Our Faculty of ICT Hub Guide
        </h1>
        <p className="text-lg md:text-2xl text-blue-100 max-w-3xl mb-10 animate-fade-in-up">
          Discover excellence across our four distinctive campuses, each offering unique opportunities for learning, growth, and innovation.
        </p>

        {/* Campus Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-4xl">
          <button
            onClick={() => onSelect('home')}
            className="bg-indigo-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 transform hover:scale-105 transition"
          >
            South Campus
          </button>
          <button
            onClick={() => onSelect('emaHome')}
            className="bg-red-600 text-white px-10 py-5 text-lg font-semibold rounded-lg hover:bg-red-700 transition shadow-lg"
          >
            eMalahleni Campus
          </button>
          <button 
          onClick={() => onSelect('polHome')}
          className="bg-yellow-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-md hover:bg-yellow-700 transform hover:scale-105 transition">
            Polokwane Campus
          </button>
        </div>

        {/* Rotating Questions */}
        <div className="relative h-12 w-full max-w-2xl overflow-hidden">
          {questions.map((q, index) => (
            <p
              key={index}
              className={`absolute inset-0 text-xl font-medium text-white transition-opacity duration-700 ease-in-out
                ${index === currentQuestion ? 'opacity-100' : 'opacity-0'}`}
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
