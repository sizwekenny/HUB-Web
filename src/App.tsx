import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import DepartmentDetails from './components/DepartmentDetails';
import ServiceDetails from './components/ServiceDetails';
import UserManual from './components/UserManual';
import Navigation from './components/Navigation';
import AdminLogin from './components/Admin/AdminLogin.tsx';
import AdminDashboard from './components/Admin/AdminDashboard.tsx';
import { Department, Service } from './types';
import LandingPage from './components/LandingPage';
import EmaHomePage from './components/Emalahleni/EmaHomePage';
import EmaDepartmentDetails from './components/Emalahleni/EmaDepartmentDetails';
import EmaNavigation from './components/Emalahleni/EmaNavigation';
import EmaServiceDetails from './components/Emalahleni/EmaServiceDetails';
import EmaUserManual from './components/Emalahleni/emaUserManual';
import PolHomePage from './components/Polokwane/PolHomePage';
import PolDepartmentDetails from './components/Polokwane/PolDepartmentDetails';
import PolServiceDetails from './components/Polokwane/PolServiceDetails';

const departments: Department[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    codes: ['DPMCF0', 'DPMC20', 'ADMC20', 'DPRSF0', 'DPRS20', 'ADRS20'],
    description: 'Comprehensive computer science programs.',
    buildingNumber: 'BUILDING 12 ROOM 132 AND 134',
    email: 'mollymoche@tut.ac.za',
    contactNumber: '+27 12 382 9938'
  }
  ,
  {
    id: 'cse',
    name: 'Computer Systems Engineering',
    codes: ['DPYEF0', 'DPYE20', 'ADYE20'],
    description: 'Engineering-focused computer systems programs.',
    buildingNumber: 'BUILDING 12 ROOM 205',
    email: 'matimake@tut.ac.za',
    contactNumber: '+27 12 382 9812'
  }
  ,
  {
    id: 'informatics',
    name: 'Informatics',
    codes: ['DPIFF0', 'DPIF20', 'ADIF20'],
    description: 'Information systems and data management programs.',
    buildingNumber: 'BUILDING 5 2ND FLOOR',
    email: 'vanrooyenm@tut.ac.za',
    contactNumber: '+27 12 382 9027'
  }
  ,
  {
    id: 'it',
    name: 'Information Technology',
    codes: ['DPITF0', 'DPIT20', 'ADIT21'],
    description: 'Practical IT programs focusing on technology and systems.',
    buildingNumber: 'BUILDING 12 ROOM 162',
    email: 'chokoepn@tut.ac.za',
    contactNumber: '+27 12 382 9041'
  }

];
// Emalahleni-specific departments
const emaDepartments: Department[] = [
  {
    id: 'ema-cs',
    name: 'Computer Science',
    codes: ['DPMCF0', 'DPMC20', 'ADMC20',],
    description: 'Comprehensive computer science programs.',
    buildingNumber: 'BUILDING 14',
    email: 'MakhubelaJK@tut.ac.za',
    contactNumber: 'Not Available yet'
  },

];
// Polokwane-specific departments
const polDepartments: Department[] = [
  {
    id: 'pol-cs',
    name: 'Computer Science',
    codes: ['DPMCF0', 'DPMC20', 'ADMC20',],
    description: 'Comprehensive computer science programs.',
    buildingNumber: 'BUILDING 1-G247',
    email: 'RankoanaTS@tut.ac.za',
    contactNumber: 'Not Available yet'
  },

];
const polServices: Service[] = [
  {
    id: 'pol-nsfas-enquiries',
    title: 'nsfas-enquiries',
    category: 'Senior Students',
    description: 'Registration support for Polokwane students.',
    details: 'Get assistance with course registration at Polokwane Campus.'
  },
  {
    id: 'pol-subject-additions-and-cancellations',
    title: 'Subject additions and cancellations',
    category: 'Senior Students',
    description: 'Access to Polokwane ICT labs and resources.',
    details: 'Lab opening hours, resources and booking process.'
  },
   {
    id: 'pol-mark-enquiries',
    title: 'Mark Enquiries/Predicate Enquiries',
    category: 'Senior Students',
    description: 'Get assistance with mark-related queries and academic predicates.',
    details: 'Get assistance with marks and predicate enquiries.',
    statusLink: 'https://os.tut.ac.za/ExamsLegacy/'
  },
  {
    id: 'pol-academic-exclusions',
    title: 'Academic Exclusions',
    category: 'Senior Students',
    description: 'Information and appeals process for academic exclusions.',
    details: `Appeal process and information for academic exclusions.`,
    statusLink: 'https://ec.tut.ac.za/'
  },
  {
    id: 'pol-financial-exclusion',
    title: 'Financial Exclusion',
    category: 'Senior Students',
    description: 'Assistance with financial exclusion matters.',
    details: 'Resolve financial exclusion issues. ',
    statusLink: 'https://ienabler.tut.ac.za/pls/prodi41/w99pkg.mi_login'
  },
  {
    id: 'pol-change-of-course',
    title: 'Change of Course',
    category: 'Senior Students',
    description: 'Process for changing your academic course (not admission related).',
    details: 'Change your course if you were registered the previous year.',
    statusLink: 'https://ec.tut.ac.za/'
  },
  {
    id: 'pol-admissions',
    title: 'Admissions',
    category: 'Newcomer Students',
    description: 'Information about application processes and deadlines.',
    details: 'Application information and deadlines.',
    statusLink: 'https://applications-prod.tut.ac.za/'
  },
  {
    id: 'pol-bursaries',
    title: 'Bursaries',
    category: 'All Students',
    description: 'Financial assistance and bursary information.',
    details: 'Financial assistance and bursary information.'
  },
  {
    id: 'pol-timetables',
    title: 'Class & Test Timetables',
    category: 'All Students',
    description: 'Access your class and test schedules.',
    details: 'Get your class and test schedules.',
    statusLink: 'https://www.tut.ac.za/timetables'
  },
  {
    id: 'pol-nO WALK-INS Policy',
    title: 'NO WALK-INS Policy',
    category: 'Newcomer Students',
    description: 'Important policy for new applicants.',
    details: 'Important policy for new applicants.',
    statusLink: 'https://applications-prod.tut.ac.za/'
  },
  {
    id: 'pol-intercampus Transfers',
    title: 'Intercampus Transfers',
    category: 'Senior Students',
    description: 'Transfers between TUT campuses (Computer Science students only)',
    details: 'Transfers between TUT campuses (Computer Science students only)',
    statusLink: 'https://ec.tut.ac.za/'
  },
  {
    id: 'pol-re-admission',
    title: 'Re-admission',
    category: 'Senior Students',
    description: 'Re-admission after break in studies or exclusion.',
    details: 'Re-admission after break in studies or exclusion.',
    statusLink: 'https://ienabler.tut.ac.za/pls/prodi41/w99pkg.mi_login'
  },
  {
    id: 'pol-special & Exit Examinations',
    title: 'Special & Exit Examinations',
    category: 'Senior Students',
    description: 'Apply for special or exit examinations',
    details: 'Apply for special or exit examinations',
    statusLink: 'https://www.tut.ac.za/exit-examination'
  },
  {
    id: 'pol-probation',
    title: 'Probation',
    category: 'Senior Students',
    description: 'Handle probation notifications and requirements',
    details: 'Handle probation notifications and requirementss'
  },
  {
    id: 'pol-other Admission Enquiries',
    title: 'Other Admission Enquiries',
    category: 'Newcomer Students',
    description: 'Get help with application status, documentation, and campus changes.',
    details: 'Get help with application status, documentation, and campus changes.'
  },
  {
    id: 'pol-residence Administration',
    title: 'Residence Administration',
    category: 'All Students',
    description: 'Student accommodation and residence matters.',
    details: 'Student accommodation and residence matters.'
  },
  {
    id: 'pol-recognition / Examption (CAT)',
    title: 'Recognition / Examption (CAT)',
    category: 'All Students',
    description: 'Get Accumulation and Transfer for previous qualifications',
    details: 'Get Accumulation and Transfer for previous qualifications'

  }
  ,
  {
    id: 'pol-WIL For Compuer Science',
    title: 'WIL For Compuer Science',
    category: 'Senior Students',
    description: 'Get your WIL placement and requirements.',
    details: 'Student must have completed all their theory modules and must be in their final year of study.Student is responsible for finding WIL Placement (First get a WIL letter/recommendation letter from the department) and After finding placement, get an employee/placement letter from the organization/company in which you’re placed.',
    statusLink: 'https://wil.tut.ac.za/'
  }
  ,
  {
    id: 'pol-mentorship',
    title: 'Mentorship program',
    category: 'All Students',
    description: 'Mentorship program for guidance and support.',
    details: 'Mentorship program for guidance and support.'

  },
  {
    id: 'pol-tutoring',
    title: 'Tutoring program',
    category: 'All Students',
    description: 'Tutoring program for academic support.',
    details: 'Tutoring program for academic support.'

  }
];
const services: Service[] = [
  {
    id: 'mark-enquiries',
    title: 'Mark Enquiries/Predicate Enquiries',
    category: 'Senior Students',
    description: 'Get assistance with mark-related queries and academic predicates.',
    details: 'Get assistance with marks and predicate enquiries.',
    statusLink: 'https://os.tut.ac.za/ExamsLegacy/'
  },
  {
    id: 'academic-exclusions',
    title: 'Academic Exclusions',
    category: 'Senior Students',
    description: 'Information and appeals process for academic exclusions.',
    details: `Appeal process and information for academic exclusions.`,
    statusLink: 'https://ec.tut.ac.za/'
  },
  {
    id: 'financial-exclusion',
    title: 'Financial Exclusion',
    category: 'Senior Students',
    description: 'Assistance with financial exclusion matters.',
    details: 'Resolve financial exclusion issues. ',
    statusLink: 'https://ienabler.tut.ac.za/pls/prodi41/w99pkg.mi_login'
  },
  {
    id: 'nsfas-enquiries',
    title: 'NSFAS Enquiries',
    category: 'Senior Students',
    description: 'National Student Financial Aid Scheme support and information.',
    details: 'NSFAS application and funding enquiries.',
    statusLink: 'https://www.nsfas.org.za/content/'
  },
  {
    id: 'change-of-course',
    title: 'Change of Course',
    category: 'Senior Students',
    description: 'Process for changing your academic course (not admission related).',
    details: 'Change your course if you were registered the previous year.',
    statusLink: 'https://ec.tut.ac.za/'
  },
  {
    id: 'admissions',
    title: 'Admissions',
    category: 'Newcomer Students',
    description: 'Information about application processes and deadlines.',
    details: 'Application information and deadlines.',
    statusLink: 'https://applications-prod.tut.ac.za/'
  },
  {
    id: 'bursaries',
    title: 'Bursaries',
    category: 'All Students',
    description: 'Financial assistance and bursary information.',
    details: 'Financial assistance and bursary information.'
  },
  {
    id: 'timetables',
    title: 'Class & Test Timetables',
    category: 'All Students',
    description: 'Access your class and test schedules.',
    details: 'Get your class and test schedules.',
    statusLink: 'https://www.tut.ac.za/timetables'
  },
  {
    id: 'Subject additions and cancellations',
    title: 'Subject additions and cancellations',
    category: 'Senior Students',
    description: 'Information about adding or cancelling subjects.',
    details: 'Add or cancel modules from your registration',
    statusLink: 'https://ienabler.tut.ac.za/pls/prodi41/w99pkg.mi_login'
  },
  {
    id: 'NO WALK-INS Policy',
    title: 'NO WALK-INS Policy',
    category: 'Newcomer Students',
    description: 'Important policy for new applicants.',
    details: 'Important policy for new applicants.',
    statusLink: 'https://applications-prod.tut.ac.za/'
  },
  {
    id: 'Intercampus Transfers',
    title: 'Intercampus Transfers',
    category: 'Senior Students',
    description: 'Transfers between TUT campuses (Computer Science students only)',
    details: 'Transfers between TUT campuses (Computer Science students only)',
    statusLink: 'https://ec.tut.ac.za/'
  },
  {
    id: 'Re-admission',
    title: 'Re-admission',
    category: 'Senior Students',
    description: 'Re-admission after break in studies or exclusion.',
    details: 'Re-admission after break in studies or exclusion.',
    statusLink: 'https://ienabler.tut.ac.za/pls/prodi41/w99pkg.mi_login'
  },
  {
    id: 'Special & Exit Examinations',
    title: 'Special & Exit Examinations',
    category: 'Senior Students',
    description: 'Apply for special or exit examinations',
    details: 'Apply for special or exit examinations',
    statusLink: 'https://www.tut.ac.za/exit-examination'
  },
  {
    id: 'Probation',
    title: 'Probation',
    category: 'Senior Students',
    description: 'Handle probation notifications and requirements',
    details: 'Handle probation notifications and requirementss'
  },
  {
    id: 'Other Admission Enquiries',
    title: 'Other Admission Enquiries',
    category: 'Newcomer Students',
    description: 'Get help with application status, documentation, and campus changes.',
    details: 'Get help with application status, documentation, and campus changes.'
  },
  {
    id: 'Residence Administration',
    title: 'Residence Administration',
    category: 'All Students',
    description: 'Student accommodation and residence matters.',
    details: 'Student accommodation and residence matters.'
  },
  {
    id: 'Recognition / Examption (CAT)',
    title: 'Recognition / Examption (CAT)',
    category: 'All Students',
    description: 'Get Accumulation and Transfer for previous qualifications',
    details: 'Get Accumulation and Transfer for previous qualifications'

  }
  ,
  {
    id: 'WIL For Compuer Science',
    title: 'WIL For Compuer Science',
    category: 'Senior Students',
    description: 'Get your WIL placement and requirements.',
    details: 'Get your WIL placement and requirements.'

  }
  ,
  {
    id: 'Mentorship',
    title: 'Mentorship program',
    category: 'All Students',
    description: 'Mentorship program for guidance and support.',
    details: 'Mentorship program for guidance and support.'

  },
  {
    id: 'Tutoring',
    title: 'Tutoring program',
    category: 'All Students',
    description: 'Tutoring program for academic support.',
    details: 'Tutoring program for academic support.'

  }
  ,
  {
    id: 'WIL For Informatics',
    title: 'WIL For Informatics',
    category: 'Senior Students',
    description: 'Get your WIL placement and requirements.',
    details: 'Get your WIL placement and requirements.'

  },
  {
    id: 'WIL For Information Technology',
    title: 'WIL For Information Technology',
    category: 'Senior Students',
    description: 'Get your WIL placement and requirements.',
    details: 'Get your WIL placement and requirements.'

  }
];

