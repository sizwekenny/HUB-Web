
// import React, { useState, useEffect } from 'react';
// import {
//   GraduationCap,
//   BookOpen,
//   ChevronRight,
//   ChevronLeft,
//   Monitor,
//   Database,
//   Cpu,
//   Globe,
//   Clock,
//   AlertTriangle,
//   Calendar,
//   FileText,
//   Megaphone,
//   X, MapPin, Phone, Mail,
//   Download
// } from 'lucide-react';

// import { Department, Service, NewsItem } from '../types';
// import Chatbot from './Chatbot';
// import { useNavigate } from "react-router-dom";
// import Footer from './Footer';

// interface HomePageProps {
//   departments: Department[];
//   services: Service[];
//   selectedFilter: "all" | "senior" | "newcomer";
//   onDepartmentClick: (dept: Department) => void;
//   onServiceClick: (service: Service) => void;
// }

// const HomePage: React.FC<HomePageProps> = ({
//   departments,
//   services,
//   selectedFilter,
//   onDepartmentClick,
//   onServiceClick
// }) => {
//   const [showAllNews, setShowAllNews] = useState(false);
//   const [isExiting, setIsExiting] = useState(false);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
//   const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [apiError, setApiError] = useState('');
  
//   const navigate = useNavigate();
//   const [showCampusVideo, setShowCampusVideo] = useState(false);

//   const API_URL = 'http://localhost:4000/api';
//   const SOSHANGUVE_CAMPUS_NAME = 'Soshanguve South Campus';

//   // TUT Color Scheme from Logo
//   const tutColors = {
//     primary: {
//       blue: '#003884',     // Dark blue from logo
//       gold: '#FFD100',     // Yellow/Gold from logo
//       lightBlue: '#1F4D7F', // Lighter blue variant
//     },
//     secondary: {
//       white: '#FFFFFF',
//       lightGray: '#F8FAFC',
//       gray: '#6B7280',
//       darkGray: '#374151'
//     }
//   };

//   // Fetch Soshanguve Campus News
//   const fetchSoshanguveNews = async () => {
//     setLoading(true);
//     setApiError('');
//     try {
//       const response = await fetch(`${API_URL}/news`);
//       if (!response.ok) throw new Error('Failed to fetch news');
//       const allNews = await response.json();
      
//       // Filter for Soshanguve Campus only
//       const soshanguveNews = allNews.filter(item => 
//         item.campus_name === SOSHANGUVE_CAMPUS_NAME || 
//         !item.campus_id // Include news that applies to all campuses
//       ).filter(item => item.is_visible); // Only show visible news
      
//       // Sort by date (newest first) and take latest
//       const sortedNews = soshanguveNews.sort((a, b) => 
//         new Date(b.publish_date || b.created_at) - new Date(a.publish_date || a.created_at)
//       );

//       // Transform API data to match your NewsItem interface
//       const transformedNews = sortedNews.map(item => ({
//         id: item.news_id,
//         title: item.title,
//         category: item.category_name || 'Announcement',
//         date: item.publish_date || item.created_at,
//         summary: item.summary,
//         content: item.content || item.summary,
//         priority: item.priority || 'medium',
//         isUrgent: item.is_urgent || false,
//         downloadFile: item.attachment_url ? {
//           url: item.attachment_url,
//           filename: item.attachment_filename || 'download',
//           type: 'file'
//         } : undefined
//       }));
      
//       setLatestNews(transformedNews);
//     } catch (err) {
//       setApiError(err.message);
//       console.error('Error fetching news:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewAllNews = () => {
//     setShowAllNews(true);
//   };

//   const handleBackToHome = () => {
//     setIsExiting(true);
//     setTimeout(() => {
//       setShowAllNews(false);
//       setIsExiting(false);
//     }, 700);
//   };

//   useEffect(() => {
//     setIsLoaded(true);
//     fetchSoshanguveNews();
//   }, []);

//   useEffect(() => {
//     const handleEscapeKey = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         if (selectedNews) {
//           setSelectedNews(null);
//         } else if (showAllNews) {
//           handleBackToHome();
//         }
//       }
//     };

//     if (selectedNews || showAllNews) {
//       document.addEventListener('keydown', handleEscapeKey);
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscapeKey);
//       document.body.style.overflow = 'unset';
//     };
//   }, [selectedNews, showAllNews]);

//   // Refresh news when component becomes visible again
//   useEffect(() => {
//     if (!showAllNews && !selectedNews) {
//       fetchSoshanguveNews();
//     }
//   }, [showAllNews, selectedNews]);

//   const getDepartmentIcon = (departmentId: string) => {
//     switch (departmentId) {
//       case 'cs': return Monitor;
//       case 'cse': return Cpu;
//       case 'informatics': return Database;
//       case 'it': return Globe;
//       default: return BookOpen;
//     }
//   };

//   const departmentsRef = React.useRef<HTMLDivElement>(null);
//   const servicesRef = React.useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const shouldExpand = localStorage.getItem('expandServices');
//     if (shouldExpand === 'true') {
//       localStorage.removeItem('expandServices');
//     }
//   }, []);

//   useEffect(() => {
//     if (selectedFilter !== 'all') {
//       handleScrollTo('services');
//     }
//   }, [selectedFilter]);

//   const handleScrollTo = (section: 'departments' | 'services') => {
//     if (section === 'departments' && departmentsRef.current) {
//       departmentsRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//     if (section === 'services' && servicesRef.current) {
//       servicesRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   const filteredServices = selectedFilter === 'all'
//     ? services
//     : services.filter(service => {
//       if (selectedFilter === 'senior') return service.category === 'Senior Students';
//       if (selectedFilter === 'newcomer') return service.category === 'Newcomer Students';
//       return true;
//     });

//   // Helper functions for news rendering
//   const getCategoryIcon = (category: string) => {
//     switch (category) {
//       case 'Registration': return FileText;
//       case 'Academic': return BookOpen;
//       case 'Announcement': return Megaphone;
//       case 'Deadline': return Clock;
//       case 'Event': return Calendar;
//       case 'WIL': return GraduationCap;
//       default: return FileText;
//     }
//   };

//   const getCategoryColor = (category: string) => {
//     switch (category) {
//       case 'Registration': return `bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F]`;
//       case 'Academic': return `bg-[#003884] bg-opacity-10 text-[#003884]`;
//       case 'Announcement': return `bg-[#1F4D7F] bg-opacity-5 text-[#1F4D7F]`;
//       case 'Deadline': return 'bg-red-100 text-red-800';
//       case 'Event': return `bg-[#FFD100] bg-opacity-20 text-[#003884]`;
//       case 'WIL': return 'bg-indigo-100 text-indigo-800';
//       default: return `bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F]`;
//     }
//   };

//   const getPriorityStyle = (priority: string) => {
//     switch (priority) {
//       case 'high': return 'border-l-4 border-[#003884]';
//       case 'medium': return 'border-l-4 border-[#1F4D7F]';
//       case 'low': return 'border-l-4 border-blue-300';
//       default: return 'border-l-4 border-[#1F4D7F]';
//     }
//   };

//   const renderNewsCard = (news: NewsItem, index: number, isMobile: boolean = false) => {
//     const IconComponent = getCategoryIcon(news.category);

//     return (
//       <div
//         key={`${news.id}-${index}`}
//         className={`group bg-white rounded-xl transform transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden ${
//           isMobile ? 'w-full shadow-lg hover:shadow-xl' : 'flex-shrink-0 w-80 h-64 shadow-lg hover:shadow-2xl hover:shadow-[#003884]/20'
//         } ${getPriorityStyle(news.priority)} ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
//         style={{ transitionDelay: `${index * 150}ms` }}
//         onClick={() => setSelectedNews(news)}
//       >
//         <div className="p-4 md:p-6 h-full flex flex-col">
//           <div className="flex items-start justify-between mb-3 md:mb-4">
//             <div className="flex items-center space-x-2 md:space-x-3">
//               <div className="p-2 md:p-3 bg-[#1F4D7F] bg-opacity-10 rounded-lg group-hover:bg-[#003884] transition-colors duration-300">
//                 <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-[#1F4D7F] group-hover:text-white transition-colors duration-300" />
//               </div>
//               <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(news.category)}`}>
//                 {news.category}
//               </span>
//             </div>
//             {news.isUrgent && (
//               <div className="flex items-center space-x-1 px-2 py-1 bg-[#FFD100] text-[#003884] text-xs font-semibold rounded-full">
//                 <AlertTriangle className="w-3 h-3" />
//                 <span>Urgent</span>
//               </div>
//             )}
//           </div>

//           <h3 className={`font-semibold text-gray-900 mb-2 group-hover:text-[#003884] transition-colors duration-300 line-clamp-2 ${
//             isMobile ? 'text-base' : 'text-lg'
//           }`}>
//             {news.title}
//           </h3>

//           <p className="text-sm text-gray-600 mb-3 md:mb-4 flex-grow line-clamp-2">
//             {news.summary}
//           </p>

