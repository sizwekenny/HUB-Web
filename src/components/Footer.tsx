import React from 'react';
import { Globe, Monitor, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
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
      url: 'https://maps.app.goo.gl/AxX3briwfHFjXuAL6',
      icon: <MapPin className="w-4 h-4" />,
    },
  ];

  return (
    <footer className="relative overflow-hidden text-center md:text-left py-12 bg-blue-600 text-white mt-16" style={{marginTop:'0px'}}>
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full opacity-10 animate-ping"></div>
      <div className="absolute top-32 right-32 w-10 h-10 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-32 left-32 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-10 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <p className="text-sm">Tel: <a href="tel:+27861102421" className="hover:text-yellow-500">086 110 2421</a></p>
            <p className="text-sm">
              Email:{' '}
              <a href="mailto:general@tut.ac.za" className="hover:text-yellow-500">
                admission@tut.ac.za
              </a>
            </p>

            <h6 className="text-md font-semibold mt-4 mb-1">Ethics Hotline</h6>
            <p className="text-sm">Toll-Free: <a href="tel:+27800006924" className="hover:text-yellow-500">0800 006 924</a></p>
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
  );
};

export default Footer;
