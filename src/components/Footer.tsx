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
      url: 'https://www.google.com/maps/place/TUT/',
      icon: <MapPin className="w-4 h-4" />,
    },
  ];

  return (
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
              <a href="mailto:admission@tut.ac.za" className="hover:text-yellow-500">
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
  );
};

export default Footer;
