import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Monitor,
  Database,
  Cpu,
  Globe,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { Department } from '../types';
import Footer from './Footer';

interface DepartmentDetailsProps {
  department: Department;
  onBack: () => void;
}

const DepartmentDetails: React.FC<DepartmentDetailsProps> = ({ department, onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
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

  const IconComponent = getDepartmentIcon(department.id);

  const getCodeDescription = (code: string) => {
    const descriptions: Record<string, string> = {
      'DPMCF0': 'Diploma in Computer Science - Foundation',
      'DPMC20': 'Diploma in Computer Science - MainStream',
      'ADMC20': 'Advanced Diploma in Computer Science',
      'DPRSF0': 'Diploma in Computer Science (Research) - Foundation',
      'DPRS20': 'Diploma in Computer Science (Research) - MainStream',
      'ADRS20': 'Advanced Diploma in Computer Science (Research)',
      'DPYEF0': 'Diploma in Computer Systems Engineering - Foundation',
      'DPYE20': 'Diploma in Computer Systems Engineering - MainStream',
      'ADYE20': 'Advanced Diploma in Computer Systems Engineering',
      'DPIFF0': 'Diploma in Informatics - Foundation',
      'DPIF20': 'Diploma in Informatics - MainStream',
      'ADIF20': 'Advanced Diploma in Informatics',
      'DPITF0': 'Diploma in Information Technology - Foundation',
      'DPIT20': 'Diploma in Information Technology - MainStream',
      'ADIT21': 'Advanced Diploma in Information Technology'
    };
    return descriptions[code] || 'Program description not available';
  };

  const getProgramDuration = (code: string) => {
    const durations: Record<string, string> = {
      'DPMCF0': '4 Years (Foundation)',
      'DPMC20': '3 Years',
      'ADMC20': '2 Years',
      'DPRSF0': '4 Years (Foundation)',
      'DPRS20': '3 Years',
      'ADRS20': '2 Years',
      'DPYEF0': '4 Years (Foundation)',
      'DPYE20': '3 Years',
      'ADYE20': '2 Years',
      'DPIFF0': '4 Years (Foundation)',
      'DPIF20': '3 Years',
      'ADIF20': '2 Years',
      'DPITF0': '4 Years (Foundation)',
      'DPIT20': '3 Years',
      'ADIT21': '2 Years'
    };
    return durations[code] || 'Varies';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16" style={{ paddingTop: '0px' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          <div className={`flex items-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="p-4 bg-blue-100 rounded-xl mr-6">
              <IconComponent className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{department.name}</h1>
              <p className="text-xl text-gray-600">{department.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Programs */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-xl shadow-lg p-8 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Programs</h2>
              <div className="space-y-4">
                {department.codes.map((code, index) => (
                  <div
                    key={code}
                    className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-md ${expandedCode === code ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div
                      className="p-4 cursor-pointer flex items-center justify-between"
                      onClick={() => setExpandedCode(expandedCode === code ? null : code)}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                          <GraduationCap className="w-6 h-6 text-blue-900" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{code}</h3>
                          <p className="text-sm text-gray-600">Click to view details</p>
                        </div>
                      </div>
                      <ChevronLeft className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${expandedCode === code ? 'rotate-90' : '-rotate-90'}`} />
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ${expandedCode === code ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-4 pb-4 border-t border-gray-200">
                        <div className="pt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Program Description</h4>
                          <p className="text-gray-700 mb-4">{getCodeDescription(code)}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-100">
                              <h5 className="font-medium text-gray-900 mb-2">Duration</h5>
                              <p className="text-gray-600">{getProgramDuration(code)}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-100">
                              <h5 className="font-medium text-gray-900 mb-2">Level</h5>
                              <p className="text-gray-600">
                                {code.startsWith('AD') ? 'Advanced Diploma' : 'Diploma'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Action at the Top */}
            <div className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Action</h3>
              <p className="text-gray-700 mb-4">View the official ICT prospectus for detailed curriculum information.</p>
              <a
                href="https://tut.ac.za/images/prospectus/Part6_ICT_Prospectus.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block text-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                View ICT Prospectus
              </a>
            </div>

            {/* Quick Information */}
            <div className={`bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <p className="mb-4 opacity-90">Contact your Academic Department for more information about these programs.</p>
              
            </div>
            <div className={`bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg p-6 mt-6 text-blue-900 transform transition-all duration-1000${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Quick Information</h2>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li><span className="font-medium text-gray-900 dark:text-white">Building Number:</span> {department.buildingNumber}</li>
                <li><span className="font-medium text-gray-900 dark:text-white">Email:</span> {department.email}</li>
                <li><span className="font-medium text-gray-900 dark:text-white">Contact Number:</span> {department.contactNumber}</li>
              </ul>
            </div>

            {/* Help Card */}
            
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DepartmentDetails;
