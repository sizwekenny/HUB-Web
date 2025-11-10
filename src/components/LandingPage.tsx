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
      {/* Header Section */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <img
          src={logo}
          alt="ICT Faculty Logo"
          className="w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56 h-auto"
        />


        {/* Admin Button */}
        <button
          onClick={onLogin}
          className="text-white px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-2 rounded-lg hover:bg-[#163c66] transition text-sm sm:text-base"
          style={{ backgroundColor: '#1F4D7F' }}
        >
          Admin
        </button>
      </div>

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

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/40 pointer-events-none" />

        {/* Floating bubbles - Hidden on mobile for performance */}
        {/* <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
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
        </div> */}
      </div>

      {/* Main Content */}
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8"
        style={{ height: heroHeight }}
      >
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-5 animate-fade-in leading-tight">
          Welcome to Our Faculty of ICT Hub Guide
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-2xl sm:max-w-3xl mb-6 sm:mb-8 md:mb-10 animate-fade-in-up leading-relaxed px-2">
          Discover excellence across our four distinctive campuses, each offering unique opportunities for learning, growth, and innovation.
        </p>

        {/* Campus Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 w-full max-w-4xl">
          {/* South Campus Button */}
          <button
            onClick={() => onSelect('home')}
            className="text-white px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-md transform hover:scale-105 transition hover:bg-[#163c66] transition-all duration-300"
            style={{ backgroundColor: '#1F4D7F' }}
          >
            South Campus
          </button>

          {/* eMalahleni Campus Button */}
          <button
            onClick={() => onSelect('emaHome')}
            className="bg-red-600 text-white px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg hover:bg-red-700 transition shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            eMalahleni Campus
          </button>

          {/* Polokwane Campus Button */}
          <button
            onClick={() => onSelect('polHome')}
            className="bg-yellow-600 text-white px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-md hover:bg-yellow-700 transform hover:scale-105 transition transition-all duration-300"
          >
            Polokwane Campus
          </button>
        </div>

        {/* Rotating Questions */}
        <div className="relative h-12 sm:h-14 md:h-16 w-full max-w-xs sm:max-w-sm md:max-w-2xl overflow-hidden">
          {questions.map((q, index) => (
            <p
              key={index}
              className={`absolute inset-0 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white transition-opacity duration-700 ease-in-out text-center px-2
                ${index === currentQuestion ? 'opacity-100' : 'opacity-0'}`}
            >
              {q}
            </p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;