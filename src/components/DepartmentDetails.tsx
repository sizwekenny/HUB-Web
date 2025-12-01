// import React, { useState, useEffect } from 'react';
// import {
//   ChevronLeft,
//   Monitor,
//   Database,
//   Cpu,
//   Globe,
//   BookOpen,
//   User,
//   Mail,
//   MapPin,
//   Phone,
//   Clock,
//   Download,
//   Calendar,
//   Building
// } from 'lucide-react';
// import { Department } from '../types';
// import Footer from './Footer';
// import adminImage from '../assets/sihle-dlamini.png';

// interface PolDepartmentDetailsProps {
//   department: Department;
//   onBack: () => void;
// }

// const PolDepartmentDetails: React.FC<PolDepartmentDetailsProps> = ({ department, onBack }) => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [expandedCode, setExpandedCode] = useState<string | null>(null);

//   // Local lecturer type (office is optional)
//   type Lecturer = { name: string; email: string; office?: string };

//   useEffect(() => {
//     setIsLoaded(true);
//     window.scrollTo(0, 0);
//   }, []);

//   const getDepartmentIcon = (departmentId: string) => {
//     switch (departmentId) {
//       case 'cs': return Monitor;
//       case 'cse': return Cpu;
//       case 'informatics': return Database;
//       case 'it': return Globe;
//       case 'fyf': return Globe;
//       default: return BookOpen;
//     }
//   };

//   const IconComponent = getDepartmentIcon(department.id);

//   const getDepartmentPrograms = (departmentId: string) => {
//     switch (departmentId) {
//       case 'informatics':
//         return ['DPIFF0', 'DPIF20', 'ADIF20'];
//       case 'fyf':
//         return ['FYF101', 'FYF102', 'FYF103'];
//       default:
//         return department.codes || [];
//     }
//   };

//   const getCodeDescription = (code: string) => {
//     const descriptions: Record<string, string> = {
//       'DPMCF0': 'Diploma in Computer Science - Foundation',
//       'DPMC20': 'Diploma in Computer Science - MainStream',
//       'ADMC20': 'Advanced Diploma in Computer Science',
//       'DPRSF0': 'Diploma in Computer Science (Research) - Foundation',
//       'DPRS20': 'Diploma in Computer Science (Research) - MainStream',
//       'ADRS20': 'Advanced Diploma in Computer Science (Research)',
//       'DPYEF0': 'Diploma in Computer Systems Engineering - Foundation',
//       'DPYE20': 'Diploma in Computer Systems Engineering - MainStream',
//       'ADYE20': 'Advanced Diploma in Computer Systems Engineering',
//       'DPIFF0': 'Diploma in Informatics - Foundation',
//       'DPIF20': 'Diploma in Informatics - MainStream',
//       'ADIF20': 'Advanced Diploma in Informatics',
//       'DPITF0': 'Diploma in Information Technology - Foundation',
//       'DPIT20': 'Diploma in Information Technology - MainStream',
//       'ADIT21': 'Advanced Diploma in Information Technology',
//       'FYF101': 'Introduction to University Studies & Academic Skills',
//       'FYF102': 'Mathematics & Computer Fundamentals',
//       'FYF103': 'Communication & Professional Skills'
//     };
//     return descriptions[code] || 'Program description not available';
//   };

//   const getProgramDuration = (code: string) => {
//     const durations: Record<string, string> = {
//       'DPMCF0': '4 Years (Foundation)',
//       'DPMC20': '3 Years',
//       'ADMC20': '2 Years',
//       'DPRSF0': '4 Years (Foundation)',
//       'DPRS20': '3 Years',
//       'ADRS20': '2 Years',
//       'DPYEF0': '4 Years (Foundation)',
//       'DPYE20': '3 Years',
//       'ADYE20': '2 Years',
//       'DPIFF0': '4 Years (Foundation)',
//       'DPIF20': '3 Years',
//       'ADIF20': '2 Years',
//       'DPITF0': '4 Years (Foundation)',
//       'DPIT20': '3 Years',
//       'ADIT21': '2 Years',
//       'FYF101': '1 Year',
//       'FYF102': '1 Year',
//       'FYF103': '1 Year'
//     };
//     return durations[code] || 'Varies';
//   };

//   const getProgramSubjects = (programCode: string): Array<{ subject: string; lecturers: Lecturer[] }> => {
//     switch (programCode) {
//       case 'DPIFF0':
//         return [
//           { subject: 'BCMF15D', lecturers: [{ name: 'Ms. Irene Abraham-Samgeorge', email: 'abrahamia@tut.ac.za' }] },
//           { subject: 'BFSF15D', lecturers: [{ name: 'Mr. Dimakatso Malebana', email: 'malebanadd@tut.ac.za' }] }
//         ];
//       case 'DPIF20':
//         return [
//           { subject: 'BCM115D', lecturers: [{ name: 'Ms. Irene Abraham-Samgeorge', email: 'abrahamia@tut.ac.za' }] },
//           { subject: 'BFS115D', lecturers: [{ name: 'Mr. Dimakatso Malebana', email: 'malebanadd@tut.ac.za' }] }
//         ];
//       case 'ADIF20':
//         return [
//           { subject: 'KWM117V', lecturers: [{ name: 'Dr. Cecile Kgoetiane', email: 'kgwetianech@tut.ac.za' }] },
//           { subject: 'ITM117V', lecturers: [{ name: 'Mr. Mashithishi Phurutsi', email: 'phurutsimb@tut.ac.za' }] }
//         ];
//       default:
//         return [];
//     }
//   };

//   const getFyfSubjects = (): Array<{ subject: string; lecturers: Lecturer[] }> => [
//     {
//       subject: 'TROF05D/PPAF05D',
//       lecturers: [
//         { name: 'Mr. VW Kambale (Module Coordinator)', email: 'Kambalevw@tut.ac.za', office: '18-G07' },
//         { name: 'Ms. Z Nzima', email: 'NzimaLZ@tut.ac.za', office: '12-108' }
//       ]
//     },
//     {
//       subject: 'COHF05D/CHOF05D',
//       lecturers: [
//         { name: 'Dr. C Coetzee (Module Coordinator)', email: 'CoetzeeC@tut.ac.za', office: '12-221' },
//         { name: 'Mr. KN Letageng', email: 'LetagengKN@tut.ac.za', office: '12-126' }
//       ]
//     },
//     {
//       subject: 'COEF05X/CAPF05X & 16P105X/16E105X',
//       lecturers: [
//         { name: 'Ms. MT Popela (module Coordinator COE/CAP105X)', email: 'PopelaMT@tut.ac.za', office: '12-224' },
//         { name: 'Mr. KE Mokgomole (Module Coordinator 16P/16E105X)', email: 'MokgomoleK@tut.ac.za', office: '12-232' }
//       ]
//     },
//     {
//       subject: 'CN1F05D/CFAF05D/CGAF05D',
//       lecturers: [
//         { name: 'Ms. MP Dibetle (Module Coordinator CGA)', email: 'DibetleMP@tut.ac.za', office: '12-134' },
//         { name: 'Ms. FE Ntuli (Module Coordinator CFA)', email: 'NtuliFE@tut.ac.za', office: '12-229' }
//       ]
//     }
//   ];

//   // Administrator and HOD Information - Only for ICT & First Year Foundation
//   const administratorInfo = {
//     name: 'Sihle Dlamini',
//     position: 'Administrator: ICT 1st Year and Foundation Unit',
//     office: '18-G07',
//     imageUrl: adminImage,
//     services: [
//       'Module Additions/Cancellations Signatures',
//       'Predicate Enquiries',
//       'Re-admissions Processing',
//       'January/February 2026 Period Operations'
//     ],
//     contactLocation: 'Building 18-G07'
//   };

//   const hodInfo = {
//     name: 'Mr MB Phurutsi',
//     position: 'Head of Department - Foundation Unit',
//     office: '18-G07',
//     email: 'PhurutsiMB@tut.ac.za',
//     tel: '9796'
//   };

//   // Check if current department is ICT & First Year Foundation
//   const isICTFoundationDepartment = department.id === 'fyf';

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <button
//             onClick={onBack}
//             className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-6 group"
//           >
//             <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
//             Back to Departments
//           </button>

