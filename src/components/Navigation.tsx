import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  HelpCircle, 
  Menu, 
  X, 
  GraduationCap,
  Phone,
  Mail
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: 'home' | 'manual') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'manual', label: 'User Guide', icon: HelpCircle }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="p-2 bg-blue-600 rounded-lg mr-3">
              <GraduationCap className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">ICT Faculty</h1>
              <p className="text-xs text-gray-600">Information Hub</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as 'home' | 'manual')}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  {item.label}
                </button>
              );
            })}
            
            {/* Contact Info */}
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
              <a 
                href="tel:0123829500" 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <Phone className="w-4 h-4 mr-1" />
                <span className="text-sm">012 382 9500</span>
              </a>
              <a 
                href="mailto:admission@tut.ac.za" 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <Mail className="w-4 h-4 mr-1" />
                <span className="text-sm">Contact</span>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as 'home' | 'manual');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
            
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <a 
                href="tel:0123829500" 
                className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <Phone className="w-4 h-4 mr-3" />
                012 382 9500
              </a>
              <a 
                href="mailto:admission@tut.ac.za" 
                className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <Mail className="w-4 h-4 mr-3" />
                admission@tut.ac.za
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;