//           <div className="flex items-center justify-between mt-auto">
//             <div className="flex items-center text-gray-500 text-xs">
//               <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
//               <span>{new Date(news.date).toLocaleDateString('en-ZA', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric'
//               })}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               {news.downloadFile && (
//                 <a
//                   href={news.downloadFile.url}
//                   download={news.downloadFile.filename}
//                   onClick={(e) => e.stopPropagation()}
//                   className="flex items-center space-x-1 px-2 py-1 bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F] text-xs font-medium rounded-full hover:bg-[#1F4D7F] hover:text-white transition-colors duration-200"
//                   title={`Download ${news.downloadFile.filename}`}
//                 >
//                   <Download className="w-3 h-3" />
//                   <span className={isMobile ? 'hidden sm:inline' : ''}>Download</span>
//                 </a>
//               )}
//               <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-[#003884] transform group-hover:translate-x-1 transition-all duration-300" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section
//         className="relative overflow-hidden bg-gradient-to-r from-[#003884] via-[#1F4D7F] to-[#003884]"
//         style={{
//           backgroundImage: `url(src/assets/sosh_south.png)`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <div className="absolute inset-0 bg-black opacity-60"></div>
//         <div className="absolute inset-0 bg-black opacity-10"></div>

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
//           <div className={`text-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//             <div className="flex justify-center mb-8">
//               <div className="p-4 bg-[#FFD100] rounded-full shadow-lg">
//                 <GraduationCap className="w-16 h-16 text-[#003884]" />
//               </div>
//             </div>
//             <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
//               FoICT (Soshanguve South Campus)
//             </h1>
//             <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
//               Your comprehensive guide to academic departments, student services, and essential information
//               for the Faculty of Information and Communication Technology.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={() => handleScrollTo('departments')}
//                 className="px-8 py-4 bg-[#FFD100] text-[#003884] font-semibold rounded-lg hover:bg-[#E6BC00] transform hover:scale-105 transition-all duration-300 shadow-lg"
//               >
//                 Explore Departments
//               </button>
//               <button
//                 onClick={() => handleScrollTo('services')}
//                 className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#003884] transform hover:scale-105 transition-all duration-300"
//               >
//                 Student Services
//               </button>
//               <button
//                 onClick={() => navigate('/campus-videos')}
//                 className="px-8 py-4 bg-white text-[#003884] font-semibold rounded-lg hover:bg-[#FFD100] hover:text-[#003884] border-2 border-transparent transform hover:scale-105 transition-all duration-300 shadow-lg"
//               >
//                 Explore Our Campus
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Latest News Section - Updated with API Data */}
//       <section className="relative py-12 md:py-20 bg-white overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8 md:mb-12">
//             <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
//               Latest News & Updates
//               {loading && (
//                 <span className="ml-2 text-sm text-blue-600 font-normal">Loading...</span>
//               )}
//             </h2>
//             <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
//               Stay informed with the latest announcements and updates from Soshanguve South Campus
//             </p>
//             {apiError && (
//               <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm max-w-2xl mx-auto">
//                 Error loading news: {apiError}
//               </div>
//             )}
//           </div>

//           {loading && latestNews.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003884] mx-auto"></div>
//               <p className="mt-4 text-gray-600">Loading campus news...</p>
//             </div>
//           ) : latestNews.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-500">No news available for Soshanguve Campus at the moment.</p>
//             </div>
//           ) : (
//             <>
//               {/* Mobile: Vertical Scroll */}
//               <div className="lg:hidden space-y-4">
//                 {latestNews.slice(0, 3).map((news: NewsItem, index: number) => 
//                   renderNewsCard(news, index, true)
//                 )}
//               </div>

//               {/* Desktop Horizontal Scroll - Fixed duplicate keys */}
//               <div className="hidden lg:block relative overflow-hidden">
//                 <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white via-blue-50/50 to-transparent z-20 pointer-events-none"></div>
//                 <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white via-blue-50/50 to-transparent z-20 pointer-events-none"></div>

//                 <div className="flex animate-scroll space-x-6 pb-4 hover:animation-play-state-paused">
//                   {latestNews.map((news: NewsItem, index: number) => {
//                     const IconComponent = getCategoryIcon(news.category);
                    
//                     return (
//                       <div
//                         key={`${news.id}-${index}`}
//                         className={`group bg-white rounded-xl transform transition-all duration-500 hover:scale-125 hover:z-20 cursor-pointer overflow-hidden flex-shrink-0 w-80 h-64 shadow-lg hover:shadow-2xl hover:shadow-[#003884]/20 ${getPriorityStyle(news.priority)} ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
//                         style={{ transitionDelay: `${index * 150}ms` }}
//                         onClick={() => setSelectedNews(news)}
//                       >
//                         <div className="p-6 h-full flex flex-col">
//                           <div className="flex items-start justify-between mb-4">
//                             <div className="flex items-center space-x-3">
//                               <div className="p-2 bg-[#1F4D7F] bg-opacity-10 rounded-lg group-hover:bg-[#003884] transition-colors duration-300">
//                                 <IconComponent className="w-5 h-5 text-[#1F4D7F] group-hover:text-white transition-colors duration-300" />
//                               </div>
//                               <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(news.category)}`}>
//                                 {news.category}
//                               </span>
//                             </div>
//                             {news.isUrgent && (
//                               <div className="flex items-center space-x-1 px-2 py-1 bg-[#FFD100] text-[#003884] text-xs font-semibold rounded-full">
//                                 <AlertTriangle className="w-3 h-3" />
//                                 <span>Urgent</span>
//                               </div>
//                             )}
//                           </div>

//                           <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#003884] transition-colors duration-300 line-clamp-2">
//                             {news.title}
//                           </h3>

//                           <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
//                             {news.summary}
//                           </p>

//                           <div className="flex items-center justify-between mt-auto">
//                             <div className="flex items-center text-gray-500 text-xs">
//                               <Clock className="w-4 h-4 mr-1" />
//                               <span>{new Date(news.date).toLocaleDateString('en-ZA', {
//                                 year: 'numeric',
//                                 month: 'short',
//                                 day: 'numeric'
//                               })}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               {news.downloadFile && (
//                                 <a
//                                   href={news.downloadFile.url}
//                                   download={news.downloadFile.filename}
//                                   onClick={(e) => e.stopPropagation()}
//                                   className="flex items-center space-x-1 px-2 py-1 bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F] text-xs font-medium rounded-full hover:bg-[#1F4D7F] hover:text-white transition-colors duration-200"
//                                   title={`Download ${news.downloadFile.filename}`}
//                                 >
//                                   <Download className="w-3 h-3" />
//                                   <span>Download</span>
//                                 </a>
//                               )}
//                               <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#003884] transform group-hover:translate-x-1 transition-all duration-300" />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="text-center mt-8 md:mt-12">
//                 <button
//                   onClick={handleViewAllNews}
//                   className="px-6 py-3 md:px-8 md:py-3 bg-[#003884] text-white font-semibold rounded-lg hover:bg-[#00245c] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
//                 >
//                   View All News
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </section>

//       {/* News Modal */}
//       {selectedNews && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300"
//           onClick={() => setSelectedNews(null)}
//         >
//           <div
//             className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-in zoom-in-95 duration-300 mx-2"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-4 md:p-6">
//               <div className="flex items-start justify-between mb-4 md:mb-6">
//                 <div className="flex items-center space-x-2 md:space-x-3">
//                   <div className="p-2 md:p-3 bg-[#1F4D7F] bg-opacity-10 rounded-lg">
//                     {(() => {
//                       const IconComponent = getCategoryIcon(selectedNews.category);
//                       return <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-[#1F4D7F]" />;
//                     })()}
//                   </div>
//                   <div className="flex flex-wrap gap-1 md:gap-2">
//                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(selectedNews.category)}`}>
//                       {selectedNews.category}
//                     </span>
//                     {selectedNews.isUrgent && (
//                       <span className="px-2 py-1 bg-[#FFD100] text-[#003884] text-xs font-semibold rounded-full">
//                         <AlertTriangle className="w-3 h-3 inline mr-1" />
//                         Urgent
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedNews(null)}
//                   className="p-1 md:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//                 >
//                   <X className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
//                 </button>
//               </div>

//               <div className="space-y-3 md:space-y-4">
//                 <h2 className="text-xl md:text-2xl font-bold text-gray-900">
//                   {selectedNews.title}
//                 </h2>

//                 <div className="p-3 md:p-4 rounded-lg bg-[#1F4D7F] bg-opacity-5 border-l-4 border-[#003884]">
//                   <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
//                     {selectedNews.summary}
//                   </p>

//                   {selectedNews.content && selectedNews.content !== selectedNews.summary && (
//                     <div
//                       className="mt-3 md:mt-4 text-gray-600 leading-relaxed text-sm md:text-base"
//                       dangerouslySetInnerHTML={{ __html: selectedNews.content }}
//                     />
//                   )}
//                 </div>

//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 md:pt-6 border-t border-gray-200">
//                   <div>
//                     {selectedNews.downloadFile && (
//                       <a
//                         href={selectedNews.downloadFile.url}
//                         download={selectedNews.downloadFile.filename}
//                         className="flex items-center space-x-2 px-3 py-2 bg-[#003884] text-white font-semibold rounded-lg hover:bg-[#00245c] transition-colors duration-200 text-sm md:text-base"
//                       >
//                         <Download className="w-4 h-4" />
//                         <span>
//                           {selectedNews.id === "clinic-card"
//                             ? "Download Clinic Guide"
//                             : `Download ${selectedNews.downloadFile.type?.toUpperCase()}`
//                           }
//                         </span>
//                       </a>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => setSelectedNews(null)}
//                     className="px-4 py-2 bg-[#003884] text-white font-semibold rounded-lg hover:bg-[#00245c] transition-colors duration-200 text-sm md:text-base w-full sm:w-auto"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* All News View */}
//       {showAllNews && (
//         <div className="fixed inset-x-0 top-16 bottom-0 bg-white z-40 overflow-y-auto animate-in fade-in duration-300">
//           <div className="min-h-screen py-6 md:py-8">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in slide-in-from-bottom duration-500">
//               <div className="mb-6 md:mb-8 pt-4">
//                 <div className="flex items-center mb-4 md:mb-6">
//                   <button
//                     onClick={handleBackToHome}
//                     className="mr-4 md:mr-6 bg-[#003884] hover:bg-[#00245c] text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
//                     disabled={isExiting}
//                   >
//                     <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
//                   </button>
//                   <div className="flex-1 text-center">
//                     <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">All News & Updates</h1>
//                     <p className="text-sm md:text-lg text-gray-600">Complete list of Soshanguve Campus announcements and updates</p>
//                   </div>
//                 </div>
//               </div>