//           <div className={`flex flex-col lg:flex-row lg:items-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//             <div className="flex items-start lg:items-center mb-4 lg:mb-0">
//               <div className="p-4 bg-blue-100 rounded-xl mr-6 shadow-md">
//                 <IconComponent className="w-12 h-12 text-blue-600" />
//               </div>
//               <div className="flex-1">
//                 <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">{department.name}</h1>
//                 <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-4xl">{department.description}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
//         <div className={`grid grid-cols-1 ${isICTFoundationDepartment ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-6 lg:gap-8`}>
//           {/* Left Sidebar - Desktop only */}
//           <div className="xl:col-span-1 space-y-6 hidden xl:block">
//             {/* Quick Information Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                 <Building className="w-5 h-5 mr-2 text-blue-600" />
//                 Department Info
//               </h3>
//               <div className="space-y-3">
//                 {department.buildingNumber && (
//                   <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                     <span className="text-sm font-medium text-gray-600">Building</span>
//                     <span className="text-sm font-semibold text-gray-900">{department.buildingNumber}</span>
//                   </div>
//                 )}
//                 {department.email && (
//                   <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                     <span className="text-sm font-medium text-gray-600">Email</span>
//                     <span className="text-sm font-semibold text-blue-600">{department.email}</span>
//                   </div>
//                 )}
//                 {department.contactNumber && (
//                   <div className="flex items-center justify-between py-2">
//                     <span className="text-sm font-medium text-gray-600">Contact</span>
//                     <span className="text-sm font-semibold text-gray-900">{department.contactNumber}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Quick Action Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                 <Download className="w-5 h-5 mr-2 text-blue-600" />
//                 Resources
//               </h3>
//               <p className="text-gray-700 mb-4 text-sm leading-relaxed">
//                 Download the official ICT prospectus for detailed curriculum information.
//               </p>
//               <a
//                 href="https://tut.ac.za/images/prospectus/Part6_ICT_Prospectus.pdf"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 View ICT Prospectus
//               </a>
//             </div>
//           </div>

//           {/* Main Content Area */}
//           <div className={`${isICTFoundationDepartment ? 'xl:col-span-2' : 'xl:col-span-2'}`}>
//             {/* Programs Section */}
//             <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100">
//               {/* FYF Department */}
//               {department.id === 'fyf' ? (
//                 <>
//                   <div className="flex items-center mb-6">
//                     <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
//                     <h2 className="text-2xl font-bold text-gray-900">Subjects & Lecturers</h2>
//                   </div>
//                   <div className="space-y-6">
//                     {getFyfSubjects().map((subj, idx) => (
//                       <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-300">
//                         <h6 className="font-semibold text-gray-900 text-lg mb-3">{subj.subject}</h6>
//                         <ul className="space-y-2">
//                           {subj.lecturers.map((lec, i) => (
//                             <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
//                               <div className="flex-1">
//                                 <span className="font-medium text-gray-900 block">{lec.name}</span>
//                                 <a href={`mailto:${lec.email}`} className="text-blue-600 hover:text-blue-800 text-sm">
//                                   {lec.email}
//                                 </a>
//                               </div>
//                               {lec.office && (
//                                 <div className="mt-2 sm:mt-0 sm:ml-4">
//                                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                     <MapPin className="w-3 h-3 mr-1" />
//                                     Office: {lec.office}
//                                   </span>
//                                 </div>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="flex items-center mb-6">
//                     <Calendar className="w-6 h-6 text-blue-600 mr-3" />
//                     <h2 className="text-2xl font-bold text-gray-900">Available Programs</h2>
//                   </div>
                  
//                   {/* Department Courses */}
//                   {department.courses && department.courses.length > 0 && (
//                     <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
//                       <h3 className="text-xl font-semibold text-gray-900 mb-4">Programs / Courses</h3>
//                       <div className="grid gap-4">
//                         {department.courses.map((c) => (
//                           <div key={c.courseCode} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                             <div className="flex-1">
//                               <div className="font-semibold text-gray-900">{c.courseCode}</div>
//                               <div className="text-gray-700">{c.courseName}</div>
//                             </div>
//                             {c.duration && (
//                               <div className="mt-2 sm:mt-0">
//                                 <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                                   {c.duration}
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Program Cards */}
//                   <div className="space-y-4">
//                     {getDepartmentPrograms(department.id).map((code) => (
//                       <div 
//                         key={code} 
//                         className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg ${
//                           expandedCode === code ? 'bg-blue-50 border-blue-300 shadow-md' : 'bg-white hover:border-gray-300'
//                         }`}
//                       >
//                         <div className="p-6">
//                           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//                             <div className="flex-1 mb-4 lg:mb-0">
//                               <div className="text-sm text-gray-500 font-medium mb-1">Program Code</div>
//                               <div className="text-xl font-bold text-gray-900 mb-2">{code}</div>
//                               <div className="text-gray-700 mb-2">{getCodeDescription(code)}</div>
//                             </div>
//                             <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center gap-4">
//                               <div className="text-right">
//                                 <div className="text-sm text-gray-500 font-medium">Duration</div>
//                                 <div className="font-semibold text-gray-900">{getProgramDuration(code)}</div>
//                               </div>
//                               <button
//                                 className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 min-w-[120px]"
//                                 onClick={() => setExpandedCode(expandedCode === code ? null : code)}
//                               >
//                                 {expandedCode === code ? 'Collapse' : 'View Details'}
//                               </button>
//                             </div>
//                           </div>

//                           {expandedCode === code && (
//                             <div className="mt-6 pt-6 border-t border-gray-200">
//                               <div className="grid gap-4">
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900 mb-3 text-lg">Program Overview</h4>
//                                   <p className="text-gray-700 mb-3">{getCodeDescription(code)}</p>
//                                   <div className="flex items-center text-sm text-gray-600">
//                                     <Clock className="w-4 h-4 mr-2" />
//                                     Duration: {getProgramDuration(code)}
//                                   </div>
//                                 </div>
                                
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900 mb-3 text-lg">Subjects & Lecturers</h4>
//                                   {getProgramSubjects(code).length > 0 ? (
//                                     <div className="space-y-4">
//                                       {getProgramSubjects(code).map((s, i) => (
//                                         <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
//                                           <div className="font-semibold text-gray-900 mb-3 text-md">{s.subject}</div>
//                                           <div className="space-y-2">
//                                             {s.lecturers.map((lec, idx) => (
//                                               <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
//                                                 <div className="flex-1">
//                                                   <div className="font-medium text-gray-900">{lec.name}</div>
//                                                   <a href={`mailto:${lec.email}`} className="text-blue-600 hover:text-blue-800 text-sm">
//                                                     {lec.email}
//                                                   </a>
//                                                 </div>
//                                                 {lec.office && (
//                                                   <div className="mt-2 sm:mt-0 sm:ml-4">
//                                                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                                       <MapPin className="w-3 h-3 mr-1" />
//                                                       {lec.office}
//                                                     </span>
//                                                   </div>
//                                                 )}
//                                               </div>
//                                             ))}
//                                           </div>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   ) : (
//                                     <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
//                                       No subject details available for this program.
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Right Sidebar - Only show for ICT & First Year Foundation */}
//           {isICTFoundationDepartment && (
//             <div className="xl:col-span-1 space-y-6">
//               {/* Administrator Card */}
//               <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200">
//                 <div className="relative h-40 bg-gradient-to-br from-blue-100 to-blue-200">
//                   {administratorInfo.imageUrl ? (
//                     <img 
//                       src={administratorInfo.imageUrl} 
//                       alt={administratorInfo.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-blue-100">
//                       <User className="w-16 h-16 text-blue-400" />
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-6">
//                   <div className="text-center mb-4">
//                     <h3 className="text-xl font-bold text-gray-900 mb-1">{administratorInfo.name}</h3>
//                     <p className="text-blue-600 font-semibold text-sm">{administratorInfo.position}</p>
//                   </div>

//                   <div className="space-y-3 mb-4">
//                     <div className="flex items-center space-x-3 text-sm text-gray-700 bg-blue-50 rounded-lg p-3">
//                       <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                       <div>
//                         <div className="font-semibold">Office Location</div>
//                         <div className="text-blue-700">{administratorInfo.office}</div>
//                         <div className="text-gray-600 text-xs">{administratorInfo.contactLocation}</div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="border-t pt-4">
//                     <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
//                       <Clock className="w-4 h-4 mr-2 text-blue-600" />
//                       Services Provided
//                     </h4>
//                     <ul className="space-y-2 text-sm text-gray-700">
//                       {administratorInfo.services.map((service, index) => (
//                         <li key={index} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
//                           <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
//                           <span className="leading-relaxed">{service}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               {/* HOD Card */}
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
//                 <div className="flex items-center space-x-4 mb-4">
//                   <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
//                     <User className="w-7 h-7 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-lg">{hodInfo.name}</h3>
//                     <p className="text-blue-100 text-sm">{hodInfo.position}</p>
//                   </div>
//                 </div>

