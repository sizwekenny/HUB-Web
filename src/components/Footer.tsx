import React from 'react';
import { Globe, Monitor, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Calendar, Youtube, } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';  

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

  const socialLinks = [
    { name: 'Facebook', url: 'https://www.facebook.com/p/Faculty-of-ICT-Tshwane-University-of-Technology-61556755880834/', icon: <Facebook className="w-5 h-5" /> },
    { name: 'Linkedin', url: 'https://www.linkedin.com/in/FacultyofICT_TUT', icon: <Linkedin className="w-5 h-5" /> },
    { name: 'Instagram', url: 'https://www.instagram.com/FacultyofICT_TUT/#', icon: <Instagram className="w-5 h-5" /> },
    // { name: 'TikTok', url: 'https://www.tiktok.com/@tut_official1?lang=en', icon: <FaTiktok className="w-5 h-5" /> },
    { name: 'Youtube', url: 'https://www.youtube.com/@FacultyofICT_TUT', icon: <Youtube className="w-5 h-5" /> },
  ];

  const calendarLinks = [
    { year: '2025', url: 'https://tut.ac.za/images/docs/Academic-Core-Calendar.pdf' },
    { year: '2026', url: 'https://tut.ac.za/images/docs/2025/2026-AcademicCore-Calendar.pdf' },
  ];

 
  return (
    <footer className="relative overflow-hidden text-center md:text-left py-12" style={{ backgroundColor: '#1F4D7F', color: 'white', marginTop: '0px' }}>
      {/* Floating Background Elements */}
      {/* <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24" style={{ backgroundColor: '#1F4D7F', borderRadius: '9999px', opacity: 0.2 }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full opacity-10 animate-ping"></div>
      <div className="absolute top-32 right-32 w-10 h-10" style={{ backgroundColor: '#1F4D7F', borderRadius: '9999px', opacity: 0.2 }}></div>
      <div className="absolute bottom-32 left-32 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div> */}

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
              className="flex items-center gap-2 text-white hover:text-yellow-500 transition-colors"
            >
              {link.icon} {link.name}
            </a>
          ))}
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* Social Media + Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Follow Us + Calendar */}
          <div>
            <h5 className="text-lg font-semibold mb-3">Follow Us</h5>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-yellow-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Calendar Section */}
            <h5 className="text-lg font-semibold mb-3">Calendar</h5>
            <ul className="space-y-2 text-sm">
              {calendarLinks.map((cal) => (
                <li key={cal.year}>
                  <a
                    href={cal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-yellow-500"
                  >
                    <Calendar className="w-4 h-4" /> Academic Calendar {cal.year}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
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
