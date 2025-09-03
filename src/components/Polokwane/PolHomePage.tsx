import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Monitor,
  Database,
  Cpu,
  Globe,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
  Megaphone,
  X,
  Download
} from 'lucide-react';
import { Department, Service, NewsItem } from '../../types';
import { newsStore } from '../../utils/newsStore';
import axios from 'axios';
import { mapBackendNewsArray } from '../../utils/newsMapper';
import Chatbot from '../Chatbot';

interface HomePageProps {
  departments: Department[];
  services: Service[];
  selectedFilter: 'all' | 'senior' | 'newcomer';
  onDepartmentClick: (department: Department) => void;
  onServiceClick: (service: Service) => void;
}
import Footer from './PolFooter';
// Dynamic news items fetched from in-memory store (campus: south + global)
// TODO: Replace with API integration when backend available


const HomePage: React.FC<HomePageProps> = ({
  departments,
  services,
  selectedFilter,
  onDepartmentClick,
  onServiceClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showAllNews, setShowAllNews] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);

  // Handle transition to all news view
  const handleViewAllNews = () => {
    setShowAllNews(true);
  };

  // Handle transition back to home
  const handleBackToHome = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowAllNews(false);
      setIsExiting(false);
    }, 700); // Wait for animation to complete
  };

  useEffect(() => {
    setIsLoaded(true);
    let cancel = false;
    const campusId = 3; // Polokwane campus
    const fetchCampusNews = async () => {
      try {
        let data: any[] = [];
        try {
          const res = await axios.get('/api/News/getNewsByCampus', { params: { CampusId: campusId } });
          if (Array.isArray(res.data)) data = res.data; else if (res.data?.items) data = res.data.items;
        } catch (campusErr:any) {
          const resAll = await axios.get('/api/News/getAllNews');
          data = Array.isArray(resAll.data) ? resAll.data : [];
        }
        const mapped = mapBackendNewsArray(data, 'polokwane');
        if (!cancel) setLatestNews(mapped);
      } catch (err) {
        if (!cancel) setLatestNews(newsStore.list('polokwane').filter(n => n.isVisible !== false));
      }
    };
    fetchCampusNews();
    const interval = setInterval(fetchCampusNews, 60000);
    return () => { cancel = true; clearInterval(interval); };
  }, []);

  // Close modal on Escape key press and handle body scroll
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (selectedNews) {
          setSelectedNews(null);
        } else if (showAllNews) {
          handleBackToHome();
        }
      }
    };

    if (selectedNews || showAllNews) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal or all news view is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [selectedNews, showAllNews]);

  const getDepartmentIcon = (departmentId: string) => {
    switch (departmentId) {
      case 'cs': return Monitor;
      case 'cse': return Cpu;
      case 'informatics': return Database;
      case 'it': return Globe;
      default: return BookOpen;
    }
  };

  const departmentsRef = React.useRef<HTMLDivElement>(null);
  const servicesRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shouldExpand = localStorage.getItem('expandServices');
    if (shouldExpand === 'true') {
      localStorage.removeItem('expandServices');
    }
  }, []);

  const handleScrollTo = (section: 'departments' | 'services') => {
    if (section === 'departments' && departmentsRef.current) {
      departmentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (section === 'services' && servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter services based on selectedFilter prop
const filteredServices = selectedFilter === 'all'
  ? services
  : services.filter(service => {
      if (selectedFilter === 'senior') return service.category === 'Senior Students';
      if (selectedFilter === 'newcomer') return service.category === 'Newcomer Students';
      return true; // fallback
    });


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className={`text-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-yellow-400 rounded-full shadow-lg">
                <GraduationCap className="w-16 h-16 text-blue-900" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              FoICT(Polokwane Campus)
              {/* <span className="block text-yellow-400">Information Hub</span> */}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Your comprehensive guide to academic departments, student services, and essential information
              for the Faculty of Information and Communication Technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleScrollTo('departments')}
                className="px-8 py-4 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Explore Departments
              </button>
              <button
                onClick={() => handleScrollTo('services')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transform hover:scale-105 transition-all duration-300"
              >
                Student Services
              </button>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-10 animate-ping"></div>
        <div className="absolute top-32 right-32 w-14 h-14 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-10 right-1/2 w-10 h-10 bg-white rounded-full opacity-10 animate-ping"></div>
        <div className="absolute bottom-10 left-1/2 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 left-3/4 w-16 h-16 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
      </section>

      {/* Latest News Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed with the latest announcements and updates from the ICT Faculty
            </p>
          </div>

          {/* Horizontal Scrolling News Cards */}
          <div className="relative overflow-hidden">
            {/* Fade gradients on sides */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white via-blue-50/50 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white via-blue-50/50 to-transparent z-20 pointer-events-none"></div>
            
            <div className="flex animate-scroll space-x-8 pb-4 hover:animation-play-state-paused">
              {/* Duplicate the news array to create infinite scroll effect */}
              {(latestNews.length > 3 ? [...latestNews, ...latestNews] : latestNews).map((news, index) => {
              const getCategoryIcon = (category: string) => {
                switch (category) {
                  case 'Registration': return FileText;
                  case 'Academic': return BookOpen;
                  case 'Announcement': return Megaphone;
                  case 'Deadline': return Clock;
                  case 'Event': return Calendar;
                  case 'WIL': return GraduationCap;
                  default: return FileText;
                }
              };

              const getCategoryColor = (category: string) => {
                switch (category) {
                  case 'Registration': return 'bg-blue-100 text-blue-800';
                  case 'Academic': return 'bg-blue-200 text-blue-900';
                  case 'Announcement': return 'bg-blue-50 text-blue-700';
                  case 'Deadline': return 'bg-red-100 text-red-800';
                  case 'Event': return 'bg-yellow-100 text-yellow-800';
                  case 'WIL': return 'bg-indigo-100 text-indigo-800';
                  default: return 'bg-blue-100 text-blue-800';
                }
              };

              const getPriorityStyle = (priority: string) => {
                switch (priority) {
                  case 'high': return 'border-l-4 border-blue-600';
                  case 'medium': return 'border-l-4 border-blue-400';
                  case 'low': return 'border-l-4 border-blue-300';
                  default: return 'border-l-4 border-blue-400';
                }
              };

              const IconComponent = getCategoryIcon(news.category);

              return (
                <div
                  key={`${news.id}-${latestNews.length > 0 ? Math.floor(index / latestNews.length) : 0}`}
                  className={`group bg-white rounded-xl transform transition-all duration-500 hover:scale-125 hover:z-20 cursor-pointer overflow-hidden flex-shrink-0 w-96 h-64 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 ${getPriorityStyle(news.priority)} ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${latestNews.length > 0 ? (index % latestNews.length) * 150 : 0}ms` }}
                  onClick={() => setSelectedNews(news)}
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                          <IconComponent className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(news.category)}`}>
                          {news.category}
                        </span>
                      </div>
                      {news.isUrgent && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Urgent</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                      {news.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
                      {news.summary}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{new Date(news.date).toLocaleDateString('en-ZA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {news.downloadFile && (
                          <a
                            href={news.downloadFile.url}
                            download={news.downloadFile.filename}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors duration-200"
                            title={`Download ${news.downloadFile.filename}`}
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={handleViewAllNews}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All News
            </button>
          </div>
        </div>
      </section>

      {/* News Modal */}
      {selectedNews && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    {(() => {
                      const IconComponent = (() => {
                        switch (selectedNews.category) {
                          case 'Registration': return FileText;
                          case 'Academic': return BookOpen;
                          case 'Announcement': return Megaphone;
                          case 'Deadline': return Clock;
                          case 'Event': return Calendar;
                          case 'WIL': return GraduationCap;
                          default: return FileText;
                        }
                      })();
                      return <IconComponent className="w-6 h-6 text-blue-600" />;
                    })()}
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${(() => {
                      switch (selectedNews.category) {
                        case 'Registration': return 'bg-blue-100 text-blue-800';
                        case 'Academic': return 'bg-blue-200 text-blue-900';
                        case 'Announcement': return 'bg-blue-50 text-blue-700';
                        case 'Deadline': return 'bg-red-100 text-red-800';
                        case 'Event': return 'bg-yellow-100 text-yellow-800';
                        case 'WIL': return 'bg-indigo-100 text-indigo-800';
                        default: return 'bg-blue-100 text-blue-800';
                      }
                    })()}`}>
                      {selectedNews.category}
                    </span>
                    {selectedNews.isUrgent && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedNews.title}
                </h2>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{new Date(selectedNews.date).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                  <span className="mx-2">•</span>
                  <span className={`font-medium ${
                    selectedNews.priority === 'high' ? 'text-blue-600' :
                    selectedNews.priority === 'medium' ? 'text-blue-500' : 'text-blue-400'
                  }`}>
                    {selectedNews.priority.charAt(0).toUpperCase() + selectedNews.priority.slice(1)} Priority
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {selectedNews.summary || selectedNews.content}
                  </p>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <div>
                    {selectedNews.downloadFile && (
                      <a
                        href={selectedNews.downloadFile.url}
                        download={selectedNews.downloadFile.filename}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download {selectedNews.downloadFile.type.toUpperCase()}</span>
                        <span className="text-green-200 text-sm">({selectedNews.downloadFile.size})</span>
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All News View */}
      {showAllNews && (
        <div className="fixed inset-x-0 top-16 bottom-0 bg-white z-40 overflow-y-auto animate-in fade-in duration-300">
          <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in slide-in-from-bottom duration-500">
              {/* Header */}
              <div className="mb-8 pt-4">
                <div className="flex items-center mb-6">
                  <button
                    onClick={handleBackToHome}
                    className="mr-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                    disabled={isExiting}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex-1 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">All News & Updates</h1>
                    <p className="text-lg text-gray-600">Complete list of ICT Faculty announcements and updates</p>
                  </div>
                </div>
              </div>

              {/* News Grid */}
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isExiting ? 'animate-grid-exit' : 'animate-grid-entrance'}`}>
                {latestNews.map((news, index) => {
                  const getCategoryIcon = (category: string) => {
                    switch (category) {
                      case 'Registration': return FileText;
                      case 'Academic': return BookOpen;
                      case 'Announcement': return Megaphone;
                      case 'Deadline': return Clock;
                      case 'Event': return Calendar;
                      case 'WIL': return GraduationCap;
                      default: return FileText;
                    }
                  };

                  const getCategoryColor = (category: string) => {
                    switch (category) {
                      case 'Registration': return 'bg-blue-100 text-blue-800';
                      case 'Academic': return 'bg-blue-200 text-blue-900';
                      case 'Announcement': return 'bg-blue-50 text-blue-700';
                      case 'Deadline': return 'bg-red-100 text-red-800';
                      case 'Event': return 'bg-yellow-100 text-yellow-800';
                      case 'WIL': return 'bg-indigo-100 text-indigo-800';
                      default: return 'bg-blue-100 text-blue-800';
                    }
                  };

                  const getPriorityStyle = (priority: string) => {
                    switch (priority) {
                      case 'high': return 'border-l-4 border-blue-600';
                      case 'medium': return 'border-l-4 border-blue-400';
                      case 'low': return 'border-l-4 border-blue-300';
                      default: return 'border-l-4 border-blue-400';
                    }
                  };

                  const IconComponent = getCategoryIcon(news.category);

                  return (
                    <div
                      key={news.id}
                      className={`group bg-white rounded-xl transform transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 h-64 ${getPriorityStyle(news.priority)} ${isExiting ? 'animate-card-fly-out' : 'animate-card-fly-in'}`}
                      style={{ 
                        '--start-x': `${(index % 4 - 2) * 200}px`,
                        '--start-y': `${Math.floor(index / 4) * 100 - 200}px`,
                        '--end-x': `${(index % 4 - 2) * 300}px`,
                        '--end-y': `${Math.floor(index / 4) * 150 - 300}px`
                      } as React.CSSProperties}
                      onClick={() => !isExiting && setSelectedNews(news)}
                    >
                      <div className="p-6 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                              <IconComponent className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(news.category)}`}>
                              {news.category}
                            </span>
                          </div>
                          {news.isUrgent && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Urgent</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-3">
                          {news.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
                          {news.summary}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center text-gray-500 text-xs">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{new Date(news.date).toLocaleDateString('en-ZA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {news.downloadFile && (
                              <a
                                href={news.downloadFile.url}
                                download={news.downloadFile.filename}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors duration-200"
                                title={`Download ${news.downloadFile.filename}`}
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </a>
                            )}
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Full Footer Component - Outside container for full width */}
          <Footer/>
        </div>
      )}

      {/* Academic Departments */}
      <section ref={departmentsRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Academic Departments</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our specialized departments offering cutting-edge programs in technology and computing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departments.map((department, index) => {
              const IconComponent = getDepartmentIcon(department.id);
              return (
                <div
                  id={`department-${department.id}`}
                  key={department.id}
                  className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onClick={() => onDepartmentClick(department)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition-colors duration-300">
                        <IconComponent className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {department.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {department.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {department.codes.slice(0, 3).map((code) => (
                        <span key={code} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {code}
                        </span>
                      ))}
                      {department.codes.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{department.codes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student Services */}
      <section ref={servicesRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Student Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support services to help you succeed throughout your academic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <div
                id={`service-${service.id}`}
                key={service.id}
                className={`group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-xl transform transition-all duration-500 hover:scale-105 cursor-pointer border border-blue-100 hover:border-blue-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => onServiceClick(service)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="px-3 py-1 bg-yellow-400 text-blue-900 text-xs font-semibold rounded-full">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
                </div>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
     <div>
      <Chatbot />
    </div>
    </div>
  );
};

export default HomePage;