//                 <div className="space-y-3 text-sm">
//                   <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                     <MapPin className="w-4 h-4 text-blue-200" />
//                     <div>
//                       <div className="font-medium">Office</div>
//                       <div>{hodInfo.office}</div>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                     <Mail className="w-4 h-4 text-blue-200" />
//                     <div>
//                       <div className="font-medium">Email</div>
//                       <a href={`mailto:${hodInfo.email}`} className="hover:text-blue-200 transition-colors">
//                         {hodInfo.email}
//                       </a>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                     <Phone className="w-4 h-4 text-blue-200" />
//                     <div>
//                       <div className="font-medium">Telephone</div>
//                       <div>{hodInfo.tel}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Mobile Only Cards */}
//           <div className="xl:hidden space-y-6">
//             {/* Quick Information Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                 <Building className="w-5 h-5 mr-2 text-blue-600" />
//                 Department Info
//               </h3>
//               <div className="space-y-3">
//                 {department.buildingNumber && (
//                   <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                     <span className="text-sm font-medium text-gray-600">Building</span>
//                     <span className="text-sm font-semibold text-gray-900">{department.buildingNumber}</span>
//                   </div>
//                 )}
//                 {department.email && (
//                   <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                     <span className="text-sm font-medium text-gray-600">Email</span>
//                     <span className="text-sm font-semibold text-blue-600">{department.email}</span>
//                   </div>
//                 )}
//                 {department.contactNumber && (
//                   <div className="flex items-center justify-between py-2">
//                     <span className="text-sm font-medium text-gray-600">Contact</span>
//                     <span className="text-sm font-semibold text-gray-900">{department.contactNumber}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Quick Action Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                 <Download className="w-5 h-5 mr-2 text-blue-600" />
//                 Resources
//               </h3>
//               <p className="text-gray-700 mb-4 text-sm leading-relaxed">
//                 Download the official ICT prospectus for detailed curriculum information.
//               </p>
//               <a
//                 href="https://tut.ac.za/images/prospectus/Part6_ICT_Prospectus.pdf"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 View ICT Prospectus
//               </a>
//             </div>

//             {/* Mobile: Show Administrator and HOD cards only for ICT Foundation */}
//             {isICTFoundationDepartment && (
//               <>
//                 {/* Administrator Card - Mobile */}
//                 <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200">
//                   <div className="relative h-40 bg-gradient-to-br from-blue-100 to-blue-200">
//                     {administratorInfo.imageUrl ? (
//                       <img 
//                         src={administratorInfo.imageUrl} 
//                         alt={administratorInfo.name}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-blue-100">
//                         <User className="w-16 h-16 text-blue-400" />
//                       </div>
//                     )}
//                   </div>

//                   <div className="p-6">
//                     <div className="text-center mb-4">
//                       <h3 className="text-xl font-bold text-gray-900 mb-1">{administratorInfo.name}</h3>
//                       <p className="text-blue-600 font-semibold text-sm">{administratorInfo.position}</p>
//                     </div>

//                     <div className="space-y-3 mb-4">
//                       <div className="flex items-center space-x-3 text-sm text-gray-700 bg-blue-50 rounded-lg p-3">
//                         <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                         <div>
//                           <div className="font-semibold">Office Location</div>
//                           <div className="text-blue-700">{administratorInfo.office}</div>
//                           <div className="text-gray-600 text-xs">{administratorInfo.contactLocation}</div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="border-t pt-4">
//                       <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
//                         <Clock className="w-4 h-4 mr-2 text-blue-600" />
//                         Services Provided
//                       </h4>
//                       <ul className="space-y-2 text-sm text-gray-700">
//                         {administratorInfo.services.map((service, index) => (
//                           <li key={index} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
//                             <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
//                             <span className="leading-relaxed">{service}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

//                 {/* HOD Card - Mobile */}
//                 <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
//                   <div className="flex items-center space-x-4 mb-4">
//                     <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
//                       <User className="w-7 h-7 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-lg">{hodInfo.name}</h3>
//                       <p className="text-blue-100 text-sm">{hodInfo.position}</p>
//                     </div>
//                   </div>

//                   <div className="space-y-3 text-sm">
//                     <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                       <MapPin className="w-4 h-4 text-blue-200" />
//                       <div>
//                         <div className="font-medium">Office</div>
//                         <div>{hodInfo.office}</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                       <Mail className="w-4 h-4 text-blue-200" />
//                       <div>
//                         <div className="font-medium">Email</div>
//                         <a href={`mailto:${hodInfo.email}`} className="hover:text-blue-200 transition-colors">
//                           {hodInfo.email}
//                         </a>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                       <Phone className="w-4 h-4 text-blue-200" />
//                       <div>
//                         <div className="font-medium">Telephone</div>
//                         <div>{hodInfo.tel}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default PolDepartmentDetails;




// import React, { useState, useEffect } from 'react';
// import {
//   ChevronLeft,
//   Monitor,
//   Database,
//   Cpu,
//   Globe,
//   BookOpen,
//   User,
//   Mail,
//   MapPin,
//   Phone,
//   Clock,
//   Download,
//   Calendar,
//   Building
// } from 'lucide-react';
// import { Department } from '../types';
// import Footer from './Footer';
// import adminImage from '../assets/sihle-dlamini.png';
// import { departments } from '../data/data';

// const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000';

// interface PolDepartmentDetailsProps {
//   department: Department;
//   onBack: () => void;
// }

// // Types based on your database schema
// interface Program {
//   program_id: number;
//   program_code: string;
//   program_name: string;
//   description?: string;
//   duration: string;
//   is_active: boolean;
// }

// interface Lecturer {
//   lecturer_id: number;
//   name: string;
//   email: string;
//   office?: string;
//   phone?: string;
//   position?: string;
//   is_active: boolean;
// }

// interface Course {
//   course_id: number;
//   course_code: string;
//   course_name: string;
//   description?: string;
//   duration: string;
//   nqf_level?: number;
//   credits?: number;
//   is_active: boolean;
// }

// interface SubjectAssignment {
//   assignment_id: number;
//   program_id?: number;
//   program_code?: string;
//   program_name?: string;
//   subject_code: string;
//   subject_name: string;
//   lecturers?: Lecturer[];
//   is_active: boolean;
// }

// const PolDepartmentDetails: React.FC<PolDepartmentDetailsProps> = ({ department, onBack }) => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [expandedProgram, setExpandedProgram] = useState<number | null>(null);
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [lecturers, setLecturers] = useState<Lecturer[]>([]);
//   const [subjectAssignments, setSubjectAssignments] = useState<SubjectAssignment[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Get department ID from various possible property names
//   const getDepartmentId = () => {
//     // Try different possible property names for department ID
//     const departmentId = 
//       department.department_id || 
//       department.id;
    
//     console.log('🆔 Department object:', department);
//     console.log('🔍 Extracted department ID:', departmentId);
//     return departmentId;
//   };

//   useEffect(() => {
//     setIsLoaded(true);
//     window.scrollTo(0, 0);
//     loadDepartmentData();
//   }, [department]);

//   const loadDepartmentData = async () => {
//     const departmentId = getDepartmentId();
    
//     if (!departmentId) {
//       console.error('❌ No department ID found in department object:', department);
//       setError('Department ID is missing. Cannot load department data.');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       console.log('🔄 Loading data for department ID:', departmentId);

//       // Load all data in parallel
//       await Promise.all([
//         loadPrograms(departmentId),
//         loadLecturers(departmentId),
//         loadSubjectAssignments(departmentId),
//         loadCourses(departmentId)
//       ]);

//       console.log('✅ All department data loaded successfully');

//     } catch (err) {
//       console.error('❌ Error loading department data:', err);
//       setError('Failed to load department data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadPrograms = async (departmentId: string | number) => {
//     try {
//       console.log(`📂 Fetching programs for department ID: ${departmentId}`);
//       const response = await fetch(`${API_URL}/api/departments/programs/department/${departmentId}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       console.log('📦 Programs data received:', data);
      
//       if (data.success) {
//         setPrograms(data.data || []);
//         console.log(`✅ Loaded ${data.data?.length || 0} programs`);
//       } else {
//         throw new Error(data.error || 'Failed to fetch programs');
//       }
//     } catch (err) {
//       console.error('❌ Error loading programs:', err);
//       setPrograms([]);
//     }
//   };

//   const loadLecturers = async (departmentId: string | number) => {
//     try {
//       console.log(`📂 Fetching lecturers for department ID: ${departmentId}`);
//       const response = await fetch(`${API_URL}/api/departments/lecturers/department/${departmentId}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       console.log('📦 Lecturers data received:', data);
      
//       if (data.success) {
//         setLecturers(data.data || []);
//         console.log(`✅ Loaded ${data.data?.length || 0} lecturers`);
//       } else {
//         throw new Error(data.error || 'Failed to fetch lecturers');
//       }
//     } catch (err) {
//       console.error('❌ Error loading lecturers:', err);
//       setLecturers([]);
//     }
//   };

