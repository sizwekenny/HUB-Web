import React, { useState, useEffect } from 'react';
import { ChevronLeft, Monitor, Database, Cpu, Globe, BookOpen, GraduationCap } from 'lucide-react';
import { Department } from '../types';

interface DepartmentDetailsProps {
  department: Department;
  onBack: () => void;
}

const DepartmentDetails: React.FC<DepartmentDetailsProps> = ({ department, onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

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

  const IconComponent = getDepartmentIcon(department.id);

  const getCodeDescription = (code: string) => {
    const descriptions: Record<string, string> = {
      'DPMCF0': 'Diploma in Computer Science - Foundation',
      'DPMC20': 'Diploma in Computer Science - 2nd Year',
      'ADMC20': 'Advanced Diploma in Computer Science',
      'DPRSF0': 'Diploma in Computer Science (Research) - Foundation',
      'DPRS20': 'Diploma in Computer Science (Research) - 2nd Year',
      'ADRS20': 'Advanced Diploma in Computer Science (Research)',
      'DPYEF0': 'Diploma in Computer Systems Engineering - Foundation',
      'DPYE20': 'Diploma in Computer Systems Engineering - 2nd Year',
      'ADYE20': 'Advanced Diploma in Computer Systems Engineering',
      'DPIFF0': 'Diploma in Informatics - Foundation',
      'DPIF20': 'Diploma in Informatics - 2nd Year',
      'ADIF20': 'Advanced Diploma in Informatics',
      'DPITF0': 'Diploma in Information Technology - Foundation',
      'DPIT20': 'Diploma in Information Technology - 2nd Year',
      'ADIT21': 'Advanced Diploma in Information Technology'
    };
    return descriptions[code] || 'Program description not available';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
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
          
          <div className={`flex items-center transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-xl shadow-lg p-8 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '200ms' }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Programs</h2>
              
              <div className="space-y-4">
                {department.codes.map((code, index) => (
                  <div
                    key={code}
                    className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-md ${
                      expandedCode === code ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
                    }`}
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
                      <ChevronLeft 
                        className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
                          expandedCode === code ? 'rotate-90' : '-rotate-90'
                        }`} 
                      />
                    </div>
                    
                    <div className={`overflow-hidden transition-all duration-500 ${
                      expandedCode === code ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-4 pb-4 border-t border-gray-200">
                        <div className="pt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Program Description</h4>
                          <p className="text-gray-700 mb-4">{getCodeDescription(code)}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-100">
                              <h5 className="font-medium text-gray-900 mb-2">Duration</h5>
                              <p className="text-gray-600">
                                {code.includes('F0') ? '1 Year (Foundation)' : 
                                 code.includes('20') ? '2-3 Years' : 
                                 code.includes('21') ? '1 Year (Advanced)' : 'Varies'}
                              </p>
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
          <div className="lg:col-span-1">
            <div className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '400ms' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Information</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Total Programs</h4>
                  <p className="text-2xl font-bold text-blue-600">{department.codes.length}</p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Department Focus</h4>
                  <p className="text-yellow-800">
                    {department.id === 'cs' ? 'Software Development & Algorithms' :
                     department.id === 'cse' ? 'Hardware & Software Integration' :
                     department.id === 'informatics' ? 'Data Management & Systems' :
                     'Technology Implementation'}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Career Opportunities</h4>
                  <p className="text-green-800">
                    Excellent job prospects in technology sector with high demand for graduates.
                  </p>
                </div>
              </div>
            </div>

            <div className={`bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mt-6 text-white transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '600ms' }}>
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <p className="mb-4 opacity-90">
                Contact your Academic Department for more information about these programs.
              </p>
              <button className="w-full bg-yellow-400 text-blue-900 font-semibold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors duration-300">
                Contact Department
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;