const emaServices: Service[] = [
  {
    id: 'mark-enquiries',
    title: 'Mark Enquiries/Predicate Enquiries',
    category: 'Senior Students',
    description: 'Get assistance with mark-related queries and academic predicates.',
    details: 'Get assistance with marks and predicate enquiries.',
    statusLink: 'https://os.tut.ac.za/ExamsLegacy/'
  },
  {
    id: 'academicc-exclusions',
    title: 'Academic Exclusions',
    category: 'Senior Students',
    description: 'Information and appeals process for academic exclusions.',
    details: `Appeal process and information for academic exclusions.`,
    statusLink: 'https://ec.tut.ac.za/'
  },
  {
    id: 'financial-exclusion',
    title: 'Financial Exclusion',
    category: 'Senior Students',
    description: 'Assistance with financial exclusion matters.',
    details: 'Resolve financial exclusion issues. ',
    statusLink: 'https://ienabler.tut.ac.za/pls/prodi41/w99pkg.mi_login'
  },
  {
    id: 'nsfas-enquiries',
    title: 'NSFAS Enquiries',
    category: 'Senior Students',
    description: 'National Student Financial Aid Scheme support and information.',
    details: 'NSFAS application and funding enquiries.',
    statusLink: 'https://www.nsfas.org.za/content/'
  },
  {
    id: 'change-of-course',
    title: 'Change of Course',
    category: 'Senior Students',
    description: 'Process for changing your academic course (not admission related).',
    details: 'Change your course if you were registered the previous year.',
    statusLink: 'https://ec.tut.ac.za/'
  },
  {
    id: 'admission',
    title: 'Admissions',
    category: 'Newcomer Students',
    description: 'Information about application processes and deadlines.',
    details: 'Application information and deadlines.',
    statusLink: 'https://applications-prod.tut.ac.za/'
  },
  {
    id: 'bursaries',
    title: 'Bursaries',
    category: 'All Students',
    description: 'Financial assistance and bursary information.',
    details: 'Financial assistance and bursary information.'
  },
  {
    id: 'class timetables',
    title: 'Class & Test Timetables',
    category: 'All Students',
    description: 'Access your class and test schedules.',
    details: 'Get your class and test schedules.',
    statusLink: 'https://www.tut.ac.za/timetables'
  },
  {
    id: 'Subject additions and cancellations',
    title: 'Subject additions and cancellations',
    category: 'Senior Students',
    description: 'Information about adding or cancelling subjects.',
    details: 'Add or cancel modules from your registration',
    statusLink: 'https://ienabler.tut.ac.za/pls/prodi41/w99pkg.mi_login'
  },
  {
    id: 'no-walk-ins',
    title: 'NO WALK-INS Policy',
    category: 'Newcomer Students',
    description: 'Important policy for new applicants.',
    details: 'Important policy for new applicants.',
    statusLink: 'https://applications-prod.tut.ac.za/'
  },
  {
    id: 'Intercampus Transfers',
    title: 'Intercampus Transfers',
    category: 'Senior Students',
    description: 'Transfers between TUT campuses (Computer Science students only)',
    details: 'Transfers between TUT campuses (Computer Science students only)',
    statusLink: 'https://ec.tut.ac.za/'
  },
  {
    id: 'Re-admission',
    title: 'Re-admission',
    category: 'Senior Students',
    description: 'Re-admission after break in studies or exclusion.',
    details: 'Re-admission after break in studies or exclusion.',
    statusLink: 'https://ienabler.tut.ac.za/pls/prodi41/w99pkg.mi_login'
  },
  {
    id: 'Special & Exit Examinations',
    title: 'Special & Exit Examinations',
    category: 'Senior Students',
    description: 'Apply for special or exit examinations',
    details: 'Apply for special or exit examinations',
    statusLink: 'https://www.tut.ac.za/exit-examination'
  },
  {
    id: 'Probation',
    title: 'Probation',
    category: 'Senior Students',
    description: 'Handle probation notifications and requirements',
    details: 'Handle probation notifications and requirementss'
  },
  {
    id: 'ema Other Admissions Enquiries',
    title: 'Other Admission Enquiries',
    category: 'Newcomer Students',
    description: 'Get help with application status, documentation, and campus changes.',
    details: 'Get help with application status, documentation, and campus changes.'
  },
  {
    id: 'Residence Administration',
    title: 'Residence Administration',
    category: 'All Students',
    description: 'Student accommodation and residence matters.',
    details: 'Student accommodation and residence matters.'
  },
  {
    id: 'Recognition / Examption (CAT)',
    title: 'Recognition / Examption (CAT)',
    category: 'All Students',
    description: 'Get Accumulation and Transfer for previous qualifications',
    details: 'Get Accumulation and Transfer for previous qualifications'

  },
  {
    id: 'WIL For Compuer Science',
    title: 'WIL For Compuer Science',
    category: 'Senior Students',
    description: 'Get your WIL placement and requirements.',
    details: 'Student must have completed all their theory modules and must be in their final year of study.Student is responsible for finding WIL Placement (First get a WIL letter/recommendation letter from the department) and After finding placement, get an employee/placement letter from the organization/company in which you’re placed.'
  }
];
function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'home' | 'department' | 'service' | 'manual' | 'adminLogin' | 'adminDashboard' | 'emaHome' | 'emaService' | 'emaManual' | 'polHome' | 'polManual'>('landing');

  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'senior' | 'newcomer'>('all');
  const [isEmaService, setIsEmaService] = useState(false); 



  const navigate = useNavigate();
  const location = useLocation();


  const viewPath: Record<string,string> = {
    landing: '/',
    home: '/home',
    adminLogin: '/admin/login',
    adminDashboard: '/admin/dashboard',
    emaHome: '/ema',
    polHome: '/pol'
  };

  const updateView = (view: typeof currentView) => {
    setCurrentView(view);
    const p = viewPath[view];
    if (p && location.pathname !== p) navigate(p, { replace: false });
  };

  // Regular Home navigation
  const handleDepartmentClick = (department: Department) => {
    setSelectedDepartment(department);
    setCurrentView('department');
  };

  const handleServiceClick = (service: Service, isEma: boolean = false) => {
    setSelectedService(service);
    setIsEmaService(isEma);
    setCurrentView(isEma ? 'emaService' : 'service');
  };


  const handleBackToHome = () => {
    updateView('home');
    setSelectedDepartment(null);
    setSelectedService(null);
    setIsEmaService(false);
  };

  // Emalahleni-specific back handler
  const handleBackToEmaHome = () => {
    updateView('emaHome');
    setSelectedDepartment(null);
    setSelectedService(null);
    setIsEmaService(false);
  };

  // Sync state from URL path (back/forward navigation)
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' && currentView !== 'landing') setCurrentView('landing');
    else if (path === '/home' && currentView !== 'home') setCurrentView('home');
    else if (path === '/admin/login' && currentView !== 'adminLogin') setCurrentView('adminLogin');
    else if (path === '/admin/dashboard' && currentView !== 'adminDashboard') setCurrentView('adminDashboard');
    else if (path === '/ema' && currentView !== 'emaHome') setCurrentView('emaHome');
    else if (path === '/pol' && currentView !== 'polHome') setCurrentView('polHome');
  }, [location.pathname]);

  const handleLogin = () => { updateView('adminLogin'); };

  const handleAdminLoginSuccess = () => { updateView('adminDashboard'); };

  const handleAdminLogout = () => { updateView('landing'); };

  const handleBackToLanding = () => {
    updateView('landing');
    setSelectedDepartment(null);
    setSelectedService(null);
    setIsEmaService(false);
  };
  const handleBackToPolHome = () => {
    updateView('polHome');
    setSelectedDepartment(null);
    setSelectedService(null);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Declarative routes (primary entry points) */}
      <Routes>
        <Route path="/" element={null} />
        <Route path="/home" element={null} />
        <Route path="/admin/login" element={null} />
        <Route path="/admin/dashboard" element={null} />
        <Route path="/ema" element={null} />
        <Route path="/pol" element={null} />
        {/* Fallback redirect for unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Navigation */}
      {!['landing', 'adminLogin', 'adminDashboard'].includes(currentView) && (
        currentView.startsWith('ema')
          ? (
            <EmaNavigation
              currentView={currentView}
              onNavigate={(view) => setCurrentView(view as any)}
              departments={emaDepartments}
              services={emaServices}
              onFilterChange={(f) => setSelectedFilter(f)}
            />
          ) : (
            <Navigation
              currentView={currentView}
              onNavigate={(view) => setCurrentView(view)}
              departments={departments}
              services={services}
              onFilterChange={(f) => setSelectedFilter(f)}
            />
          )
      )}


      {/* Landing Page */}
  {currentView === 'landing' && (
        <LandingPage
          onSelect={(page: 'home' | 'manual' | 'emaHome' | 'polHome') => updateView(page)}
          onLogin={handleLogin}
        />
      )}



      {/* Admin Login */}
  {currentView === 'adminLogin' && (
        <AdminLogin
          onBack={handleBackToLanding}
          onLoginSuccess={handleAdminLoginSuccess}
        />
      )}

      {/* Admin Dashboard */}
  {currentView === 'adminDashboard' && (
        <AdminDashboard
          onLogout={handleAdminLogout}
          onBackToHome={() => updateView('landing')}
        />
      )}

      {/* Main Home Page */}
      {currentView === 'home' && (
        <HomePage
          departments={departments}
          services={services}
          selectedFilter={selectedFilter}
          onDepartmentClick={handleDepartmentClick}
          onServiceClick={(service) => handleServiceClick(service, false)}
        />
      )}


      {/* Department View */}
      {currentView === 'department' && selectedDepartment && selectedDepartment.id.startsWith('ema-') && (
        <EmaDepartmentDetails
          department={selectedDepartment}
          onBack={handleBackToEmaHome}
        />
      )}

     {currentView === 'department' && selectedDepartment && selectedDepartment.id.startsWith('pol-') && (
  <PolDepartmentDetails
    department={selectedDepartment}
    onBack={handleBackToPolHome}
  />
)}

      {currentView === 'department' && selectedDepartment && !selectedDepartment.id.startsWith('ema-') && !selectedDepartment.id.startsWith('pol-') && (
        <DepartmentDetails
          department={selectedDepartment}
          onBack={handleBackToHome}
        />
      )}


      {/* Service View */}
      {currentView === 'service' && selectedService && !isEmaService && !selectedService.id.startsWith('pol-') && (
  <ServiceDetails
    service={selectedService}
    onBack={handleBackToHome}
  />
)}
 {currentView === 'service' && selectedService && selectedService.id.startsWith('pol-') && (
  <PolServiceDetails
    service={selectedService}
    onBack={handleBackToPolHome}
  />
)}
      {/* Ema Service View */}
      {currentView === 'emaService' && selectedService && isEmaService && (
        <EmaServiceDetails
          service={selectedService}
          onBack={handleBackToEmaHome}
        />
      )}

  

      {/* User Manual */}
      {currentView === 'manual' && (
        <UserManual onBack={handleBackToHome} />
      )}

      {currentView === 'emaManual' && (
        <EmaUserManual onBack={handleBackToEmaHome} />
      )}
      {currentView === 'polManual' && (
        <UserManual onBack={handleBackToPolHome} />
      )}

      {/* Emalahleni Home Page */}
      {currentView === 'emaHome' && (
        <EmaHomePage
          departments={emaDepartments}
          services={emaServices}
          selectedFilter={selectedFilter}
          onDepartmentClick={handleDepartmentClick}
          onServiceClick={(service) => handleServiceClick(service, true)}
        />
      )}

    {currentView === 'polHome' && (
  <PolHomePage
  departments={polDepartments}
  services={polServices}
  selectedFilter={selectedFilter}
  onDepartmentClick={handleDepartmentClick}
  onServiceClick={(service) => handleServiceClick(service, false)}
/>
)}

    </div>
  );
}

export default App;