//   const loadSubjectAssignments = async (departmentId: string | number) => {
//     try {
//       console.log(`📂 Fetching subject assignments for department ID: ${departmentId}`);
//       const response = await fetch(`${API_URL}/api/departments/subject-assignments/department/${departmentId}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       console.log('📦 Subject assignments data received:', data);
      
//       if (data.success) {
//         setSubjectAssignments(data.data || []);
//         console.log(`✅ Loaded ${data.data?.length || 0} subject assignments`);
//       } else {
//         throw new Error(data.error || 'Failed to fetch subject assignments');
//       }
//     } catch (err) {
//       console.error('❌ Error loading subject assignments:', err);
//       setSubjectAssignments([]);
//     }
//   };

//   const loadCourses = async (departmentId: string | number) => {
//     try {
//       console.log(`📂 Fetching courses for department ID: ${departmentId}`);
//       const response = await fetch(`${API_URL}/api/departments/courses/department/${departmentId}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       console.log('📦 Courses data received:', data);
      
//       if (data.success) {
//         setCourses(data.data || []);
//         console.log(`✅ Loaded ${data.data?.length || 0} courses`);
//       } else {
//         throw new Error(data.error || 'Failed to fetch courses');
//       }
//     } catch (err) {
//       console.error('❌ Error loading courses:', err);
//       setCourses([]);
//     }
//   };

//   const getDepartmentIcon = (departmentCode: string) => {
//     switch (departmentCode) {
//       case 'CS': return Monitor;
//       case 'CSE': return Cpu;
//       case 'INF': return Database;
//       case 'IT': return Globe;
//       case 'DFYF': return BookOpen;
//       case 'DOA': return BookOpen;
//       case 'CSS': return BookOpen;
//       default: return BookOpen;
//     }
//   };

//   const IconComponent = getDepartmentIcon(department.department_code || '');

//   // Get subjects for a specific program
//   const getSubjectsForProgram = (programId: number): SubjectAssignment[] => {
//     return subjectAssignments.filter(sa => sa.program_id === programId);
//   };

//   // Get all subject assignments for FYF department (no program filter)
//   const getFyfSubjectAssignments = (): SubjectAssignment[] => {
//     return subjectAssignments;
//   };

//   // Administrator and HOD Information
//   const administratorInfo = {
//     name: 'Sihle Dlamini',
//     position: 'Administrator: ICT 1st Year and Foundation Unit',
//     office: '18-G07',
//     imageUrl: adminImage,
//     services: [
//       'Module Additions/Cancellations Signatures',
//       'Predicate Enquiries',
//       'Re-admissions Processing',
//       'January/February 2026 Period Operations'
//     ],
//     contactLocation: 'Building 18-G07'
//   };

//   const hodInfo = {
//     name: 'Mr MB Phurutsi',
//     position: 'Head of Department - Foundation Unit',
//     office: '18-G07',
//     email: 'PhurutsiMB@tut.ac.za',
//     tel: '9796'
//   };

//   // Check if current department is ICT & First Year Foundation based on department_code
//   const isICTFoundationDepartment = department.department_code === 'DFYF';

//   // Get campus name based on campus_id
//   const getCampusName = (campusId: number) => {
//     const campuses: Record<number, string> = {
//       1: 'Soshanguve South',
//       2: 'eMalahleni', 
//       3: 'Polokwane'
//     };
//     return campuses[campusId] || 'Unknown Campus';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-4 text-gray-600">Loading department data...</p>
//               <p className="text-sm text-gray-500 mt-2">Department ID: {getDepartmentId() || 'Not found'}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="text-red-500 text-lg mb-4">Error Loading Department</div>
//               <p className="text-gray-600 mb-4">{error}</p>
//               <div className="text-sm text-gray-500 mb-4">
//                 Department ID: {getDepartmentId() || 'Not found'}
//               </div>
//               <button
//                 onClick={loadDepartmentData}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//               >
//                 Retry
//               </button>
//               <button
//                 onClick={onBack}
//                 className="ml-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
//               >
//                 Back to Departments
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <button
//             onClick={onBack}
//             className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-6 group"
//           >
//             <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
//             Back to Departments
//           </button>

//           <div className={`flex flex-col lg:flex-row lg:items-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//             <div className="flex items-start lg:items-center mb-4 lg:mb-0">
//               <div className="p-4 bg-blue-100 rounded-xl mr-6 shadow-md">
//                 <IconComponent className="w-12 h-12 text-blue-600" />
//               </div>
//               <div className="flex-1">
//                 <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
//                   {department.department_name || department.name}
//                 </h1>
//                 <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-4xl">
//                   {department.description || `Department of ${department.department_name || department.name} at ${getCampusName(department.campus_id)} Campus`}
//                 </p>
//                 {department.department_code && (
//                   <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mt-2">
//                     Code: {department.department_code}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
//         <div className={`grid grid-cols-1 ${isICTFoundationDepartment ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-6 lg:gap-8`}>
//           {/* Left Sidebar - Desktop only */}
//           <div className="xl:col-span-1 space-y-6 hidden xl:block">
//             {/* Quick Information Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                 <Building className="w-5 h-5 mr-2 text-blue-600" />
//                 Department Info
//               </h3>
//               <div className="space-y-3">
//                 {department.building_number && (
//                   <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                     <span className="text-sm font-medium text-gray-600">Building</span>
//                     <span className="text-sm font-semibold text-gray-900">{department.building_number}</span>
//                   </div>
//                 )}
//                 {department.email && (
//                   <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                     <span className="text-sm font-medium text-gray-600">Email</span>
//                     <span className="text-sm font-semibold text-blue-600">{department.email}</span>
//                   </div>
//                 )}
//                 {department.contact_number && (
//                   <div className="flex items-center justify-between py-2">
//                     <span className="text-sm font-medium text-gray-600">Contact</span>
//                     <span className="text-sm font-semibold text-gray-900">{department.contact_number}</span>
//                   </div>
//                 )}
//                 {department.campus_id && (
//                   <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                     <span className="text-sm font-medium text-gray-600">Campus</span>
//                     <span className="text-sm font-semibold text-gray-900">{getCampusName(department.campus_id)}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Lecturers Card */}
//             {lecturers.length > 0 && (
//               <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                   <User className="w-5 h-5 mr-2 text-blue-600" />
//                   Department Lecturers ({lecturers.length})
//                 </h3>
//                 <div className="space-y-3">
//                   {lecturers.slice(0, 3).map((lecturer) => (
//                     <div key={lecturer.lecturer_id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                       <div className="flex-1 min-w-0">
//                         <div className="font-medium text-gray-900 text-sm truncate">{lecturer.name}</div>
//                         <div className="text-gray-600 text-xs truncate">{lecturer.position}</div>
//                         <a href={`mailto:${lecturer.email}`} className="text-blue-600 hover:text-blue-800 text-xs">
//                           {lecturer.email}
//                         </a>
//                       </div>
//                     </div>
//                   ))}
//                   {lecturers.length > 3 && (
//                     <div className="text-center text-sm text-gray-500">
//                       +{lecturers.length - 3} more lecturers
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Quick Action Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                 <Download className="w-5 h-5 mr-2 text-blue-600" />
//                 Resources
//               </h3>
//               <p className="text-gray-700 mb-4 text-sm leading-relaxed">
//                 Download the official ICT prospectus for detailed curriculum information.
//               </p>
//               <a
//                 href="https://tut.ac.za/images/prospectus/Part6_ICT_Prospectus.pdf"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 View ICT Prospectus
//               </a>
//             </div>
//           </div>

//           {/* Main Content Area */}
//           <div className={`${isICTFoundationDepartment ? 'xl:col-span-2' : 'xl:col-span-2'}`}>
//             {/* Programs Section */}
//             <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100">
//               {/* FYF Department */}
//               {isICTFoundationDepartment ? (
//                 <>
//                   <div className="flex items-center mb-6">
//                     <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
//                     <h2 className="text-2xl font-bold text-gray-900">Subjects & Lecturers</h2>
//                   </div>
                  
