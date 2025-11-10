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
import polokwaneCampusImg from '../../assets/polokwane.png';

interface HomePageProps {
  departments: Department[];
  services: Service[];
  selectedFilter: 'all' | 'senior' | 'newcomer';
  onDepartmentClick: (department: Department) => void;
  onServiceClick: (service: Service) => void;
}
import Footer from './PolFooter';
import { useNavigate } from 'react-router-dom';
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
  const [isExiting, setIsExiting] = useState(false);
  const [showCampusVideo, setShowCampusVideo] = useState(false);
  const [showAllNews, setShowAllNews] = useState(false);
  const [latestNews] = useState<NewsItem[]>([
    {
      id: 'news-1',
      title: 'Registration for 2026 Now Open',
      category: 'Registration',
      date: new Date('2025-10-01').toISOString(),
      summary: 'All students are invited to register for the 2026 academic year. Early registration is encouraged to secure your place.',
      priority: 'high',
      isUrgent: true,
      downloadFile: undefined,
      content: '',
    },
    {
      id: 'news-2',
      title: 'ICT Career Fair This November',
      category: 'Event',
      date: new Date('2025-11-15').toISOString(),
      summary: 'Meet top tech employers and explore internship opportunities at the annual ICT Career Fair.',
      priority: 'medium',
      isUrgent: false,
      downloadFile: undefined,
      content: '',
    },
    {
      id: 'news-3',
      title: 'New Computer Lab Opened',
      category: 'Announcement',
      date: new Date('2025-10-20').toISOString(),
      summary: 'A state-of-the-art computer lab is now available for all ICT students in Building 82.',
      priority: 'low',
      isUrgent: false,
      downloadFile: undefined,
      content: '',
    },
    {
      id: 'news-4',
      title: 'Exam Timetable Released',
      category: 'Academic',
      date: new Date('2025-10-29').toISOString(),
      summary: 'The final exam timetable for 2025 is now available. Please check your student portal for details.',
      priority: 'medium',
      isUrgent: false,
      downloadFile: undefined,
      content: '',
    },
  ]);
  const navigate = useNavigate();

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
        } catch (campusErr: any) {
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

  useEffect(() => {
    if (selectedFilter !== 'all') {
      handleScrollTo('services');
    }
  }, [selectedFilter]);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600"
        style={{
          backgroundImage: `url(${polokwaneCampusImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Optional dark overlay for contrast */}
        <div
          className="absolute inset-0 bg-black opacity-60"
        ></div>
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
              <button
                onClick={() => navigate('/pol-campus-videos')}
                className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-yellow-600 hover:text-white hover:border-white border-2 border-transparent transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Explore Our Campus
              </button>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        {/* <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-10 animate-ping"></div>
        <div className="absolute top-32 right-32 w-14 h-14 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-10 right-1/2 w-10 h-10 bg-white rounded-full opacity-10 animate-ping"></div>
        <div className="absolute bottom-10 left-1/2 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 left-3/4 w-16 h-16 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div> */}
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
                  <span className={`font-medium ${selectedNews.priority === 'high' ? 'text-blue-600' :
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
          <Footer />
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
      {/* Directorate of Health and Wellness - Modern Professional Design */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Health & Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Comprehensive support services for your physical and mental well-being.
              Your health is our priority.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Campus Clinic Card */}
            <div
              className="group relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100/80 overflow-hidden"
              onClick={() =>
                setSelectedNews({
                  id: "clinic-card",
                  title: "Campus Clinic",
                  category: "Health Services",
                  date: new Date().toISOString(),
                  summary: `Campus Clinic Services - Buildings 82 & 83

MEDICAL SERVICES CONTACT:
Head of Department: 012 382 0589
Administration Office: 012 382 9184
Nursing Services: 012 382 9089 / 012 382 9090
Counseling Services: 012 382 9446

OPERATING HOURS:
Monday to Thursday: 08:30 – 15:30
Friday: 08:30 – 13:00
Emergency Services: 08:00 – 16:00 (Weekdays)

AFTER-HOURS EMERGENCY CONTACTS:
Campus Protection Services: 012 382 5101 / 012 382 4228
ER24 Emergency Response: 084 124 or 010 205 3000
National HIV Support Line: 0800 012 322 / 0860 448 911

Our campus clinic provides comprehensive medical care, health consultations, and wellness support services for all students.`,
                  priority: "medium",
                  isUrgent: false,
                  downloadFile: {
                    url: "/assets/Student_Guide.pdf",
                    filename: "Student_Guide.pdf",
                    type: "pdf",
                  },
                  content: "",
                })
              }
            >
              {/* Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-indigo-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-blue-200/30 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-2xl transform rotate-6 scale-110 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        Campus Clinic
                      </h3>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mt-2">
                        Medical Services
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow text-sm">
                  Comprehensive medical services and healthcare support for all students.
                  Professional medical staff available during operating hours.
                </p>

                {/* Key Information */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Buildings 82 & 83</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Mon-Thu: 08:30-15:30</span>
                  </div>
                </div>

                {/* Services List */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Medical Care</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Emergency Services</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Health Education</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Counseling</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs">Available Now</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                    <span className="text-sm">View Details</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-500"></div>
            </div>

            {/* Peer Education Card */}
            <div
              className="group relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100/80 overflow-hidden"
              onClick={() =>
                setSelectedNews({
                  id: "peer-education",
                  title: "Peer Education Programme",
                  category: "Student Support",
                  date: new Date().toISOString(),
                  summary: `Peer Education Programme

PROGRAM OVERVIEW:
Trained student volunteers promote positive health, lifestyle choices, and behaviour change among fellow students through peer-led initiatives.

KEY FOCUS AREAS:
• HIV/AIDS awareness and prevention
• Mental health support and resources
• Sexual and reproductive health education
• Substance abuse prevention programs

PROGRAM LOCATION:
Directorate of Health & Wellness

CONTACT INFORMATION:
012 382 9446 / 012 382 9089

Join our peer education program to make a positive impact on campus health awareness.`,
                  priority: "medium",
                  isUrgent: false,
                  downloadFile: undefined,
                  content: "",
                })
              }
            >
              {/* Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 to-emerald-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-green-200/30 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-2xl transform rotate-6 scale-110 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                        Peer Education
                      </h3>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mt-2">
                        Student Support
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow text-sm">
                  Student-led health awareness initiatives promoting positive lifestyle choices
                  and community well-being through peer support networks.
                </p>

                {/* Key Information */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Health & Wellness</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Student Volunteers</span>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Health Awareness</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Mental Health</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Prevention</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Community</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs">Volunteer Program</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600 font-semibold group-hover:text-green-700 transition-colors duration-300">
                    <span className="text-sm">Learn More</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 group-hover:w-full transition-all duration-500"></div>
            </div>

            {/* GBV Support Card */}
            <div
              className="group relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100/80 overflow-hidden"
              onClick={() =>
                setSelectedNews({
                  id: "gbv-support",
                  title: "Gender-Based Violence (GBV) Support",
                  category: "Awareness & Safety",
                  date: new Date().toISOString(),
                  summary: `Gender-Based Violence Support Services

UNDERSTANDING ABUSE:
Abuse involves the misuse of power to control another person, manifesting in various forms:

FORMS OF ABUSE:
• Physical abuse: Physical harm including hitting, kicking, slapping
• Sexual abuse: Non-consensual or forced sexual acts
• Verbal abuse: Humiliation, threats, and verbal intimidation
• Financial abuse: Restricting access to financial resources
• Emotional abuse: Psychological manipulation, fear, and control

EMERGENCY SUPPORT CHANNELS:
GBV Emergency Helpline: 0800 428 428
USSD Support: *120*7867#
SMS Support: Text "help" to 31531

Confidential support and safety resources available for all students.`,
                  priority: "high",
                  isUrgent: true,
                  downloadFile: undefined,
                  content: `
<div class="space-y-4">
  <div class="border-l-4 border-red-500 pl-4">
    <h3 class="text-lg font-bold text-gray-900 mb-2">ADDITIONAL RESOURCES</h3>
    <p class="text-gray-700">For comprehensive information and support resources, visit the official GBV support platform.</p>
  </div>
  <div class="bg-red-50 rounded-lg p-4">
    <h4 class="font-semibold text-red-800 mb-2">IMMEDIATE ASSISTANCE</h4>
    <p class="text-red-700 text-sm mb-3">If you or someone you know needs immediate help, contact our emergency lines.</p>
    <a href="https://gbv.org.za" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200">
      Access Support Resources
      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3h7m0 0v7m0-7L10 14" />
      </svg>
    </a>
  </div>
</div>
`,
                })
              }
            >
              {/* Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 to-orange-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-red-200/30 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/20 rounded-2xl transform rotate-6 scale-110 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                        GBV Support
                      </h3>
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full mt-2">
                        Emergency Support
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow text-sm">
                  Confidential support services and safety resources for gender-based violence situations.
                  Immediate assistance and protective measures available.
                </p>

                {/* Key Information */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">24/7 Emergency Line</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Confidential Support</span>
                  </div>
                </div>

                {/* Support Channels */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Emergency Help</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Safety Planning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Counseling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">Resources</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-xs">Urgent Support</span>
                  </div>
                  <div className="flex items-center space-x-2 text-red-600 font-semibold group-hover:text-red-700 transition-colors duration-300">
                    <span className="text-sm">Get Help</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-red-500 to-orange-600 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Need immediate assistance? We're here to help.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact Health Services
            </button>
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
      {showCampusVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[70] p-4"
          onClick={() => setShowCampusVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCampusVideo(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <X className="w-6 h-6 text-black" />
            </button>
            <video
              className="w-full h-auto"
              controls
              autoPlay
            >
              <source src="src/assets/polokwane.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
      <div>
        <Chatbot />
      </div>
    </div>
  );
};

export default HomePage;
