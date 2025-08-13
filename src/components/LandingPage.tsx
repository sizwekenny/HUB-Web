import LandingNav from './LandingNav';
import Footer from './Footer';

interface LandingPageProps {
  onSelect: (page: 'home' | 'manual') => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelect, onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <LandingNav onLogin={onLogin} />
      
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
         <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Our Faculty of ICT Hub Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover excellence across our four distinctive campuses, each offering unique opportunities for learning, growth, and innovation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onSelect('home')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition"
          >
           South Campus
          </button>
          <button
            // onClick={() => onSelect('home')} need new page for its campus
            className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition"
          >
            eMalahleni Campus
          </button>
  
          <button
            // onClick={() => onSelect('home')} needs new name for its campus
            className="bg-yellow-600 text-white px-8 py-4 rounded-lg hover:bg-yellow-700 transition"
          >
            Polokwane Campus
          </button>
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default LandingPage;