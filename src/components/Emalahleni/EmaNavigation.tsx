import React, { useState, useEffect } from 'react';
import {
  Home,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import logo from "../../assets/TUT.png";

interface NavigationProps {
  currentView: string;
  onNavigate: (view: 'home' | 'manual' | 'emaHome') => void;
  departments: { id: string; name: string; description: string }[];
  services: { id: string; title: string; description: string }[];
  onFilterChange: (filter: 'all' | 'newcomer' | 'senior') => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  departments,
  services,
  onFilterChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<
    { id: string; type: 'department' | 'service'; name: string }[]
  >([]);

  // Scroll to services section
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (searchText.trim() === '') {
      setSearchResults([]);
      return;
    }

    const departmentMatches = departments
      .filter(dep => dep.name.toLowerCase().includes(searchText.toLowerCase()))
      .map(dep => ({ id: dep.id, type: 'department' as const, name: dep.name }));

    const serviceMatches = services
      .filter(srv => srv.title.toLowerCase().includes(searchText.toLowerCase()))
      .map(srv => ({ id: srv.id, type: 'service' as const, name: srv.title }));

    setSearchResults([...departmentMatches, ...serviceMatches]);
  }, [searchText, departments, services]);

  const handleResultClick = (result: { id: string; type: string; name: string }) => {
    onNavigate('home');

    if (result.type === 'service') {
      localStorage.setItem('expandServices', 'true');
    }

    setTimeout(() => {
      const element = document.getElementById(`${result.type}-${result.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        element.click();
      }
    }, 300);

    setSearchText('');
    setSearchResults([]);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'manual', label: 'User Guide', icon: HelpCircle }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="cursor-pointer mr-4" onClick={() => onNavigate('emaHome' as any)}>
            <img
              src={logo}
              alt="ICT Faculty Logo"
              className="rounded-md"
              style={{ width: "280px", height: "auto" }}
            />
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-lg relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search departments or student services..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchResults.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map(result => (
                    <div
                      key={result.id}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                      onClick={() => handleResultClick(result)}
                    >
                      <span className="font-medium">{result.name}</span>
                      <span className="text-gray-500 text-xs ml-2">({result.type})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav + Filter */}
          <div className="hidden md:flex items-center space-x-4 ml-4">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'home') {
                      window.location.href = '/';
                    } else if (item.id === 'manual') {
                      onNavigate('emaManual' as any);
                    }
                  }}
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

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                className="flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Menu className="w-5 h-5 mr-2" />
                Filter
              </button>
              {showFilter && (
                <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-blue-50"
                    onClick={() => {
                      onFilterChange('all');
                      setShowFilter(false);
                      scrollToServices();
                    }}
                  >
                    All Students
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-blue-50"
                    onClick={() => {
                      onFilterChange('newcomer');
                      setShowFilter(false);
                      scrollToServices();
                    }}
                  >
                    Newcomers
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-blue-50"
                    onClick={() => {
                      onFilterChange('senior');
                      setShowFilter(false);
                      scrollToServices();
                    }}
                  >
                    Seniors
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