//               <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 ${isExiting ? 'animate-grid-exit' : 'animate-grid-entrance'}`}>
//                 {latestNews.map((news: NewsItem, index: number) => {
//                   const IconComponent = getCategoryIcon(news.category);

//                   return (
//                     <div
//                       key={`${news.id}-all-${index}`}
//                       className={`group bg-white rounded-xl transform transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer overflow-hidden shadow-lg hover:shadow-xl h-56 md:h-64 ${getPriorityStyle(news.priority)} ${isExiting ? 'animate-card-fly-out' : 'animate-card-fly-in'}`}
//                       onClick={() => !isExiting && setSelectedNews(news)}
//                     >
//                       <div className="p-4 md:p-6 h-full flex flex-col">
//                         <div className="flex items-start justify-between mb-3 md:mb-4">
//                           <div className="flex items-center space-x-2 md:space-x-3">
//                             <div className="p-2 md:p-3 bg-[#1F4D7F] bg-opacity-10 rounded-lg group-hover:bg-[#003884] transition-colors duration-300">
//                               <IconComponent className="w-5 h-5 md:w-8 md:h-8 text-[#1F4D7F] group-hover:text-white transition-colors duration-300" />
//                             </div>
//                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(news.category)}`}>
//                               {news.category}
//                             </span>
//                           </div>
//                           {news.isUrgent && (
//                             <div className="flex items-center space-x-1 px-2 py-1 bg-[#FFD100] text-[#003884] text-xs font-semibold rounded-full">
//                               <AlertTriangle className="w-3 h-3" />
//                               <span>Urgent</span>
//                             </div>
//                           )}
//                         </div>

//                         <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#003884] transition-colors duration-300 line-clamp-3">
//                           {news.title}
//                         </h3>

//                         <p className="text-sm text-gray-600 mb-3 md:mb-4 flex-grow line-clamp-2">
//                           {news.summary}
//                         </p>

//                         <div className="flex items-center justify-between mt-auto">
//                           <div className="flex items-center text-gray-500 text-xs">
//                             <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
//                             <span>{new Date(news.date).toLocaleDateString('en-ZA', {
//                               year: 'numeric',
//                               month: 'short',
//                               day: 'numeric'
//                             })}</span>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             {news.downloadFile && (
//                               <a
//                                 href={news.downloadFile.url}
//                                 download={news.downloadFile.filename}
//                                 onClick={(e) => e.stopPropagation()}
//                                 className="flex items-center space-x-1 px-2 py-1 bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F] text-xs font-medium rounded-full hover:bg-[#1F4D7F] hover:text-white transition-colors duration-200"
//                                 title={`Download ${news.downloadFile.filename}`}
//                               >
//                                 <Download className="w-3 h-3" />
//                                 <span className="hidden sm:inline">Download</span>
//                               </a>
//                             )}
//                             <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-[#003884] transform group-hover:translate-x-1 transition-all duration-300" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//           <Footer />
//         </div>
//       )}

//       {/* Academic Departments */}
//       <section ref={departmentsRef} className="py-12 md:py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12 md:mb-16">
//             <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Academic Departments</h2>
//             <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
//               Discover our specialized departments offering cutting-edge programs in technology and computing.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 justify-items-center">
//             {departments.map((department, index) => {
//               const IconComponent = getDepartmentIcon(department.id);
//               return (
//                 <div
//                   id={`department-${department.id}`}
//                   key={department.id}
//                   className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden w-full max-w-xs ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
//                   style={{ transitionDelay: `${index * 150}ms` }}
//                   onClick={() => onDepartmentClick(department)}
//                 >
//                   <div className="p-4 md:p-6">
//                     <div className="flex items-center justify-between mb-3 md:mb-4">
//                       <div className="p-2 md:p-3 rounded-lg transition-colors duration-300 bg-[#1F4D7F] bg-opacity-10">
//                         <IconComponent className="w-6 h-6 md:w-8 md:h-8 transition-colors duration-300 text-[#1F4D7F]" />
//                       </div>
//                       <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 transform group-hover:translate-x-1 transition-all duration-300 text-[#1F4D7F]" />
//                     </div>
//                     <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#003884] transition-colors duration-300">
//                       {department.name}
//                     </h3>
//                     <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">
//                       {department.description}
//                     </p>
//                     <div className="flex flex-wrap gap-1">
//                       {department.codes.slice(0, 3).map((code) => (
//                         <span key={code} className="px-2 py-1 bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F] text-xs rounded-full">
//                           {code}
//                         </span>
//                       ))}
//                       {department.codes.length > 3 && (
//                         <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//                           +{department.codes.length - 3} more
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Student Services */}
//       <section ref={servicesRef} className="py-12 md:py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12 md:mb-16">
//             <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Student Services</h2>
//             <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
//               Comprehensive support services to help you succeed throughout your academic journey.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
//             {filteredServices.map((service, index) => (
//               <div
//                 id={`service-${service.id}`}
//                 key={service.id}
//                 className={`group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 hover:shadow-xl transform transition-all duration-500 hover:scale-105 cursor-pointer border border-[#003884]/10 hover:border-[#003884]/40 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
//                 style={{ transitionDelay: `${index * 100}ms` }}
//                 onClick={() => onServiceClick(service)}
//               >
//                 <div className="flex items-start justify-between mb-3 md:mb-4">
//                   <div className="flex-1">
//                     <div className="flex items-center mb-2">
//                       <span className="px-2 py-1 bg-[#FFD100] text-[#003884] text-xs font-semibold rounded-full">
//                         {service.category}
//                       </span>
//                     </div>
//                     <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-[#003884] transition-colors duration-300">
//                       {service.title}
//                     </h3>
//                   </div>
//                   <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-[#003884] transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
//                 </div>
//                 <p className="text-gray-600 text-xs md:text-sm">
//                   {service.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {showCampusVideo && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[70] p-4"
//           onClick={() => setShowCampusVideo(false)}
//         >
//           <div
//             className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setShowCampusVideo(false)}
//               className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200"
//             >
//               <X className="w-4 h-4 md:w-6 md:h-6 text-black" />
//             </button>
//             <video
//               className="w-full h-auto"
//               controls
//               autoPlay
//             >
//               <source src="src/assets/Sosha.mp4" type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           </div>
//         </div>
//       )}

//       {/* Student Development and Support Section */}
//       <section className="relative py-16 md:py-24 bg-white overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16 md:mb-20">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-[#003884] rounded-3xl shadow-lg mb-6">
//               <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//               </svg>
//             </div>
//             <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#003884] mb-4 tracking-tight">
//               Student Development & Support
//             </h2>
//             <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//               Empowering your academic journey with comprehensive support services and personal development opportunities
//             </p>
//           </div>

//           {/* Main Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
//             {/* Left Column - Support Services */}
//             <div className="space-y-6">
//               {/* Main Support Card */}
//               <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 p-6 md:p-8">
//                 <div className="flex items-start justify-between mb-6">
//                   <h3 className="text-2xl md:text-3xl font-bold text-[#003884]">
//                     Your Support Network
//                   </h3>
//                   <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                     <svg className="w-6 h-6 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                     </svg>
//                   </div>
//                 </div>

//                 <p className="text-gray-600 mb-8 leading-relaxed text-lg">
//                   You might face challenges or personal barriers that could have a negative impact on your
//                   overall well-being and studies. At <strong className="font-semibold text-[#003884]">Student Development and Support</strong> we offer
//                   comprehensive services that equip you with skills to overcome challenges positively.
//                 </p>

//                 <div className="space-y-6">
//                   {/* Journey Support */}
//                   <div className="flex items-start space-x-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300">
//                     <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-200">
//                       <GraduationCap className="w-7 h-7 text-[#1F4D7F]" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 mb-2 text-lg">Academic Journey Support</h4>
//                       <p className="text-gray-600 leading-relaxed text-sm md:text-base">
//                         SDS supports you throughout your academic journey from orientation to graduation.
//                       </p>
//                     </div>
//                   </div>

//                   {/* Mentor Program */}
//                   <div className="flex items-start space-x-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-300">
//                     <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-green-200">
//                       <svg className="w-7 h-7 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 mb-2 text-lg">Mentor Training Programme</h4>
//                       <p className="text-gray-600 leading-relaxed text-sm md:text-base">
//                         We equip mentors for the vital role they play within the TUT family. Mentors are
//                         senior students who provide academic and emotional support to first-years.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Contact & Services */}
//             <div className="space-y-6">
//               {/* Contact Card */}
//               <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 p-6 md:p-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-2xl md:text-3xl font-bold text-[#003884]">
//                     Get In Touch
//                   </h3>
//                   <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                     <Phone className="w-6 h-6 text-[#1F4D7F]" />
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   {/* Location */}
//                   <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
//                     <div className="flex-shrink-0 w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
//                       <MapPin className="w-6 h-6 text-[#1F4D7F]" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 text-sm md:text-base">South Campus Office</h4>
//                       <p className="text-gray-600 text-sm">Building 5, 2nd Floor Room 215</p>
//                     </div>
//                   </div>