//                   {subjectAssignments.length > 0 ? (
//                     <div className="space-y-6">
//                       {getFyfSubjectAssignments().map((subject) => (
//                         <div key={subject.assignment_id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-300">
//                           <h6 className="font-semibold text-gray-900 text-lg mb-3">{subject.subject_code}</h6>
//                           <p className="text-gray-600 mb-3">{subject.subject_name}</p>
//                           {subject.lecturers && subject.lecturers.length > 0 ? (
//                             <ul className="space-y-2">
//                               {subject.lecturers.map((lecturer) => (
//                                 <li key={lecturer.lecturer_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
//                                   <div className="flex-1">
//                                     <span className="font-medium text-gray-900 block">{lecturer.name}</span>
//                                     <a href={`mailto:${lecturer.email}`} className="text-blue-600 hover:text-blue-800 text-sm">
//                                       {lecturer.email}
//                                     </a>
//                                   </div>
//                                   {lecturer.office && (
//                                     <div className="mt-2 sm:mt-0 sm:ml-4">
//                                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                         <MapPin className="w-3 h-3 mr-1" />
//                                         Office: {lecturer.office}
//                                       </span>
//                                     </div>
//                                   )}
//                                 </li>
//                               ))}
//                             </ul>
//                           ) : (
//                             <p className="text-gray-500 text-sm p-3 bg-gray-50 rounded-lg">
//                               No lecturers assigned to this subject.
//                             </p>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Available</h3>
//                       <p className="text-gray-500">No subject assignments have been created for this department yet.</p>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <div className="flex items-center mb-6">
//                     <Calendar className="w-6 h-6 text-blue-600 mr-3" />
//                     <h2 className="text-2xl font-bold text-gray-900">Available Programs & Courses</h2>
//                   </div>
                  
//                   {/* Department Courses from Database */}
//                   {courses.length > 0 && (
//                     <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
//                       <h3 className="text-xl font-semibold text-gray-900 mb-4">Courses ({courses.length})</h3>
//                       <div className="grid gap-4">
//                         {courses.map((course) => (
//                           <div key={course.course_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                             <div className="flex-1">
//                               <div className="font-semibold text-gray-900">{course.course_code}</div>
//                               <div className="text-gray-700">{course.course_name}</div>
//                               {course.description && (
//                                 <p className="text-gray-600 text-sm mt-1">{course.description}</p>
//                               )}
//                             </div>
//                             {course.duration && (
//                               <div className="mt-2 sm:mt-0">
//                                 <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                                   {course.duration}
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Program Cards */}
//                   {programs.length > 0 ? (
//                     <div className="space-y-4">
//                       {programs.map((program) => (
//                         <div 
//                           key={program.program_id} 
//                           className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg ${
//                             expandedProgram === program.program_id ? 'bg-blue-50 border-blue-300 shadow-md' : 'bg-white hover:border-gray-300'
//                           }`}
//                         >
//                           <div className="p-6">
//                             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//                               <div className="flex-1 mb-4 lg:mb-0">
//                                 <div className="text-sm text-gray-500 font-medium mb-1">Program Code</div>
//                                 <div className="text-xl font-bold text-gray-900 mb-2">{program.program_code}</div>
//                                 <div className="text-gray-700 mb-2">{program.program_name}</div>
//                                 {program.description && (
//                                   <p className="text-gray-600 text-sm mt-1">{program.description}</p>
//                                 )}
//                               </div>
//                               <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center gap-4">
//                                 <div className="text-right">
//                                   <div className="text-sm text-gray-500 font-medium">Duration</div>
//                                   <div className="font-semibold text-gray-900">{program.duration}</div>
//                                 </div>
//                                 <button
//                                   className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 min-w-[120px]"
//                                   onClick={() => setExpandedProgram(expandedProgram === program.program_id ? null : program.program_id)}
//                                 >
//                                   {expandedProgram === program.program_id ? 'Collapse' : 'View Details'}
//                                 </button>
//                               </div>
//                             </div>

//                             {expandedProgram === program.program_id && (
//                               <div className="mt-6 pt-6 border-t border-gray-200">
//                                 <div className="grid gap-4">
//                                   <div>
//                                     <h4 className="font-semibold text-gray-900 mb-3 text-lg">Program Overview</h4>
//                                     <p className="text-gray-700 mb-3">{program.description || program.program_name}</p>
//                                     <div className="flex items-center text-sm text-gray-600">
//                                       <Clock className="w-4 h-4 mr-2" />
//                                       Duration: {program.duration}
//                                     </div>
//                                   </div>
                                  
//                                   <div>
//                                     <h4 className="font-semibold text-gray-900 mb-3 text-lg">Subjects & Lecturers</h4>
//                                     {getSubjectsForProgram(program.program_id).length > 0 ? (
//                                       <div className="space-y-4">
//                                         {getSubjectsForProgram(program.program_id).map((subject) => (
//                                           <div key={subject.assignment_id} className="border border-gray-200 rounded-lg p-4 bg-white">
//                                             <div className="font-semibold text-gray-900 mb-3 text-md">{subject.subject_code}</div>
//                                             <div className="text-gray-600 mb-3">{subject.subject_name}</div>
//                                             {subject.lecturers && subject.lecturers.length > 0 ? (
//                                               <div className="space-y-2">
//                                                 {subject.lecturers.map((lecturer) => (
//                                                   <div key={lecturer.lecturer_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
//                                                     <div className="flex-1">
//                                                       <div className="font-medium text-gray-900">{lecturer.name}</div>
//                                                       <a href={`mailto:${lecturer.email}`} className="text-blue-600 hover:text-blue-800 text-sm">
//                                                         {lecturer.email}
//                                                       </a>
//                                                     </div>
//                                                     {lecturer.office && (
//                                                       <div className="mt-2 sm:mt-0 sm:ml-4">
//                                                         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                                           <MapPin className="w-3 h-3 mr-1" />
//                                                           {lecturer.office}
//                                                         </span>
//                                                       </div>
//                                                     )}
//                                                   </div>
//                                                 ))}
//                                               </div>
//                                             ) : (
//                                               <p className="text-gray-500 text-sm p-3 bg-gray-50 rounded-lg">
//                                                 No lecturers assigned to this subject.
//                                               </p>
//                                             )}
//                                           </div>
//                                         ))}
//                                       </div>
//                                     ) : (
//                                       <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
//                                         No subject details available for this program.
//                                       </p>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">No Programs Available</h3>
//                       <p className="text-gray-500">No programs have been created for this department yet.</p>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Right Sidebar - Only show for ICT & First Year Foundation */}
//           {isICTFoundationDepartment && (
//             <div className="xl:col-span-1 space-y-6">
//               {/* Administrator Card */}
//               <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200">
//                 <div className="relative h-40 bg-gradient-to-br from-blue-100 to-blue-200">
//                   {administratorInfo.imageUrl ? (
//                     <img 
//                       src={administratorInfo.imageUrl} 
//                       alt={administratorInfo.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-blue-100">
//                       <User className="w-16 h-16 text-blue-400" />
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-6">
//                   <div className="text-center mb-4">
//                     <h3 className="text-xl font-bold text-gray-900 mb-1">{administratorInfo.name}</h3>
//                     <p className="text-blue-600 font-semibold text-sm">{administratorInfo.position}</p>
//                   </div>

//                   <div className="space-y-3 mb-4">
//                     <div className="flex items-center space-x-3 text-sm text-gray-700 bg-blue-50 rounded-lg p-3">
//                       <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                       <div>
//                         <div className="font-semibold">Office Location</div>
//                         <div className="text-blue-700">{administratorInfo.office}</div>
//                         <div className="text-gray-600 text-xs">{administratorInfo.contactLocation}</div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="border-t pt-4">
//                     <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
//                       <Clock className="w-4 h-4 mr-2 text-blue-600" />
//                       Services Provided
//                     </h4>
//                     <ul className="space-y-2 text-sm text-gray-700">
//                       {administratorInfo.services.map((service, index) => (
//                         <li key={index} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
//                           <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
//                           <span className="leading-relaxed">{service}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               {/* HOD Card */}
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
//                 <div className="flex items-center space-x-4 mb-4">
//                   <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
//                     <User className="w-7 h-7 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-lg">{hodInfo.name}</h3>
//                     <p className="text-blue-100 text-sm">{hodInfo.position}</p>
//                   </div>
//                 </div>

