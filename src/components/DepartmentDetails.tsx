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

interface PolDepartmentDetailsProps {
  department: Department;
  onBack: () => void;
}

const PolDepartmentDetails: React.FC<PolDepartmentDetailsProps> = ({ department, onBack }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  // Local lecturer type (office is optional)
  type Lecturer = { name: string; email: string; office?: string };

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
      case 'fyf': return Globe;
      default: return BookOpen;
    }
  };

  const IconComponent = getDepartmentIcon(department.id);

  const getDepartmentPrograms = (departmentId: string) => {
    switch (departmentId) {
      case 'informatics':
        return ['DPIFF0', 'DPIF20', 'ADIF20'];
      case 'fyf':
        return ['FYF101', 'FYF102', 'FYF103'];
      default:
        return department.codes || [];
    }
  };

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
      'ADIT21': 'Advanced Diploma in Information Technology',
      'FYF101': 'Introduction to University Studies & Academic Skills',
      'FYF102': 'Mathematics & Computer Fundamentals',
      'FYF103': 'Communication & Professional Skills'
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
      'ADIT21': '2 Years',
      'FYF101': '1 Year',
      'FYF102': '1 Year',
      'FYF103': '1 Year'
    };
    return durations[code] || 'Varies';
  };

  const getProgramSubjects = (programCode: string): Array<{ subject: string; lecturers: Lecturer[] }> => {
    switch (programCode) {
      case 'DPIFF0':
        return [
          { subject: 'BCMF15D', lecturers: [{ name: 'Ms. Irene Abraham-Samgeorge', email: 'abrahamia@tut.ac.za' }] },
          { subject: 'BFSF15D', lecturers: [{ name: 'Mr. Dimakatso Malebana', email: 'malebanadd@tut.ac.za' }] }
        ];
      case 'DPIF20':
        return [
          { subject: 'BCM115D', lecturers: [{ name: 'Ms. Irene Abraham-Samgeorge', email: 'abrahamia@tut.ac.za' }] },
          { subject: 'BFS115D', lecturers: [{ name: 'Mr. Dimakatso Malebana', email: 'malebanadd@tut.ac.za' }] }
        ];
      case 'ADIF20':
        return [
          { subject: 'KWM117V', lecturers: [{ name: 'Dr. Cecile Kgoetiane', email: 'kgwetianech@tut.ac.za' }] },
          { subject: 'ITM117V', lecturers: [{ name: 'Mr. Mashithishi Phurutsi', email: 'phurutsimb@tut.ac.za' }] }
        ];
      default:
        return [];
    }
  };

  const getFyfSubjects = (): Array<{ subject: string; lecturers: Lecturer[] }> => [
    {
      subject: 'TROF05D/PPAF05D',
      lecturers: [
        { name: 'Mr. VW Kambale (Module Coordinator)', email: 'Kambalevw@tut.ac.za', office: '18-G07' },
        { name: 'Ms. Z Nzima', email: 'NzimaLZ@tut.ac.za', office: '12-108' }
      ]
    },
    {
      subject: 'COHF05D/CHOF05D',
      lecturers: [
        { name: 'Dr. C Coetzee (Module Coordinator)', email: 'CoetzeeC@tut.ac.za', office: '12-221' },
        { name: 'Mr. KN Letageng', email: 'LetagengKN@tut.ac.za', office: '12-126' }
      ]
    },
    {
      subject: 'COEF05X/CAPF05X & 16P105X/16E105X',
      lecturers: [
        { name: 'Ms. MT Popela (module Coordinator COE/CAP105X)', email: 'PopelaMT@tut.ac.za', office: '12-224' },
        { name: 'Mr. KE Mokgomole (Module Coordinator 16P/16E105X)', email: 'MokgomoleK@tut.ac.za', office: '12-232' }
      ]
    },
    {
      subject: 'CN1F05D/CFAF05D/CGAF05D',
      lecturers: [
        { name: 'Ms. MP Dibetle (Module Coordinator CGA)', email: 'DibetleMP@tut.ac.za', office: '12-134' },
        { name: 'Ms. FE Ntuli (Module Coordinator CFA)', email: 'NtuliFE@tut.ac.za', office: '12-229' }
      ]
    }
  ];

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
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* FYF Department */}
              {department.id === 'fyf' ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Subjects & Lecturers</h2>
                  <div className="space-y-6">
                    {getFyfSubjects().map((subj, idx) => (
                      <div key={idx} className="border-b pb-3 mb-3">
                        <h6 className="font-semibold text-gray-900">{subj.subject}</h6>
                        <ul className="ml-4 list-disc text-sm text-gray-700">
                          {subj.lecturers.map((lec, i) => (
                            <li key={i}>
                              <span className="font-medium">{lec.name}</span> —{" "}
                              <span className="text-blue-600">{lec.email}</span> {lec.office && `(Office: ${lec.office})`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Programs</h2>
                  <div className="space-y-4">
                    {/* If department includes course objects, show them first */}
                    {department.courses && department.courses.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Programs / Courses</h3>
                        <ul className="list-disc ml-6 space-y-1 text-gray-700">
                          {department.courses.map((c) => (
                            <li key={c.courseCode}>
                              <span className="font-medium">{c.courseCode}</span> — {c.courseName} {c.duration && <span className="text-sm text-gray-500">({c.duration})</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {getDepartmentPrograms(department.id).map((code) => (
                      <div key={code} className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-md ${expandedCode === code ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'}`}>
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-500">Program Code</div>
                            <div className="text-lg font-semibold text-gray-900">{code}</div>
                            <div className="text-sm text-gray-600">{getCodeDescription(code)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Duration</div>
                            <div className="font-medium text-gray-900">{getProgramDuration(code)}</div>
                            <button
                              className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800"
                              onClick={() => setExpandedCode(expandedCode === code ? null : code)}
                            >
                              {expandedCode === code ? 'Collapse' : 'View details'}
                            </button>
                          </div>
                        </div>

                        {expandedCode === code && (
                          <div className="p-4 border-t bg-white">
                            <p className="text-gray-700 mb-3">{getCodeDescription(code)}</p>
                            <p className="text-sm text-gray-600 mb-3">Duration: {getProgramDuration(code)}</p>
                            <h4 className="font-semibold mb-2">Subjects</h4>
                            {getProgramSubjects(code).length > 0 ? (
                              <div className="space-y-2">
                                {getProgramSubjects(code).map((s, i) => (
                                  <div key={i} className="text-sm">
                                    <div className="font-medium">{s.subject}</div>
                                    <ul className="ml-4 list-disc text-gray-700">
                                      {s.lecturers.map((lec, idx) => (
                                        <li key={idx}>{lec.name} — <span className="text-blue-600">{lec.email}</span>{lec.office ? ` (Office: ${lec.office})` : ''}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600">No subject details available for this program.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
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

            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg p-6 mt-6 text-blue-900">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Information</h2>
              <ul className="space-y-2 text-sm text-gray-900">
                {department.buildingNumber && <li><span className="font-medium">Building Number:</span> {department.buildingNumber}</li>}
                {department.email && <li><span className="font-medium">Email:</span> {department.email}</li>}
                {department.contactNumber && <li><span className="font-medium">Contact Number:</span> {department.contactNumber}</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PolDepartmentDetails;