//                   {/* Email */}
//                   <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
//                     <div className="flex-shrink-0 w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
//                       <Mail className="w-6 h-6 text-[#1F4D7F]" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 text-sm md:text-base">Email Booking</h4>
//                       <p className="text-[#1F4D7F] text-sm font-medium break-all">counselling@tut.ac.za</p>
//                     </div>
//                   </div>

//                   {/* Phone */}
//                   <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
//                     <div className="flex-shrink-0 w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
//                       <Phone className="w-6 h-6 text-[#1F4D7F]" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 text-sm md:text-base">Telephonic Booking</h4>
//                       <p className="text-gray-600 text-sm">012 382 9863 / 012 382 9038</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Emergency Services Card */}
//               <div className="group bg-[#003884] rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-6 md:p-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-2xl md:text-3xl font-bold text-white">
//                     24/7 Support
//                   </h3>
//                   <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                     <AlertTriangle className="w-6 h-6 text-white" />
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   {/* SADAG */}
//                   <div className="flex items-center space-x-4 p-4 rounded-xl bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-15 transition-all duration-300">
//                     <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
//                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-white text-sm md:text-base">SADAG Counselling</h4>
//                       <p className="text-blue-100 text-sm font-medium">0800 687 888</p>
//                     </div>
//                   </div>

//                   {/* ER24 */}
//                   <div className="flex items-center space-x-4 p-4 rounded-xl bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-15 transition-all duration-300">
//                     <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
//                       <AlertTriangle className="w-5 h-5 text-white" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-white text-sm md:text-base">ER24 Emergency</h4>
//                       <p className="text-blue-100 text-sm font-medium">084 124</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Free Services Badge */}
//                 <div className="mt-6 p-4 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-20">
//                   <p className="text-white text-center text-sm md:text-base font-semibold">
//                     All services are <span className="text-[#FFD100]">FREE</span> for TUT students
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Life Skills Module Highlight */}
//           <div className="mt-12 md:mt-16 group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 p-6 md:p-8 max-w-4xl mx-auto">
//             <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
//               <div className="flex-shrink-0 w-20 h-20 bg-[#003884] rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                 <BookOpen className="w-10 h-10 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-2xl md:text-3xl font-bold text-[#003884] mb-3">
//                   Life Skills Module
//                 </h3>
//                 <p className="text-gray-600 mb-6 leading-relaxed text-lg">
//                   A compulsory first-year module facilitated in a highly interactive and blended way,
//                   addressing issues that most first-years struggle with like managing workload, making friends, and more.
//                 </p>
//                 <div className="flex flex-wrap gap-3">
//                   <span className="px-4 py-2 bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F] text-sm font-semibold rounded-full border border-[#1F4D7F] border-opacity-20">
//                     Compulsory First-year
//                   </span>
//                   <span className="px-4 py-2 bg-[#003884] bg-opacity-10 text-[#003884] text-sm font-semibold rounded-full border border-[#003884] border-opacity-20">
//                     Interactive Learning
//                   </span>
//                   <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full border border-green-200">
//                     Practical Skills
//                   </span>
//                   <span className="px-4 py-2 bg-[#FFD100] bg-opacity-20 text-[#003884] text-sm font-semibold rounded-full border border-[#FFD100] border-opacity-30">
//                     Blended Format
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* CTA Section */}
//           <div className="text-center mt-12 md:mt-16">
//             <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
//               <button className="group px-8 py-4 bg-[#003884] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:bg-[#00245c] transform hover:scale-105 transition-all duration-300 flex items-center space-x-3">
//                 <span>Get Support Today</span>
//                 <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                 </svg>
//               </button>
//               <button className="group px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl border border-gray-300 hover:border-[#003884] transform hover:scale-105 transition-all duration-300 flex items-center space-x-3">
//                 <span>Learn About Services</span>
//                 <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* SASO Office Card */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-20">
//         <div
//           id="department-bld18"
//           className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden flex flex-col items-center text-center"
//         >
//           <div className="w-full py-4 md:py-6 flex flex-col items-center bg-[#1F4D7F] bg-opacity-10">
//             <BookOpen className="w-8 h-8 md:w-10 md:h-10 mb-2 text-[#1F4D7F]" />
//             <h3 className="text-xl md:text-2xl font-bold text-gray-900 px-4">
//               SASO: Student Academic Support Office
//             </h3>
//             <p className="text-gray-600 font-medium text-sm md:text-base">Building 18 - Room 242</p>
//           </div>

//           <div className="p-4 md:p-6 w-full flex flex-col items-center">
//             <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 md:gap-4 text-gray-700 text-xs md:text-sm mb-3 md:mb-4">
//               <a
//                 href="https://sds.onlinewebshop.net/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-1 md:gap-2 hover:text-opacity-80 transition-colors duration-300 text-[#1F4D7F]"
//               >
//                 <Globe className="w-3 h-3 md:w-4 md:h-4" /> SASO Website
//               </a>
//               <span className="hidden sm:inline text-gray-400">|</span>
//               <span className="flex items-center gap-1 md:gap-2">
//                 <MapPin className="w-3 h-3 md:w-4 md:h-4 text-green-500" /> BLD 18-242
//               </span>
//               <span className="hidden sm:inline text-gray-400">|</span>
//               <span className="flex items-center gap-1 md:gap-2">
//                 <Mail className="w-3 h-3 md:w-4 md:h-4 text-red-500" /> general@tut.ac.za
//               </span>
//               <span className="hidden sm:inline text-gray-400">|</span>
//               <span className="flex items-center gap-1 md:gap-2">
//                 <Phone className="w-3 h-3 md:w-4 md:h-4 text-purple-500" /> 086 110 2421
//               </span>
//             </div>

//             <div className="w-full max-w-4xl">
//               <h4 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">Services Offered:</h4>
//               <div className="flex flex-wrap justify-center gap-2 text-gray-600 text-xs md:text-sm">
//                 <span
//                   onClick={() => {
//                     const service = services.find(s => s.id === 'Peer to Peer learning');
//                     if (service) onServiceClick(service);
//                   }}
//                   className="px-2 py-1 bg-gray-50 rounded-full flex items-center gap-1 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
//                 >
//                   <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-[#1F4D7F]" /> Peer Learning
//                 </span>
//                 <span
//                   onClick={() => {
//                     const service = services.find(s => s.id === 'Mentorship & Tutoring program');
//                     if (service) onServiceClick(service);
//                   }}
//                   className="px-2 py-1 bg-gray-50 rounded-full flex items-center gap-1 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
//                 >
//                   <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-[#1F4D7F]" /> Mentorship
//                 </span>
//                 <span
//                   onClick={() => {
//                     const service = services.find(s => s.id === 'Mentorship & Tutoring program');
//                     if (service) onServiceClick(service);
//                   }}
//                   className="px-2 py-1 bg-gray-50 rounded-full flex items-center gap-1 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
//                 >
//                   <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-[#1F4D7F]" /> Tutorship
//                 </span>
//                 <span
//                   onClick={() => {
//                     const service = services.find(s => s.id === 'Studython');
//                     if (service) onServiceClick(service);
//                   }}
//                   className="px-2 py-1 bg-gray-50 rounded-full flex items-center gap-1 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
//                 >
//                   <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-[#1F4D7F]" /> Studythons
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* End User Computing Section */}
//       <section className="py-16 md:py-24 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-[#003884] rounded-2xl shadow-lg mb-6">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <h2 className="text-4xl md:text-5xl font-bold text-[#003884] mb-4">
//               End User Computing
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Soshanguve South Campus - Comprehensive support for essential computing modules
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
//             {/* Left Column - Modules & Contact Info */}
//             <div className="space-y-8">
//               {/* Modules Card */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-2xl font-bold text-[#003884]">Supported Modules</h3>
//                   <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
//                     <BookOpen className="w-6 h-6 text-[#1F4D7F]" />
//                   </div>
//                 </div>
//                 <p className="text-gray-600 mb-6">
//                   Assists students in the following essential computing modules:
//                 </p>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                   {['CGA115D', 'CGB115D', 'CGBF15D', 'CPL115X', 'CPL115D', 'ATH115D'].map((module) => (
//                     <div
//                       key={module}
//                       className="bg-[#1F4D7F] bg-opacity-5 border border-[#1F4D7F] border-opacity-20 rounded-lg px-4 py-3 text-center hover:bg-[#1F4D7F] hover:bg-opacity-10 transition-colors duration-200"
//                     >
//                       <span className="text-[#1F4D7F] font-semibold text-sm">{module}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* EUC Contact Card */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-2xl font-bold text-[#003884]">EUC Contact</h3>
//                   <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
//                     <Mail className="w-6 h-6 text-[#1F4D7F]" />
//                   </div>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
//                     <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
//                       <svg className="w-5 h-5 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 text-sm md:text-base">Dr MM Swanepoel</h4>
//                       <p className="text-gray-600 text-sm">EUC Coordinator</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl">
//                     <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
//                       <Mail className="w-5 h-5 text-[#1F4D7F]" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 text-sm md:text-base">Email</h4>
//                       <a href="mailto:Swanepoelmm@tut.ac.za" className="text-[#1F4D7F] text-sm font-medium hover:underline break-all">
//                         Swanepoelmm@tut.ac.za
//                       </a>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl">
//                     <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
//                       <Phone className="w-5 h-5 text-[#1F4D7F]" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 text-sm md:text-base">Phone</h4>
//                       <p className="text-gray-600 text-sm">012 382 5857</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl">
//                     <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
//                       <MapPin className="w-5 h-5 text-[#1F4D7F]" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 text-sm md:text-base">Office</h4>
//                       <p className="text-gray-600 text-sm">12-201 Soshanguve South</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - HOD & Administration */}
//             <div className="space-y-8">
//               {/* HOD Card */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-2xl font-bold text-[#003884]">Head of Department</h3>
//                   <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
//                     <svg className="w-6 h-6 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   </div>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
//                     <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
//                       <svg className="w-5 h-5 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 text-sm md:text-base">Dr Kgasi</h4>
//                       <p className="text-gray-600 text-sm">Head of Department</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Administrator Card */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-2xl font-bold text-[#003884]">Administration</h3>
//                   <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
//                     <svg className="w-6 h-6 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </div>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
//                     <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
//                       <svg className="w-5 h-5 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 text-sm md:text-base">A.M Mokwena</h4>
//                       <p className="text-gray-600 text-sm">Administrator</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl">
//                     <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
//                       <Mail className="w-5 h-5 text-[#1F4D7F]" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 text-sm md:text-base">Email</h4>
//                       <a href="mailto:Mokwenaam@tut.ac.za" className="text-[#1F4D7F] text-sm font-medium hover:underline break-all">
//                         Mokwenaam@tut.ac.za
//                       </a>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl">
//                     <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
//                       <Phone className="w-5 h-5 text-[#1F4D7F]" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-gray-900 text-sm md:text-base">Office Phone</h4>
//                       <p className="text-gray-600 text-sm">012 382 9399</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Actions Card */}
//               <div className="bg-[#003884] rounded-2xl shadow-lg p-6 md:p-8 text-white">
//                 <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
//                 <p className="text-blue-100 mb-6">
//                   Get support with your End User Computing modules and academic requirements.
//                 </p>
//                 <div className="space-y-3">
//                   <button className="w-full bg-white text-[#003884] font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2">
//                     <Mail className="w-4 h-4" />
//                     <span>Email EUC Support</span>
//                   </button>
//                   <button className="w-full bg-[#1F4D7F] text-white font-semibold py-3 rounded-lg hover:bg-[#163c66] transition-colors duration-200 flex items-center justify-center space-x-2">
//                     <Phone className="w-4 h-4" />
//                     <span>Call Office</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />
//       <div>
//         <Chatbot />
//       </div>
//     </div>
//   );
// };