//                 <div className="space-y-3 text-sm">
//                   <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                     <MapPin className="w-4 h-4 text-blue-200" />
//                     <div>
//                       <div className="font-medium">Office</div>
//                       <div>{hodInfo.office}</div>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                     <Mail className="w-4 h-4 text-blue-200" />
//                     <div>
//                       <div className="font-medium">Email</div>
//                       <a href={`mailto:${hodInfo.email}`} className="hover:text-blue-200 transition-colors">
//                         {hodInfo.email}
//                       </a>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                     <Phone className="w-4 h-4 text-blue-200" />
//                     <div>
//                       <div className="font-medium">Telephone</div>
//                       <div>{hodInfo.tel}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Mobile Only Cards */}
//           <div className="xl:hidden space-y-6">
//             {/* Quick Information Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                 <Building className="w-5 h-5 mr-2 text-blue-600" />
//                 Department Info
//               </h3>
//               <div className="space-y-3">
//                 {department.building_number && (
//                   <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                     <span className="text-sm font-medium text-gray-600">Building</span>
//                     <span className="text-sm font-semibold text-gray-900">{department.building_number}</span>
//                   </div>
//                 )}
//                 {department.email && (
//                   <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                     <span className="text-sm font-medium text-gray-600">Email</span>
//                     <span className="text-sm font-semibold text-blue-600">{department.email}</span>
//                   </div>
//                 )}
//                 {department.contact_number && (
//                   <div className="flex items-center justify-between py-2">
//                     <span className="text-sm font-medium text-gray-600">Contact</span>
//                     <span className="text-sm font-semibold text-gray-900">{department.contact_number}</span>
//                   </div>
//                 )}
//                 {department.campus_id && (
//                   <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                     <span className="text-sm font-medium text-gray-600">Campus</span>
//                     <span className="text-sm font-semibold text-gray-900">{getCampusName(department.campus_id)}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Lecturers Card - Mobile */}
//             {lecturers.length > 0 && (
//               <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                   <User className="w-5 h-5 mr-2 text-blue-600" />
//                   Department Lecturers ({lecturers.length})
//                 </h3>
//                 <div className="space-y-3">
//                   {lecturers.slice(0, 3).map((lecturer) => (
//                     <div key={lecturer.lecturer_id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                       <div className="flex-1 min-w-0">
//                         <div className="font-medium text-gray-900 text-sm truncate">{lecturer.name}</div>
//                         <div className="text-gray-600 text-xs truncate">{lecturer.position}</div>
//                         <a href={`mailto:${lecturer.email}`} className="text-blue-600 hover:text-blue-800 text-xs">
//                           {lecturer.email}
//                         </a>
//                       </div>
//                     </div>
//                   ))}
//                   {lecturers.length > 3 && (
//                     <div className="text-center text-sm text-gray-500">
//                       +{lecturers.length - 3} more lecturers
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Quick Action Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                 <Download className="w-5 h-5 mr-2 text-blue-600" />
//                 Resources
//               </h3>
//               <p className="text-gray-700 mb-4 text-sm leading-relaxed">
//                 Download the official ICT prospectus for detailed curriculum information.
//               </p>
//               <a
//                 href="https://tut.ac.za/images/prospectus/Part6_ICT_Prospectus.pdf"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 View ICT Prospectus
//               </a>
//             </div>

//             {/* Mobile: Show Administrator and HOD cards only for ICT Foundation */}
//             {isICTFoundationDepartment && (
//               <>
//                 {/* Administrator Card - Mobile */}
//                 <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200">
//                   <div className="relative h-40 bg-gradient-to-br from-blue-100 to-blue-200">
//                     {administratorInfo.imageUrl ? (
//                       <img 
//                         src={administratorInfo.imageUrl} 
//                         alt={administratorInfo.name}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-blue-100">
//                         <User className="w-16 h-16 text-blue-400" />
//                       </div>
//                     )}
//                   </div>

//                   <div className="p-6">
//                     <div className="text-center mb-4">
//                       <h3 className="text-xl font-bold text-gray-900 mb-1">{administratorInfo.name}</h3>
//                       <p className="text-blue-600 font-semibold text-sm">{administratorInfo.position}</p>
//                     </div>

//                     <div className="space-y-3 mb-4">
//                       <div className="flex items-center space-x-3 text-sm text-gray-700 bg-blue-50 rounded-lg p-3">
//                         <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                         <div>
//                           <div className="font-semibold">Office Location</div>
//                           <div className="text-blue-700">{administratorInfo.office}</div>
//                           <div className="text-gray-600 text-xs">{administratorInfo.contactLocation}</div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="border-t pt-4">
//                       <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
//                         <Clock className="w-4 h-4 mr-2 text-blue-600" />
//                         Services Provided
//                       </h4>
//                       <ul className="space-y-2 text-sm text-gray-700">
//                         {administratorInfo.services.map((service, index) => (
//                           <li key={index} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
//                             <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
//                             <span className="leading-relaxed">{service}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

//                 {/* HOD Card - Mobile */}
//                 <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
//                   <div className="flex items-center space-x-4 mb-4">
//                     <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
//                       <User className="w-7 h-7 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-lg">{hodInfo.name}</h3>
//                       <p className="text-blue-100 text-sm">{hodInfo.position}</p>
//                     </div>
//                   </div>

//                   <div className="space-y-3 text-sm">
//                     <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                       <MapPin className="w-4 h-4 text-blue-200" />
//                       <div>
//                         <div className="font-medium">Office</div>
//                         <div>{hodInfo.office}</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                       <Mail className="w-4 h-4 text-blue-200" />
//                       <div>
//                         <div className="font-medium">Email</div>
//                         <a href={`mailto:${hodInfo.email}`} className="hover:text-blue-200 transition-colors">
//                           {hodInfo.email}
//                         </a>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
//                       <Phone className="w-4 h-4 text-blue-200" />
//                       <div>
//                         <div className="font-medium">Telephone</div>
//                         <div>{hodInfo.tel}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default PolDepartmentDetails;


import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Monitor,
  Database,
  Cpu,
  Globe,
  BookOpen,
  User,
  Mail,
  MapPin,
  Phone,
  Clock,
  Download,
  Calendar,
  Building
} from 'lucide-react';
import { Department } from '../types';
import Footer from './Footer';
import adminImage from '../assets/sihle-dlamini.png';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Types based on your database schema
interface Program {
  program_id: number;
  program_code: string;
  program_name: string;
  description?: string;
  duration: string;
  is_active: boolean;
}

interface Lecturer {
  lecturer_id: number;
  name: string;
  email: string;
  office?: string;
  phone?: string;
  position?: string;
  is_active: boolean;
}

interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
  description?: string;
  duration: string;
  nqf_level?: number;
  credits?: number;
  is_active: boolean;
  program_id?: number;
}

interface SubjectAssignment {
  assignment_id: number;
  program_id?: number;
  program_code?: string;
  program_name?: string;
  subject_code: string;
  subject_name: string;
  lecturers?: Lecturer[];
  is_active: boolean;
}

const PolDepartmentDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedProgram, setExpandedProgram] = useState<number | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [subjectAssignments, setSubjectAssignments] = useState<SubjectAssignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get department ID from various possible property names
  const getDepartmentId = () => {
    if (department) {
      const departmentId = department.department_id || department.id;
      console.log('🔍 Getting department ID from department object:', {
        department_id: department.department_id,
        id: department.id,
        result: departmentId
      });
      return departmentId?.toString();
    }
    console.log('🔍 Using ID from params:', id);
    return id;
  };

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
    
    console.log('📍 PolDepartmentDetails mounted:', { 
      id, 
      hasLocationState: !!location.state?.department,
      fromHomepage: location.state?.fromHomepage 
    });
    
    // First try to get from localStorage (from homepage click)
    const savedDept = localStorage.getItem('selectedDepartment');
    if (savedDept) {
      try {
        console.log('📂 Found department in localStorage');
        const parsedDept = JSON.parse(savedDept);
        setDepartment(parsedDept);
        loadDepartmentData(parsedDept);
        localStorage.removeItem('selectedDepartment'); // Clean up
        return;
      } catch (err) {
        console.error('❌ Error parsing saved department:', err);
      }
    }
    
    // Then try location state
    if (location.state?.department) {
      console.log('📂 Using department from location state');
      setDepartment(location.state.department);
      loadDepartmentData(location.state.department);
    } else if (id) {
      // Finally fetch from API
      console.log('📡 Fetching department from API by ID');
      fetchDepartmentById(id);
    } else {
      setError('No department ID provided');
      setLoading(false);
    }
  }, [id, location.state]);

  // Fetch department by ID from API
  const fetchDepartmentById = async (departmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📡 Fetching department by ID: ${departmentId}`);
      
      const response = await fetch(`${API_URL}/api/departments/${departmentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch department`);
      }
      
      const result = await response.json();
      console.log('📦 Department API response:', result);
      
      if (result.success) {
        setDepartment(result.data);
        loadDepartmentData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch department');
      }
    } catch (err) {
      console.error('❌ Error fetching department:', err);
      setError(err instanceof Error ? err.message : 'Failed to load department information');
      setLoading(false);
    }
  };

  const loadDepartmentData = async (dept: Department) => {
    const departmentId = getDepartmentId();
    
    if (!departmentId) {
      console.error('❌ No department ID found in department object:', dept);
      setError('Department ID is missing. Cannot load department data.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Loading data for department ID:', departmentId);

      // Load all data in parallel
      await Promise.all([
        loadPrograms(departmentId),
        loadLecturers(departmentId),
        loadSubjectAssignments(departmentId),
        loadCourses(departmentId)
      ]);

      console.log('✅ All department data loaded successfully');
    } catch (err) {
      console.error('❌ Error loading department data:', err);
      setError('Failed to load department data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async (departmentId: string) => {
    try {
      console.log(`📂 Fetching programs for department ID: ${departmentId}`);
      const response = await fetch(`${API_URL}/api/departments/programs/department/${departmentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Programs data received:', data);
      
      if (data.success) {
        setPrograms(data.data || []);
        console.log(`✅ Loaded ${data.data?.length || 0} programs`);
      } else {
        throw new Error(data.error || 'Failed to fetch programs');
      }
    } catch (err) {
      console.error('❌ Error loading programs:', err);
      setPrograms([]);
    }
  };

  const loadLecturers = async (departmentId: string) => {
    try {
      console.log(`📂 Fetching lecturers for department ID: ${departmentId}`);
      const response = await fetch(`${API_URL}/api/departments/lecturers/department/${departmentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Lecturers data received:', data);
      
      if (data.success) {
        setLecturers(data.data || []);
        console.log(`✅ Loaded ${data.data?.length || 0} lecturers`);
      } else {
        throw new Error(data.error || 'Failed to fetch lecturers');
      }
    } catch (err) {
      console.error('❌ Error loading lecturers:', err);
      setLecturers([]);
    }
  };

  const loadSubjectAssignments = async (departmentId: string) => {
    try {
      console.log(`📂 Fetching subject assignments for department ID: ${departmentId}`);
      const response = await fetch(`${API_URL}/api/departments/subject-assignments/department/${departmentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Subject assignments data received:', data);
      
      if (data.success) {
        setSubjectAssignments(data.data || []);
        console.log(`✅ Loaded ${data.data?.length || 0} subject assignments`);
      } else {
        throw new Error(data.error || 'Failed to fetch subject assignments');
      }
    } catch (err) {
      console.error('❌ Error loading subject assignments:', err);
      setSubjectAssignments([]);
    }
  };

  const loadCourses = async (departmentId: string) => {
    try {
      console.log(`📂 Fetching courses for department ID: ${departmentId}`);
      const response = await fetch(`${API_URL}/api/departments/courses/department/${departmentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Courses data received:', data);
      
      if (data.success) {
        setCourses(data.data || []);
        console.log(`✅ Loaded ${data.data?.length || 0} courses`);
      } else {
        throw new Error(data.error || 'Failed to fetch courses');
      }
    } catch (err) {
      console.error('❌ Error loading courses:', err);
      setCourses([]);
    }
  };

  const getDepartmentIcon = (departmentCode: string) => {
    switch (departmentCode) {
      case 'CS': return Monitor;
      case 'CSE': return Cpu;
      case 'INF': return Database;
      case 'IT': return Globe;
      case 'DFYF': return BookOpen;
      case 'DOA': return BookOpen;
      case 'CSS': return BookOpen;
      default: return BookOpen;
    }
  };

  // Administrator and HOD Information
  const administratorInfo = {
    name: 'Sihle Dlamini',
    position: 'Administrator: ICT 1st Year and Foundation Unit',
    office: '18-G07',
    imageUrl: adminImage,
    services: [
      'Module Additions/Cancellations Signatures',
      'Predicate Enquiries',
      'Re-admissions Processing',
      'January/February 2026 Period Operations'
    ],
    contactLocation: 'Building 18-G07'
  };

  const hodInfo = {
    name: 'Mr MB Phurutsi',
    position: 'Head of Department - Foundation Unit',
    office: '18-G07',
    email: 'PhurutsiMB@tut.ac.za',
    tel: '9796'
  };

  // Check if current department is ICT & First Year Foundation based on department_code
  const isICTFoundationDepartment = department?.department_code === 'DFYF';

  // Get campus name based on campus_id
  const getCampusName = (campusId: number) => {
    const campuses: Record<number, string> = {
      1: 'Soshanguve South',
      2: 'eMalahleni', 
      3: 'Polokwane'
    };
    return campuses[campusId] || 'Unknown Campus';
  };

  // Get subjects for a specific program
  const getSubjectsForProgram = (programId: number): SubjectAssignment[] => {
    return subjectAssignments.filter(sa => sa.program_id === programId);
  };

  // Get all subject assignments for FYF department (no program filter)
  const getFyfSubjectAssignments = (): SubjectAssignment[] => {
    return subjectAssignments;
  };

  const handleBack = () => {
    // Navigate back to homepage or previous page
    if (location.state?.fromHomepage || !document.referrer.includes(window.location.hostname)) {
      navigate('/home');
    } else {
      navigate(-1);
    }
  };

  const IconComponent = department ? getDepartmentIcon(department.department_code || '') : BookOpen;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading department data...</p>
              <p className="text-sm text-gray-500 mt-2">Department ID: {getDepartmentId() || 'Not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">Error Loading Department</div>
              <p className="text-gray-600 mb-4">{error || 'Department not found'}</p>
              <div className="text-sm text-gray-500 mb-4">
                Department ID: {getDepartmentId() || 'Not found'}
              </div>
              <button
                onClick={() => {
                  if (department) {
                    loadDepartmentData(department);
                  } else if (id) {
                    fetchDepartmentById(id);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
              <button
                onClick={handleBack}
                className="ml-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <div className={`flex flex-col lg:flex-row lg:items-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-start lg:items-center mb-4 lg:mb-0">
              <div className="p-4 bg-blue-100 rounded-xl mr-6 shadow-md">
                <IconComponent className="w-12 h-12 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                  {department.department_name || department.name}
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-4xl">
                  {department.description || `Department of ${department.department_name || department.name} at ${getCampusName(department.campus_id)} Campus`}
                </p>
                {department.department_code && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mt-2">
                    Code: {department.department_code}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className={`grid grid-cols-1 ${isICTFoundationDepartment ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-6 lg:gap-8`}>
          {/* Left Sidebar - Desktop only */}
          <div className="xl:col-span-1 space-y-6 hidden xl:block">
            {/* Quick Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Department Info
              </h3>
              <div className="space-y-3">
                {department.building_number && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Building</span>
                    <span className="text-sm font-semibold text-gray-900">{department.building_number}</span>
                  </div>
                )}
                {department.email && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Email</span>
                    <span className="text-sm font-semibold text-blue-600">{department.email}</span>
                  </div>
                )}
                {department.contact_number && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-600">Contact</span>
                    <span className="text-sm font-semibold text-gray-900">{department.contact_number}</span>
                  </div>
                )}
                {department.campus_id && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Campus</span>
                    <span className="text-sm font-semibold text-gray-900">{getCampusName(department.campus_id)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lecturers Card */}
            {lecturers.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Department Lecturers ({lecturers.length})
                </h3>
                <div className="space-y-3">
                  {lecturers.slice(0, 3).map((lecturer) => (
                    <div key={lecturer.lecturer_id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">{lecturer.name}</div>
                        <div className="text-gray-600 text-xs truncate">{lecturer.position}</div>
                        <a href={`mailto:${lecturer.email}`} className="text-blue-600 hover:text-blue-800 text-xs">
                          {lecturer.email}
                        </a>
                      </div>
                    </div>
                  ))}
                  {lecturers.length > 3 && (
                    <div className="text-center text-sm text-gray-500">
                      +{lecturers.length - 3} more lecturers
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Action Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2 text-blue-600" />
                Resources
              </h3>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                Download the official ICT prospectus for detailed curriculum information.
              </p>
              <a
                href="https://tut.ac.za/images/prospectus/Part6_ICT_Prospectus.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                View ICT Prospectus
              </a>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`${isICTFoundationDepartment ? 'xl:col-span-2' : 'xl:col-span-2'}`}>
            {/* Programs Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100">
              {/* FYF Department */}
              {isICTFoundationDepartment ? (
                <>
                  <div className="flex items-center mb-6">
                    <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Subjects & Lecturers</h2>
                  </div>
                  
                  {subjectAssignments.length > 0 ? (
                    <div className="space-y-6">
                      {getFyfSubjectAssignments().map((subject) => (
                        <div key={subject.assignment_id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-300">
                          <h6 className="font-semibold text-gray-900 text-lg mb-3">{subject.subject_code}</h6>
                          <p className="text-gray-600 mb-3">{subject.subject_name}</p>
                          {subject.lecturers && subject.lecturers.length > 0 ? (
                            <ul className="space-y-2">
                              {subject.lecturers.map((lecturer) => (
                                <li key={lecturer.lecturer_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <span className="font-medium text-gray-900 block">{lecturer.name}</span>
                                    <a href={`mailto:${lecturer.email}`} className="text-blue-600 hover:text-blue-800 text-sm">
                                      {lecturer.email}
                                    </a>
                                  </div>
                                  {lecturer.office && (
                                    <div className="mt-2 sm:mt-0 sm:ml-4">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        Office: {lecturer.office}
                                      </span>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 text-sm p-3 bg-gray-50 rounded-lg">
                              No lecturers assigned to this subject.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Available</h3>
                      <p className="text-gray-500">No subject assignments have been created for this department yet.</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center mb-6">
                    <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Available Programs & Courses</h2>
                  </div>
                  
                  {/* Department Courses from Database */}
                  {courses.length > 0 && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Courses ({courses.length})</h3>
                      <div className="grid gap-4">
                        {courses.map((course) => (
                          <div key={course.course_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{course.course_code}</div>
                              <div className="text-gray-700">{course.course_name}</div>
                              {course.description && (
                                <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                              )}
                            </div>
                            {course.duration && (
                              <div className="mt-2 sm:mt-0">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  {course.duration}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Program Cards */}
                  {programs.length > 0 ? (
                    <div className="space-y-4">
                      {programs.map((program) => (
                        <div 
                          key={program.program_id} 
                          className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg ${
                            expandedProgram === program.program_id ? 'bg-blue-50 border-blue-300 shadow-md' : 'bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                              <div className="flex-1 mb-4 lg:mb-0">
                                <div className="text-sm text-gray-500 font-medium mb-1">Program Code</div>
                                <div className="text-xl font-bold text-gray-900 mb-2">{program.program_code}</div>
                                <div className="text-gray-700 mb-2">{program.program_name}</div>
                                {program.description && (
                                  <p className="text-gray-600 text-sm mt-1">{program.description}</p>
                                )}
                              </div>
                              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center gap-4">
                                <div className="text-right">
                                  <div className="text-sm text-gray-500 font-medium">Duration</div>
                                  <div className="font-semibold text-gray-900">{program.duration}</div>
                                </div>
                                <button
                                  className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 min-w-[120px]"
                                  onClick={() => setExpandedProgram(expandedProgram === program.program_id ? null : program.program_id)}
                                >
                                  {expandedProgram === program.program_id ? 'Collapse' : 'View Details'}
                                </button>
                              </div>
                            </div>

                            {expandedProgram === program.program_id && (
                              <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="grid gap-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">Program Overview</h4>
                                    <p className="text-gray-700 mb-3">{program.description || program.program_name}</p>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Clock className="w-4 h-4 mr-2" />
                                      Duration: {program.duration}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">Subjects & Lecturers</h4>
                                    {getSubjectsForProgram(program.program_id).length > 0 ? (
                                      <div className="space-y-4">
                                        {getSubjectsForProgram(program.program_id).map((subject) => (
                                          <div key={subject.assignment_id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                            <div className="font-semibold text-gray-900 mb-3 text-md">{subject.subject_code}</div>
                                            <div className="text-gray-600 mb-3">{subject.subject_name}</div>
                                            {subject.lecturers && subject.lecturers.length > 0 ? (
                                              <div className="space-y-2">
                                                {subject.lecturers.map((lecturer) => (
                                                  <div key={lecturer.lecturer_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                      <div className="font-medium text-gray-900">{lecturer.name}</div>
                                                      <a href={`mailto:${lecturer.email}`} className="text-blue-600 hover:text-blue-800 text-sm">
                                                        {lecturer.email}
                                                      </a>
                                                    </div>
                                                    {lecturer.office && (
                                                      <div className="mt-2 sm:mt-0 sm:ml-4">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                          <MapPin className="w-3 h-3 mr-1" />
                                                          {lecturer.office}
                                                        </span>
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                No subject details available for this program.
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        No subject details available for this program.
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Programs Available</h3>
                      <p className="text-gray-500">No programs have been created for this department yet.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Sidebar - Only show for ICT & First Year Foundation */}
          {isICTFoundationDepartment && (
            <div className="xl:col-span-1 space-y-6">
              {/* Administrator Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200">
                <div className="relative h-40 bg-gradient-to-br from-blue-100 to-blue-200">
                  {administratorInfo.imageUrl ? (
                    <img 
                      src={administratorInfo.imageUrl} 
                      alt={administratorInfo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <User className="w-16 h-16 text-blue-400" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{administratorInfo.name}</h3>
                    <p className="text-blue-600 font-semibold text-sm">{administratorInfo.position}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-3 text-sm text-gray-700 bg-blue-50 rounded-lg p-3">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">Office Location</div>
                        <div className="text-blue-700">{administratorInfo.office}</div>
                        <div className="text-gray-600 text-xs">{administratorInfo.contactLocation}</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      Services Provided
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {administratorInfo.services.map((service, index) => (
                        <li key={index} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span className="leading-relaxed">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* HOD Card */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{hodInfo.name}</h3>
                    <p className="text-blue-100 text-sm">{hodInfo.position}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                    <MapPin className="w-4 h-4 text-blue-200" />
                    <div>
                      <div className="font-medium">Office</div>
                      <div>{hodInfo.office}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                    <Mail className="w-4 h-4 text-blue-200" />
                    <div>
                      <div className="font-medium">Email</div>
                      <a href={`mailto:${hodInfo.email}`} className="hover:text-blue-200 transition-colors">
                        {hodInfo.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                    <Phone className="w-4 h-4 text-blue-200" />
                    <div>
                      <div className="font-medium">Telephone</div>
                      <div>{hodInfo.tel}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Only Cards */}
          <div className="xl:hidden space-y-6">
            {/* Quick Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Department Info
              </h3>
              <div className="space-y-3">
                {department.building_number && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Building</span>
                    <span className="text-sm font-semibold text-gray-900">{department.building_number}</span>
                  </div>
                )}
                {department.email && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Email</span>
                    <span className="text-sm font-semibold text-blue-600">{department.email}</span>
                  </div>
                )}
                {department.contact_number && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-600">Contact</span>
                    <span className="text-sm font-semibold text-gray-900">{department.contact_number}</span>
                  </div>
                )}
                {department.campus_id && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Campus</span>
                    <span className="text-sm font-semibold text-gray-900">{getCampusName(department.campus_id)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lecturers Card - Mobile */}
            {lecturers.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Department Lecturers ({lecturers.length})
                </h3>
                <div className="space-y-3">
                  {lecturers.slice(0, 3).map((lecturer) => (
                    <div key={lecturer.lecturer_id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">{lecturer.name}</div>
                        <div className="text-gray-600 text-xs truncate">{lecturer.position}</div>
                        <a href={`mailto:${lecturer.email}`} className="text-blue-600 hover:text-blue-800 text-xs">
                          {lecturer.email}
                        </a>
                      </div>
                    </div>
                  ))}
                  {lecturers.length > 3 && (
                    <div className="text-center text-sm text-gray-500">
                      +{lecturers.length - 3} more lecturers
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Action Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2 text-blue-600" />
                Resources
              </h3>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                Download the official ICT prospectus for detailed curriculum information.
              </p>
              <a
                href="https://tut.ac.za/images/prospectus/Part6_ICT_Prospectus.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                View ICT Prospectus
              </a>
            </div>

            {/* Mobile: Show Administrator and HOD cards only for ICT Foundation */}
            {isICTFoundationDepartment && (
              <>
                {/* Administrator Card - Mobile */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200">
                  <div className="relative h-40 bg-gradient-to-br from-blue-100 to-blue-200">
                    {administratorInfo.imageUrl ? (
                      <img 
                        src={administratorInfo.imageUrl} 
                        alt={administratorInfo.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100">
                        <User className="w-16 h-16 text-blue-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{administratorInfo.name}</h3>
                      <p className="text-blue-600 font-semibold text-sm">{administratorInfo.position}</p>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-3 text-sm text-gray-700 bg-blue-50 rounded-lg p-3">
                        <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Office Location</div>
                          <div className="text-blue-700">{administratorInfo.office}</div>
                          <div className="text-gray-600 text-xs">{administratorInfo.contactLocation}</div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-600" />
                        Services Provided
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {administratorInfo.services.map((service, index) => (
                          <li key={index} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="leading-relaxed">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* HOD Card - Mobile */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{hodInfo.name}</h3>
                      <p className="text-blue-100 text-sm">{hodInfo.position}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                      <MapPin className="w-4 h-4 text-blue-200" />
                      <div>
                        <div className="font-medium">Office</div>
                        <div>{hodInfo.office}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                      <Mail className="w-4 h-4 text-blue-200" />
                      <div>
                        <div className="font-medium">Email</div>
                        <a href={`mailto:${hodInfo.email}`} className="hover:text-blue-200 transition-colors">
                          {hodInfo.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                      <Phone className="w-4 h-4 text-blue-200" />
                      <div>
                        <div className="font-medium">Telephone</div>
                        <div>{hodInfo.tel}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PolDepartmentDetails;