import React, { useState, useEffect } from "react";
import { Home, HelpCircle, Menu, X, Search } from "lucide-react";
import logo from "../assets/TUT.png";

// Types for Department and Service
interface Department {
  id: string;
  name: string;
  description?: string;
}

interface Service {
  id: string;
  title: string;
  description?: string;
}

// Props for the Navigation component
interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  departments: Department[];
  services: Service[];
  onFilterChange: React.Dispatch<
    React.SetStateAction<"all" | "senior" | "newcomer">
  >;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  departments,
  services,
  onFilterChange,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<
    { id: string; type: "department" | "service"; name: string }[]
  >([]);

  useEffect(() => {
    if (searchText.trim() === "") {
      setSearchResults([]);
      return;
    }

    const departmentMatches = departments
      .filter((dep) => dep.name.toLowerCase().includes(searchText.toLowerCase()))
      .map((dep) => ({
        id: dep.id,
        type: "department" as const,
        name: dep.name,
      }));

    const serviceMatches = services
      .filter((srv) =>
        srv.title.toLowerCase().includes(searchText.toLowerCase())
      )
      .map((srv) => ({
        id: srv.id,
        type: "service" as const,
        name: srv.title,
      }));

    setSearchResults([...departmentMatches, ...serviceMatches]);
  }, [searchText, departments, services]);

  const handleResultClick = (result: { id: string; type: string; name: string }) => {
    onNavigate("home");
    if (result.type === "service") {
      localStorage.setItem("expandServices", "true");
    }
    setTimeout(() => {
      const element = document.getElementById(`${result.type}-${result.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        element.click();
      }
    }, 300);
    setSearchText("");
    setSearchResults([]);
    setIsMobileMenuOpen(false);
    setShowMobileSearch(false);
  };

  const scrollToServices = () => {
    setTimeout(() => {
      const servicesSection = document.getElementById("services-section");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "manual", label: "User Guide", icon: HelpCircle },
  ];

  const handleMobileNavClick = (viewId: string) => {
    if (viewId === "home") {
      window.location.href = "/";
    } else {
      onNavigate(viewId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleFilterSelect = (filter: "all" | "senior" | "newcomer") => {
    onFilterChange(filter);
    setShowFilter(false);
    setIsMobileMenuOpen(false);
    scrollToServices();
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Search Toggle */}
          <div className="flex items-center flex-1 md:flex-none">
            <div
              className="cursor-pointer"
              onClick={() => onNavigate("home")}
            >
              <img
                src={logo}
                alt="ICT Faculty Logo"
                className="rounded-md"
                style={{ 
                  width: "180px", 
                  height: "auto",
                  maxWidth: "100%"
                }}
              />
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center mx-4">
            <div className="w-full max-w-lg relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search departments or student services..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#1F4D7F' } as React.CSSProperties}
              />
              {searchResults.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="px-4 py-2 cursor-pointer text-sm hover:bg-opacity-10"
                      style={{ 
                        backgroundColor: result.type === 'department' ? 'transparent' : 'transparent', 
                        '--tw-bg-opacity': '0.1' 
                      } as React.CSSProperties}
                      onClick={() => handleResultClick(result)}
                    >
                      <span className="font-medium">{result.name}</span>
                      <span className="text-gray-500 text-xs ml-2">
                        ({result.type})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <div className="md:hidden flex items-center ml-2">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Right Nav - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "home") {
                      window.location.href = "/";
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={`flex items-center px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? "text-white shadow-lg"
                      : "text-gray-700 hover:bg-opacity-10"
                  }`}
                  style={{
                    backgroundColor: isActive ? '#1F4D7F' : 'transparent',
                    '--tw-bg-opacity': '0.1',
                    color: isActive ? 'white' : undefined,
                  } as React.CSSProperties}
                >
                  <IconComponent className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                  <span className="text-sm lg:text-base">{item.label}</span>
                </button>
              );
            })}

            {/* Filter */}
            <div className="relative">
              <button
                className="flex items-center px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Menu className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                <span className="text-sm lg:text-base">Filter</span>
              </button>
              {showFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border border-gray-200">
                  <button
                    className="block w-full px-4 py-3 text-left transition-colors duration-300 hover:bg-[#1F4D7F] hover:bg-opacity-10 text-sm"
                    onClick={() => handleFilterSelect("all")}
                  >
                    All Students
                  </button>
                  <button
                    className="block w-full px-4 py-3 text-left transition-colors duration-300 hover:bg-[#1F4D7F] hover:bg-opacity-10 text-sm"
                    onClick={() => handleFilterSelect("newcomer")}
                  >
                    Newcomers
                  </button>
                  <button
                    className="block w-full px-4 py-3 text-left transition-colors duration-300 hover:bg-[#1F4D7F] hover:bg-opacity-10 text-sm"
                    onClick={() => handleFilterSelect("senior")}
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
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 border-t border-gray-200 pt-3">
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search departments or services..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-base"
                style={{ '--tw-ring-color': '#1F4D7F' } as React.CSSProperties}
              />
              {searchResults.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="px-4 py-3 cursor-pointer text-base border-b border-gray-100 hover:bg-blue-50"
                      onClick={() => handleResultClick(result)}
                    >
                      <span className="font-medium">{result.name}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({result.type})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu - Moved outside the main nav container */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay for mobile menu - placed first */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile menu content - placed after overlay with higher z-index */}
          <div className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="py-2">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMobileNavClick(item.id)}
                        className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-300 ${
                          isActive
                            ? "bg-[#1F4D7F] text-white"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mr-3" />
                        <span className="text-base">{item.label}</span>
                      </button>
                    );
                  })}
                  
                  {/* Mobile Filter Options */}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500">
                      Filter Services
                    </div>
                    <button
                      className="flex items-center w-full px-4 py-3 text-left transition-colors duration-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => handleFilterSelect("all")}
                    >
                      <span className="text-base">All Students</span>
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-3 text-left transition-colors duration-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => handleFilterSelect("newcomer")}
                    >
                      <span className="text-base">Newcomers</span>
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-3 text-left transition-colors duration-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => handleFilterSelect("senior")}
                    >
                      <span className="text-base">Seniors</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navigation;