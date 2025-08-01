import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  ChevronRight,
  Monitor,
  Database,
  Cpu,
  Globe,
  Mail,
  MapPin
} from 'lucide-react';
import { Department, Service } from '../types';
import soshImg from '../assets/sosh.jpg';
import mainImg from '../assets/MainT.jpg';
import ruthImg from '../assets/ruth.jpg';
import emalImg from '../assets/emal.jpg';

interface HomePageProps {
  departments: Department[];
  services: Service[];
  onDepartmentClick: (department: Department) => void;
  onServiceClick: (service: Service) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  departments,
  services,
  onDepartmentClick,
  onServiceClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getDepartmentIcon = (departmentId: string) => {
    switch (departmentId) {
      case 'cs': return Monitor;
      case 'cse': return Cpu;
      case 'informatics': return Database;
      case 'it': return Globe;
      default: return BookOpen;
    }
  };

  // Updated quickLinks with Student Portal replacing Phone
  const quickLinks = [
    {
      name: 'TUT Website',
      url: 'https://www.tut.ac.za/',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      name: 'Student Portal',
      url: 'https://ienabler.tut.ac.za/pls/prodi41/w99pkg.mi_login',
      icon: <Monitor className="w-4 h-4" />,
    },
    {
      name: 'Contact Us',
      url: 'mailto:general@tut.ac.za',
      icon: <Mail className="w-4 h-4" />,
    },
    {
      name: 'Location',
      url: 'https://www.google.com/maps/place/TUT/',
      icon: <MapPin className="w-4 h-4" />,
    },
  ];

  const featuredServices = services.slice(0, 6);
  const departmentsRef = React.useRef<HTMLDivElement>(null);
  const servicesRef = React.useRef<HTMLDivElement>(null);
  const [showAllServices, setShowAllServices] = useState(false);

  useEffect(() => {
    const shouldExpand = localStorage.getItem('expandServices');
    if (shouldExpand === 'true') {
      setShowAllServices(true);
      localStorage.removeItem('expandServices');
    }
  }, []);

  const handleScrollTo = (section: 'departments' | 'services') => {
    setExpandedSection(section);
    if (section === 'departments' && departmentsRef.current) {
      departmentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (section === 'services' && servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'senior' | 'newcomer'>('all');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className={`text-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-yellow-400 rounded-full shadow-lg">
                <GraduationCap className="w-16 h-16 text-blue-900" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              ICT Faculty
              <span className="block text-yellow-400">Information Hub</span>
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

      {/* Gallery Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover TUT at a Glance</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our Campuse in the Meanwhile
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-8">
          {[
            { src: soshImg, alt: 'Soshanguve Campus', section: 'departments' },
            { src: mainImg, alt: 'Main Campus', section: 'departments' },
            { src: ruthImg, alt: 'Ruth First Building', section: 'services' },
            { src: emalImg, alt: 'Emalahleni Campus', section: 'services' },
          ].map(({ src, alt, section }, i) => (
            <img
              key={i}
              src={src}
              alt={alt}
              onClick={() => handleScrollTo(section as 'departments' | 'services')}
              className="cursor-pointer w-[400px] h-[400px] object-cover rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500"
            />
          ))}
        </div>
      </section>

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
            {services.map((service, index) => (
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
      <footer className="text-center md:text-left py-12 bg-white text-black mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <p className="mb-6 text-center">
            © {new Date().getFullYear()} Tshwane University of Technology. All rights reserved.
          </p>

          <h4 className="mb-4 text-center text-xl font-semibold">Quick Links</h4>
          <hr className="border-gray-300 mb-6" />

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {quickLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-black hover:text-yellow-500 transition-colors"
              >
                {link.icon} {link.name}
              </a>
            ))}
          </div>

          <hr className="border-gray-300 mb-6" />

          {/* About TUT and Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h5 className="text-lg font-semibold mb-3">About TUT</h5>
              <ul className="space-y-2 text-sm">
                {[
                  ['Council', 'https://www.tut.ac.za/council'],
                  ['Executive Management Committee', 'https://www.tut.ac.za/executive-management-committee'],
                  ['Executive Deans', 'https://www.tut.ac.za/executive-deans'],
                  ['Campus Rectors', 'https://www.tut.ac.za/campus-rectors'],
                  ['Vacancies', 'https://www.tut.ac.za/vacancies/list/1'],
                  ['Tenders', 'https://www.tut.ac.za/tender'],
                  ['Research, Innovation & Engagement', 'https://www.tut.ac.za/research-innovation-engagement'],
                ].map(([name, url]) => (
                  <li key={name}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-3">Contact</h5>
              <p className="text-sm">Tel: 086 110 2421</p>
              <p className="text-sm">
                Email:{' '}
                <a href="mailto:general@tut.ac.za" className="hover:text-yellow-500">
                  admission@tut.ac.za
                </a>
              </p>

              <h6 className="text-md font-semibold mt-4 mb-1">Ethics Hotline</h6>
              <p className="text-sm">Toll-Free: 0800 006 924</p>
              <p className="text-sm">
                Email:{' '}
                <a href="mailto:reportit@ethicshelpdesk.com" className="hover:text-yellow-500">
                  reportit@ethicshelpdesk.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