// export default HomePage;





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
  X, MapPin, Phone, Mail,
  Download,
  Users,
  Building,
  Filter
} from 'lucide-react';

import { Department, Service, NewsItem, RealDepartment } from '../types';
import Chatbot from './Chatbot';
import { useNavigate } from "react-router-dom";
import Footer from './Footer';

interface HomePageProps {
  departments: Department[];
  selectedFilter: "all" | "senior" | "newcomer";
  onDepartmentClick: (dept: Department) => void;
  onServiceClick: (service: Service) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  departments: hardcodedDepartments,
  selectedFilter,
  onDepartmentClick,
  onServiceClick
}) => {
  const [showAllNews, setShowAllNews] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [realDepartments, setRealDepartments] = useState<RealDepartment[]>([]);
  const [realServices, setRealServices] = useState<Service[]>([]); // New state for real services
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true); // New state for services loading
  const [departmentsError, setDepartmentsError] = useState('');
  const [servicesError, setServicesError] = useState(''); // New state for services error
  const [campusFilter, setCampusFilter] = useState<'soshanguve' | 'all'>('soshanguve');
  
  const navigate = useNavigate();
  const [showCampusVideo, setShowCampusVideo] = useState(false);

  const API_URL = 'http://localhost:4000/api';
  const SOSHANGUVE_CAMPUS_NAME = 'Soshanguve South Campus';
  
  // Campus identification patterns
  const SOSHANGUVE_CAMPUS_PATTERNS = [
    'soshanguve south campus',
    'soshanguve south', 
    'soshanguve',
    'sosh'
  ];

  // TUT Color Scheme from Logo
  const tutColors = {
    primary: {
      blue: '#003884',
      gold: '#FFD100',
      lightBlue: '#1F4D7F',
    },
    secondary: {
      white: '#FFFFFF',
      lightGray: '#F8FAFC',
      gray: '#6B7280',
      darkGray: '#374151'
    }
  };

  // Check if a campus name matches Soshanguve
  const isSoshanguveCampus = (campusName: string): boolean => {
    if (!campusName) return false;
    const lowerName = campusName.toLowerCase();
    return SOSHANGUVE_CAMPUS_PATTERNS.some(pattern => lowerName.includes(pattern));
  };

  // Fetch Real Services Data
  const fetchRealServices = async () => {
    try {
      setServicesLoading(true);
      setServicesError('');
      
      console.log('📡 Fetching real services data...');
      const response = await fetch(`${API_URL}/services/active/list`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}`);
      }
      
      const servicesData = await response.json();
      console.log(`✅ Successfully fetched ${servicesData.length} services`);
      
      // Transform API data to match your Service interface
      const transformedServices: Service[] = servicesData.map((service: any) => ({
        id: service.id?.toString() || Math.random().toString(),
        title: service.title || 'Unnamed Service',
        category: service.category || 'All Students',
        description: service.description || 'No description available',
        details: service.details || '',
        steps: service.steps || [],
        statusLink: service.statusLink || service.status_link || '',
        isActive: service.isActive !== undefined ? service.isActive : true
      }));
      
      setRealServices(transformedServices);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load services';
      setServicesError(errorMessage);
      console.error('❌ Error fetching services:', err);
    } finally {
      setServicesLoading(false);
    }
  };

  // Fetch Real Departments Data
  const fetchRealDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      setDepartmentsError('');
      
      console.log('📡 Fetching real departments data...');
      const response = await fetch(`${API_URL}/departments`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch departments: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log(`✅ Successfully fetched ${result.data.length} campus groups`);
        
        // Filter based on selected campus filter
        let filteredCampuses = result.data;
        
        if (campusFilter === 'soshanguve') {
          filteredCampuses = result.data.filter((campusGroup: any) => 
            isSoshanguveCampus(campusGroup.campusName)
          );
          
          console.log(`🎯 Found ${filteredCampuses.length} Soshanguve campus(es):`, 
            filteredCampuses.map((c: any) => c.campusName));
        }

        // Transform the filtered data
        const transformedData: RealDepartment[] = filteredCampuses.flatMap((campusGroup: any) => 
          campusGroup.departments?.map((dept: any) => ({
            id: dept.id?.toString() || Math.random().toString(),
            name: dept.name || 'Unnamed Department',
            department_code: dept.department_code || 'N/A',
            description: dept.description || 'No description available',
            building_number: dept.building_number || '',
            email: dept.email || '',
            contact_number: dept.contact_number || '',
            website_link: dept.website_link || '',
            is_active: dept.is_active !== undefined ? dept.is_active : true,
            campus_name: campusGroup.campusName || 'Unknown Campus',
            campus_id: campusGroup.campusId,
            programs: dept.programs || [],
            courses: dept.courses || [],
            lecturers: dept.lecturers || []
          })) || []
        );
        
        console.log(`🎯 Transformed ${transformedData.length} departments for ${campusFilter}:`, 
          transformedData.map(d => `${d.name} (${d.campus_name})`));
        
        setRealDepartments(transformedData);
      } else {
        throw new Error(result.error || 'Invalid API response format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load departments';
      setDepartmentsError(errorMessage);
      console.error('❌ Error fetching departments:', err);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // Fetch Soshanguve Campus News
  const fetchSoshanguveNews = async () => {
    setLoading(true);
    setApiError('');
    try {
      const response = await fetch(`${API_URL}/news`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const allNews = await response.json();
      
      // Filter for Soshanguve Campus only
      const soshanguveNews = allNews.filter(item => 
        item.campus_name === SOSHANGUVE_CAMPUS_NAME || 
        !item.campus_id // Include news that applies to all campuses
      ).filter(item => item.is_visible);
      
      // Sort by date (newest first) and take latest
      const sortedNews = soshanguveNews.sort((a, b) => 
        new Date(b.publish_date || b.created_at) - new Date(a.publish_date || a.created_at)
      );

      // Transform API data to match your NewsItem interface
      const transformedNews = sortedNews.map(item => ({
        id: item.news_id,
        title: item.title,
        category: item.category_name || 'Announcement',
        date: item.publish_date || item.created_at,
        summary: item.summary,
        content: item.content || item.summary,
        priority: item.priority || 'medium',
        isUrgent: item.is_urgent || false,
        downloadFile: item.attachment_url ? {
          url: item.attachment_url,
          filename: item.attachment_filename || 'download',
          type: 'file'
        } : undefined
      }));
      
      setLatestNews(transformedNews);
    } catch (err) {
      setApiError(err.message);
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllNews = () => {
    setShowAllNews(true);
  };

  const handleBackToHome = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowAllNews(false);
      setIsExiting(false);
    }, 700);
  };

  useEffect(() => {
    setIsLoaded(true);
    fetchSoshanguveNews();
    fetchRealDepartments();
    fetchRealServices(); // Fetch real services
  }, [campusFilter]); // Refetch when campus filter changes

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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [selectedNews, showAllNews]);

  // Refresh data when component becomes visible again
  useEffect(() => {
    if (!showAllNews && !selectedNews) {
      fetchSoshanguveNews();
    }
  }, [showAllNews, selectedNews]);

  const getDepartmentIcon = (department: RealDepartment) => {
    const code = department.department_code?.toLowerCase() || '';
    const name = department.name?.toLowerCase() || '';
    
    if (code.includes('cs') || name.includes('computer science')) return Monitor;
    if (code.includes('cse') || name.includes('computer systems')) return Cpu;
    if (code.includes('informatics') || name.includes('informatic')) return Database;
    if (code.includes('it') || name.includes('information technology')) return Globe;
    if (code.includes('fyf') || name.includes('first year') || name.includes('foundation')) return GraduationCap;
    return BookOpen;
  };

  const departmentsRef = React.useRef<HTMLDivElement>(null);
  const servicesRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shouldExpand = localStorage.getItem('expandServices');
    if (shouldExpand === 'true') {
      localStorage.removeItem('expandServices');
    }
  }, []);

  useEffect(() => {
    if (selectedFilter !== 'all') {
      handleScrollTo('services');
    }
  }, [selectedFilter]);

  const handleScrollTo = (section: 'departments' | 'services') => {
    if (section === 'departments' && departmentsRef.current) {
      departmentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (section === 'services' && servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Use real services or fall back to hardcoded
  const servicesToUse = realServices.length > 0 ? realServices : [];

  const filteredServices = selectedFilter === 'all'
    ? servicesToUse
    : servicesToUse.filter(service => {
      if (selectedFilter === 'senior') return service.category === 'Senior Students';
      if (selectedFilter === 'newcomer') return service.category === 'Newcomer Students';
      return true;
    });

  // Helper functions for news rendering
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
      case 'Registration': return `bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F]`;
      case 'Academic': return `bg-[#003884] bg-opacity-10 text-[#003884]`;
      case 'Announcement': return `bg-[#1F4D7F] bg-opacity-5 text-[#1F4D7F]`;
      case 'Deadline': return 'bg-red-100 text-red-800';
      case 'Event': return `bg-[#FFD100] bg-opacity-20 text-[#003884]`;
      case 'WIL': return 'bg-indigo-100 text-indigo-800';
      default: return `bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F]`;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-[#003884]';
      case 'medium': return 'border-l-4 border-[#1F4D7F]';
      case 'low': return 'border-l-4 border-blue-300';
      default: return 'border-l-4 border-[#1F4D7F]';
    }
  };

  const renderNewsCard = (news: NewsItem, index: number, isMobile: boolean = false) => {
    const IconComponent = getCategoryIcon(news.category);

    return (
      <div
        key={`${news.id}-${index}`}
        className={`group bg-white rounded-xl transform transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden ${
          isMobile ? 'w-full shadow-lg hover:shadow-xl' : 'flex-shrink-0 w-80 h-64 shadow-lg hover:shadow-2xl hover:shadow-[#003884]/20'
        } ${getPriorityStyle(news.priority)} ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        style={{ transitionDelay: `${index * 150}ms` }}
        onClick={() => setSelectedNews(news)}
      >
        <div className="p-4 md:p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="p-2 md:p-3 bg-[#1F4D7F] bg-opacity-10 rounded-lg group-hover:bg-[#003884] transition-colors duration-300">
                <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-[#1F4D7F] group-hover:text-white transition-colors duration-300" />
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(news.category)}`}>
                {news.category}
              </span>
            </div>
            {news.isUrgent && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-[#FFD100] text-[#003884] text-xs font-semibold rounded-full">
                <AlertTriangle className="w-3 h-3" />
                <span>Urgent</span>
              </div>
            )}
          </div>

          <h3 className={`font-semibold text-gray-900 mb-2 group-hover:text-[#003884] transition-colors duration-300 line-clamp-2 ${
            isMobile ? 'text-base' : 'text-lg'
          }`}>
            {news.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 md:mb-4 flex-grow line-clamp-2">
            {news.summary}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
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
                  className="flex items-center space-x-1 px-2 py-1 bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F] text-xs font-medium rounded-full hover:bg-[#1F4D7F] hover:text-white transition-colors duration-200"
                  title={`Download ${news.downloadFile.filename}`}
                >
                  <Download className="w-3 h-3" />
                  <span className={isMobile ? 'hidden sm:inline' : ''}>Download</span>
                </a>
              )}
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-[#003884] transform group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ✅ FIXED: Handle department click with React Router navigation
  const handleRealDepartmentClick = (department: RealDepartment) => {
    console.log('🎯 Clicked department:', department);
    
    // Store the department data in localStorage for department details to access
    localStorage.setItem('selectedDepartment', JSON.stringify(department));
    
    // ✅ FIX: Use navigate() instead of window.location.href
    // Determine which route to use based on campus
    const isPolokwane = department.campus_name?.toLowerCase().includes('polokwane');
    const route = isPolokwane ? `/polHome/departments/${department.id}` : `/departments/${department.id}`;
    
    navigate(route, {
      state: { 
        department, 
        fromHomepage: true 
      }
    });
  };

  // Handle service click
  const handleServiceClick = (service: Service) => {
    // Store service data and navigate to service details
    localStorage.setItem('selectedService', JSON.stringify(service));
    navigate(`/services/${service.id}`, {
      state: { service, fromHomepage: true }
    });
  };

  return (
    <div className="min-h-screen">
      {/* Debug Panel - UPDATED */}
      <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 p-4 rounded-lg shadow-lg max-w-xs">
        <h3 className="font-bold text-sm mb-2">API Data Debug</h3>
        <div className="text-xs space-y-1">
          <p>Departments: {realDepartments.length}</p>
          <p>Services: {realServices.length}</p>
          <p>Dept Error: {departmentsError || 'None'}</p>
          <p>Services Error: {servicesError || 'None'}</p>
          <div className="flex flex-wrap gap-1">
            <button 
              onClick={() => console.log('🔍 Real Services:', realServices)}
              className="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Log Services
            </button>
            <button 
              onClick={fetchRealServices}
              className="mt-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
            >
              Refresh Services
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-r from-[#003884] via-[#1F4D7F] to-[#003884]"
        style={{
          backgroundImage: `url(src/assets/sosh_south.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className={`text-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-[#FFD100] rounded-full shadow-lg">
                <GraduationCap className="w-16 h-16 text-[#003884]" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              FoICT (Soshanguve South Campus)
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Your comprehensive guide to academic departments, student services, and essential information
              for the Faculty of Information and Communication Technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleScrollTo('departments')}
                className="px-8 py-4 bg-[#FFD100] text-[#003884] font-semibold rounded-lg hover:bg-[#E6BC00] transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Explore Departments
              </button>
              <button
                onClick={() => handleScrollTo('services')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#003884] transform hover:scale-105 transition-all duration-300"
              >
                Student Services
              </button>
              <button
                onClick={() => navigate('/campus-videos')}
                className="px-8 py-4 bg-white text-[#003884] font-semibold rounded-lg hover:bg-[#FFD100] hover:text-[#003884] border-2 border-transparent transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Explore Our Campus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="relative py-12 md:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Latest News & Updates
              {loading && (
                <span className="ml-2 text-sm text-blue-600 font-normal">Loading...</span>
              )}
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Stay informed with the latest announcements and updates from Soshanguve South Campus
            </p>
            {apiError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm max-w-2xl mx-auto">
                Error loading news: {apiError}
              </div>
            )}
          </div>

          {loading && latestNews.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003884] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading campus news...</p>
            </div>
          ) : latestNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No news available for Soshanguve Campus at the moment.</p>
            </div>
          ) : (
            <>
              {/* Mobile: Vertical Scroll */}
              <div className="lg:hidden space-y-4">
                {latestNews.slice(0, 3).map((news: NewsItem, index: number) => 
                  renderNewsCard(news, index, true)
                )}
              </div>

              {/* Desktop Horizontal Scroll */}
              <div className="hidden lg:block relative overflow-hidden">
                <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white via-blue-50/50 to-transparent z-20 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white via-blue-50/50 to-transparent z-20 pointer-events-none"></div>

                <div className="flex animate-scroll space-x-6 pb-4 hover:animation-play-state-paused">
                  {latestNews.map((news: NewsItem, index: number) => {
                    const IconComponent = getCategoryIcon(news.category);
                    
                    return (
                      <div
                        key={`${news.id}-${index}`}
                        className={`group bg-white rounded-xl transform transition-all duration-500 hover:scale-125 hover:z-20 cursor-pointer overflow-hidden flex-shrink-0 w-80 h-64 shadow-lg hover:shadow-2xl hover:shadow-[#003884]/20 ${getPriorityStyle(news.priority)} ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                        onClick={() => setSelectedNews(news)}
                      >
                        <div className="p-6 h-full flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-[#1F4D7F] bg-opacity-10 rounded-lg group-hover:bg-[#003884] transition-colors duration-300">
                                <IconComponent className="w-5 h-5 text-[#1F4D7F] group-hover:text-white transition-colors duration-300" />
                              </div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(news.category)}`}>
                                {news.category}
                              </span>
                            </div>
                            {news.isUrgent && (
                              <div className="flex items-center space-x-1 px-2 py-1 bg-[#FFD100] text-[#003884] text-xs font-semibold rounded-full">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Urgent</span>
                              </div>
                            )}
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#003884] transition-colors duration-300 line-clamp-2">
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
                                  className="flex items-center space-x-1 px-2 py-1 bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F] text-xs font-medium rounded-full hover:bg-[#1F4D7F] hover:text-white transition-colors duration-200"
                                  title={`Download ${news.downloadFile.filename}`}
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Download</span>
                                </a>
                              )}
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#003884] transform group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center mt-8 md:mt-12">
                <button
                  onClick={handleViewAllNews}
                  className="px-6 py-3 md:px-8 md:py-3 bg-[#003884] text-white font-semibold rounded-lg hover:bg-[#00245c] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  View All News
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Academic Departments */}
      <section ref={departmentsRef} className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="text-left mb-4 md:mb-0">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Academic Departments</h2>
                <p className="text-base md:text-lg text-gray-600">
                  Discover specialized departments at <span className="font-semibold text-[#003884]">Soshanguve South Campus</span>
                </p>
              </div>
              
              {/* Campus Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Campus:</span>
                <div className="inline-flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setCampusFilter('soshanguve')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${campusFilter === 'soshanguve' 
                      ? 'bg-[#003884] text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Soshanguve Only
                  </button>
                  <button
                    onClick={() => setCampusFilter('all')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${campusFilter === 'all' 
                      ? 'bg-[#003884] text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    All Campuses
                  </button>
                </div>
              </div>
            </div>
            
            {/* Status Info */}
            <div className="space-y-4">
              {departmentsError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm max-w-2xl mx-auto">
                  Error loading departments: {departmentsError}
                  <button
                    onClick={fetchRealDepartments}
                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {!departmentsLoading && !departmentsError && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    <span>✅ Loaded {realDepartments.length} departments</span>
                    {campusFilter === 'soshanguve' && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-green-200 rounded-full text-xs font-medium">
                        🎯 Soshanguve Only
                      </span>
                    )}
                  </div>
                  {campusFilter === 'soshanguve' && realDepartments.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Showing departments from: {Array.from(new Set(realDepartments.map(d => d.campus_name))).join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {departmentsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003884]"></div>
              <span className="ml-4 text-gray-600">
                Loading {campusFilter === 'soshanguve' ? 'Soshanguve' : ''} departments...
              </span>
            </div>
          ) : departmentsError ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Departments</h3>
              <p className="text-gray-500 mb-4">{departmentsError}</p>
              <button
                onClick={fetchRealDepartments}
                className="px-6 py-2 bg-[#003884] text-white rounded-lg hover:bg-[#00245c] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : realDepartments.length > 0 ? (
            <>
              {/* Department Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center">
                {realDepartments.map((department, index) => {
                  const IconComponent = getDepartmentIcon(department);
                  const isActive = department.is_active;
                  const isSoshanguve = isSoshanguveCampus(department.campus_name);
                  
                  return (
                    <div
                      id={`department-${department.id}`}
                      key={department.id}
                      className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden w-full max-w-xs border-2 ${
                        isSoshanguve ? 'border-green-500' : 'border-blue-500'
                      } ${!isActive ? 'opacity-70' : ''}`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                      onClick={() => handleRealDepartmentClick(department)}
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                          <div className={`p-2 md:p-3 rounded-lg transition-colors duration-300 ${
                            isActive ? 'bg-[#1F4D7F] bg-opacity-10' : 'bg-gray-200'
                          }`}>
                            <IconComponent className={`w-6 h-6 md:w-8 md:h-8 transition-colors duration-300 ${
                              isActive ? 'text-[#1F4D7F]' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex items-center gap-2">
                            {!isActive && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                Inactive
                              </span>
                            )}
                            <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-all duration-300 ${
                              isActive ? 'text-gray-400 group-hover:text-[#003884]' : 'text-gray-300'
                            }`} />
                          </div>
                        </div>
                        
                        <h3 className={`text-lg md:text-xl font-semibold mb-2 group-hover:text-[#003884] transition-colors duration-300 ${
                          !isActive ? 'text-gray-500' : 'text-gray-900'
                        }`}>
                          {department.name}
                        </h3>
                        
                        <p className={`mb-3 md:mb-4 text-xs md:text-sm line-clamp-2 ${
                          !isActive ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {department.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {/* Department Code */}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            isActive 
                              ? 'bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F]' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {department.department_code}
                          </span>
                          
                          {/* Campus Badge */}
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            isSoshanguve
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}>
                            {isSoshanguve ? '🎯 Soshanguve' : department.campus_name}
                          </span>
                          
                          {/* Programs Count */}
                          {department.programs.length > 0 && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              isActive 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {department.programs.length} program{department.programs.length !== 1 ? 's' : ''}
                            </span>
                          )}
                          
                          {/* Courses Count */}
                          {department.courses.length > 0 && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {department.courses.length} course{department.courses.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        
                        {/* Additional Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {department.lecturers.length} lecturer{department.lecturers.length !== 1 ? 's' : ''}
                          </span>
                          {department.building_number && (
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              Bld {department.building_number}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Empty State for Filter */}
              {campusFilter === 'soshanguve' && realDepartments.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Soshanguve Departments Found</h3>
                  <p className="text-gray-500 mb-4">
                    No departments are currently available for Soshanguve campus.
                  </p>
                  <button
                    onClick={() => setCampusFilter('all')}
                    className="px-6 py-2 bg-[#003884] text-white rounded-lg hover:bg-[#00245c] transition-colors"
                  >
                    Show All Campuses
                  </button>
                </div>
              )}
            </>
          ) : (
            // Fallback to hardcoded data
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <span>⚠️ No departments found. Showing sample data for Soshanguve.</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 justify-items-center">
                {hardcodedDepartments.map((department, index) => {
                  const IconComponent = getDepartmentIcon({ department_code: department.id } as RealDepartment);
                  return (
                    <div
                      id={`department-${department.id}`}
                      key={department.id}
                      className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden w-full max-w-xs border-2 border-green-500 ${
                        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                      onClick={() => {
                        // ✅ FIX: Use navigate() for hardcoded departments too
                        localStorage.setItem('selectedDepartment', JSON.stringify(department));
                        navigate(`/departments/${department.id}`, {
                          state: { 
                            department, 
                            fromHomepage: true 
                          }
                        });
                      }}
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                          <div className="p-2 md:p-3 rounded-lg transition-colors duration-300 bg-[#1F4D7F] bg-opacity-10">
                            <IconComponent className="w-6 h-6 md:w-8 md:h-8 transition-colors duration-300 text-[#1F4D7F]" />
                          </div>
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 transform group-hover:translate-x-1 transition-all duration-300 text-[#1F4D7F]" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#003884] transition-colors duration-300">
                          {department.name}
                        </h3>
                        <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">
                          {department.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            🎯 Soshanguve
                          </span>
                          {department.codes.slice(0, 2).map((code) => (
                            <span key={code} className="px-2 py-1 bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F] text-xs rounded-full">
                              {code}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Student Services - UPDATED WITH REAL DATA */}
      <section ref={servicesRef} className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Student Services</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Comprehensive support services to help you succeed throughout your academic journey.
            </p>
            
            {/* Services Status */}
            <div className="mt-4">
              {servicesLoading ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <span>Loading services...</span>
                </div>
              ) : servicesError ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  <span>Error loading services: {servicesError}</span>
                  <button
                    onClick={fetchRealServices}
                    className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : realServices.length === 0 ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <span>⚠️ No services found. Check API connection.</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <span>✅ Loaded {realServices.length} services</span>
                </div>
              )}
            </div>
          </div>

          {servicesLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003884]"></div>
              <span className="ml-4 text-gray-600">Loading services...</span>
            </div>
          ) : servicesError ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Services</h3>
              <p className="text-gray-500 mb-4">{servicesError}</p>
              <button
                onClick={fetchRealServices}
                className="px-6 py-2 bg-[#003884] text-white rounded-lg hover:bg-[#00245c] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Found</h3>
              <p className="text-gray-500 mb-4">
                {selectedFilter === 'all' 
                  ? 'No services are currently available.' 
                  : `No services found for ${selectedFilter} students.`}
              </p>
              {selectedFilter !== 'all' && (
                <button
                  onClick={() => window.location.reload()} // You might want to handle this differently
                  className="px-6 py-2 bg-[#003884] text-white rounded-lg hover:bg-[#00245c] transition-colors"
                >
                  Show All Services
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {filteredServices.map((service, index) => (
                <div
                  id={`service-${service.id}`}
                  key={service.id}
                  className={`group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 hover:shadow-xl transform transition-all duration-500 hover:scale-105 cursor-pointer border border-[#003884]/10 hover:border-[#003884]/40 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="px-2 py-1 bg-[#FFD100] text-[#003884] text-xs font-semibold rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-[#003884] transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-[#003884] transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {service.description}
                  </p>
                  {service.steps && service.steps.length > 0 && (
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <BookOpen className="w-3 h-3 mr-1" />
                      <span>{service.steps.length} step{service.steps.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rest of your components remain the same */}
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
              className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 bg-white rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <X className="w-4 h-4 md:w-6 md:h-6 text-black" />
            </button>
            <video
              className="w-full h-auto"
              controls
              autoPlay
            >
              <source src="src/assets/Sosha.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* Student Development and Support Section */}
      <section className="relative py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#003884] rounded-3xl shadow-lg mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#003884] mb-4 tracking-tight">
              Student Development & Support
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Empowering your academic journey with comprehensive support services and personal development opportunities
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Left Column - Support Services */}
            <div className="space-y-6">
              {/* Main Support Card */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#003884]">
                    Your Support Network
                  </h3>
                  <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  You might face challenges or personal barriers that could have a negative impact on your
                  overall well-being and studies. At <strong className="font-semibold text-[#003884]">Student Development and Support</strong> we offer
                  comprehensive services that equip you with skills to overcome challenges positively.
                </p>

                <div className="space-y-6">
                  {/* Journey Support */}
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300">
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-200">
                      <GraduationCap className="w-7 h-7 text-[#1F4D7F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">Academic Journey Support</h4>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        SDS supports you throughout your academic journey from orientation to graduation.
                      </p>
                    </div>
                  </div>

                  {/* Mentor Program */}
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-300">
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-green-200">
                      <svg className="w-7 h-7 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">Mentor Training Programme</h4>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        We equip mentors for the vital role they play within the TUT family. Mentors are
                        senior students who provide academic and emotional support to first-years.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Services */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#003884]">
                    Get In Touch
                  </h3>
                  <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-[#1F4D7F]" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Location */}
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#1F4D7F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">South Campus Office</h4>
                      <p className="text-gray-600 text-sm">Building 5, 2nd Floor Room 215</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#1F4D7F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Email Booking</h4>
                      <p className="text-[#1F4D7F] text-sm font-medium break-all">counselling@tut.ac.za</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-[#1F4D7F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Telephonic Booking</h4>
                      <p className="text-gray-600 text-sm">012 382 9863 / 012 382 9038</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Services Card */}
              <div className="group bg-[#003884] rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    24/7 Support
                  </h3>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* SADAG */}
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-15 transition-all duration-300">
                    <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm md:text-base">SADAG Counselling</h4>
                      <p className="text-blue-100 text-sm font-medium">0800 687 888</p>
                    </div>
                  </div>

                  {/* ER24 */}
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-15 transition-all duration-300">
                    <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm md:text-base">ER24 Emergency</h4>
                      <p className="text-blue-100 text-sm font-medium">084 124</p>
                    </div>
                  </div>
                </div>

                {/* Free Services Badge */}
                <div className="mt-6 p-4 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-20">
                  <p className="text-white text-center text-sm md:text-base font-semibold">
                    All services are <span className="text-[#FFD100]">FREE</span> for TUT students
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Life Skills Module Highlight */}
          <div className="mt-12 md:mt-16 group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 p-6 md:p-8 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="flex-shrink-0 w-20 h-20 bg-[#003884] rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl md:text-3xl font-bold text-[#003884] mb-3">
                  Life Skills Module
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  A compulsory first-year module facilitated in a highly interactive and blended way,
                  addressing issues that most first-years struggle with like managing workload, making friends, and more.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-[#1F4D7F] bg-opacity-10 text-[#1F4D7F] text-sm font-semibold rounded-full border border-[#1F4D7F] border-opacity-20">
                    Compulsory First-year
                  </span>
                  <span className="px-4 py-2 bg-[#003884] bg-opacity-10 text-[#003884] text-sm font-semibold rounded-full border border-[#003884] border-opacity-20">
                    Interactive Learning
                  </span>
                  <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full border border-green-200">
                    Practical Skills
                  </span>
                  <span className="px-4 py-2 bg-[#FFD100] bg-opacity-20 text-[#003884] text-sm font-semibold rounded-full border border-[#FFD100] border-opacity-30">
                    Blended Format
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12 md:mt-16">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
              <button className="group px-8 py-4 bg-[#003884] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:bg-[#00245c] transform hover:scale-105 transition-all duration-300 flex items-center space-x-3">
                <span>Get Support Today</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="group px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl border border-gray-300 hover:border-[#003884] transform hover:scale-105 transition-all duration-300 flex items-center space-x-3">
                <span>Learn About Services</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SASO Office Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-20">
        <div
          id="department-bld18"
          className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden flex flex-col items-center text-center"
        >
          <div className="w-full py-4 md:py-6 flex flex-col items-center bg-[#1F4D7F] bg-opacity-10">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 mb-2 text-[#1F4D7F]" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 px-4">
              SASO: Student Academic Support Office
            </h3>
            <p className="text-gray-600 font-medium text-sm md:text-base">Building 18 - Room 242</p>
          </div>

          <div className="p-4 md:p-6 w-full flex flex-col items-center">
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 md:gap-4 text-gray-700 text-xs md:text-sm mb-3 md:mb-4">
              <a
                href="https://sds.onlinewebshop.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 md:gap-2 hover:text-opacity-80 transition-colors duration-300 text-[#1F4D7F]"
              >
                <Globe className="w-3 h-3 md:w-4 md:h-4" /> SASO Website
              </a>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="flex items-center gap-1 md:gap-2">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-green-500" /> BLD 18-242
              </span>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="flex items-center gap-1 md:gap-2">
                <Mail className="w-3 h-3 md:w-4 md:h-4 text-red-500" /> general@tut.ac.za
              </span>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="flex items-center gap-1 md:gap-2">
                <Phone className="w-3 h-3 md:w-4 md:h-4 text-purple-500" /> 086 110 2421
              </span>
            </div>

            <div className="w-full max-w-4xl">
              <h4 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">Services Offered:</h4>
              <div className="flex flex-wrap justify-center gap-2 text-gray-600 text-xs md:text-sm">
                <span
                  onClick={() => {
                    const service = services.find(s => s.id === 'Peer to Peer learning');
                    if (service) onServiceClick(service);
                  }}
                  className="px-2 py-1 bg-gray-50 rounded-full flex items-center gap-1 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
                >
                  <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-[#1F4D7F]" /> Peer Learning
                </span>
                <span
                  onClick={() => {
                    const service = services.find(s => s.id === 'Mentorship & Tutoring program');
                    if (service) onServiceClick(service);
                  }}
                  className="px-2 py-1 bg-gray-50 rounded-full flex items-center gap-1 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
                >
                  <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-[#1F4D7F]" /> Mentorship
                </span>
                <span
                  onClick={() => {
                    const service = services.find(s => s.id === 'Mentorship & Tutoring program');
                    if (service) onServiceClick(service);
                  }}
                  className="px-2 py-1 bg-gray-50 rounded-full flex items-center gap-1 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
                >
                  <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-[#1F4D7F]" /> Tutorship
                </span>
                <span
                  onClick={() => {
                    const service = services.find(s => s.id === 'Studython');
                    if (service) onServiceClick(service);
                  }}
                  className="px-2 py-1 bg-gray-50 rounded-full flex items-center gap-1 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
                >
                  <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-[#1F4D7F]" /> Studythons
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* End User Computing Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#003884] rounded-2xl shadow-lg mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#003884] mb-4">
              End User Computing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Soshanguve South Campus - Comprehensive support for essential computing modules
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Modules & Contact Info */}
            <div className="space-y-8">
              {/* Modules Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#003884]">Supported Modules</h3>
                  <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#1F4D7F]" />
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Assists students in the following essential computing modules:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['CGA115D', 'CGB115D', 'CGBF15D', 'CPL115X', 'CPL115D', 'ATH115D'].map((module) => (
                    <div
                      key={module}
                      className="bg-[#1F4D7F] bg-opacity-5 border border-[#1F4D7F] border-opacity-20 rounded-lg px-4 py-3 text-center hover:bg-[#1F4D7F] hover:bg-opacity-10 transition-colors duration-200"
                    >
                      <span className="text-[#1F4D7F] font-semibold text-sm">{module}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* EUC Contact Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#003884]">EUC Contact</h3>
                  <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#1F4D7F]" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Dr MM Swanepoel</h4>
                      <p className="text-gray-600 text-sm">EUC Coordinator</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#1F4D7F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Email</h4>
                      <a href="mailto:Swanepoelmm@tut.ac.za" className="text-[#1F4D7F] text-sm font-medium hover:underline break-all">
                        Swanepoelmm@tut.ac.za
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#1F4D7F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Phone</h4>
                      <p className="text-gray-600 text-sm">012 382 5857</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#1F4D7F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Office</h4>
                      <p className="text-gray-600 text-sm">12-201 Soshanguve South</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - HOD & Administration */}
            <div className="space-y-8">
              {/* HOD Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#003884]">Head of Department</h3>
                  <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Dr Kgasi</h4>
                      <p className="text-gray-600 text-sm">Head of Department</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrator Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#003884]">Administration</h3>
                  <div className="w-12 h-12 bg-[#1F4D7F] bg-opacity-10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#1F4D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">A.M Mokwena</h4>
                      <p className="text-gray-600 text-sm">Administrator</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#1F4D7F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Email</h4>
                      <a href="mailto:Mokwenaam@tut.ac.za" className="text-[#1F4D7F] text-sm font-medium hover:underline break-all">
                        Mokwenaam@tut.ac.za
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#1F4D7F] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#1F4D7F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Office Phone</h4>
                      <p className="text-gray-600 text-sm">012 382 9399</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-[#003884] rounded-2xl shadow-lg p-6 md:p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
                <p className="text-blue-100 mb-6">
                  Get support with your End User Computing modules and academic requirements.
                </p>
                <div className="space-y-3">
                  <button className="w-full bg-white text-[#003884] font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email EUC Support</span>
                  </button>
                  <button className="w-full bg-[#1F4D7F] text-white font-semibold py-3 rounded-lg hover:bg-[#163c66] transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Call Office</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <div>
        <Chatbot />
      </div>
    </div>
  );
};

export default HomePage;