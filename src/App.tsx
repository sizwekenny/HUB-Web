import React, { useState } from 'react';
import HomePage from './components/HomePage';
import DepartmentDetails from './components/DepartmentDetails';
import ServiceDetails from './components/ServiceDetails';
import UserManual from './components/UserManual';
import Navigation from './components/Navigation';
import { Department, Service } from './types';

const departments: Department[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    codes: ['DPMCF0', 'DPMC20', 'ADMC20', 'DPRSF0', 'DPRS20', 'ADRS20'],
    description: 'Comprehensive computer science programs covering software development, algorithms, and theoretical foundations.'
  },
  {
    id: 'cse',
    name: 'Computer Systems Engineering',
    codes: ['DPYEF0', 'DPYE20', 'ADYE20'],
    description: 'Engineering-focused programs combining hardware and software systems design.'
  },
  {
    id: 'informatics',
    name: 'Informatics',
    codes: ['DPIFF0', 'DPIF20', 'ADIF20'],
    description: 'Information systems and data management programs for modern digital solutions.'
  },
  {
    id: 'it',
    name: 'Information Technology',
    codes: ['DPITF0', 'DPIT20', 'ADIT21'],
    description: 'Practical IT programs focusing on technology implementation and management.'
  }
];

const services: Service[] = [
  {
    id: 'mark-enquiries',
    title: 'Mark Enquiries/Predicate Enquiries',
    category: 'Senior Students',
    description: 'Get assistance with mark-related queries and academic predicates.',
    details: 'Contact your Academic Department for mark enquiries and predicate-related questions.'
  },
  {
    id: 'academic-exclusions',
    title: 'Academic Exclusions',
    category: 'Senior Students',
    description: 'Information and appeals process for academic exclusions.',
    details: `Refer to the ITS notification. Apply for an appeal against exclusion via EC (Electronic Campus). You will receive the outcome of your appeal via SASO (Student Academic Support Office) electronically. You need to sign the receipt (letter) of the outcome of your appeal online via SASO. If your academic block was lifted, read the conditions and register accordingly and in cooperation with your Academic Department. If your academic block was not lifted, you will remain excluded for 1 year from the Faculty of ICT, not from other faculties in TUT.`
  },
  {
    id: 'financial-exclusion',
    title: 'Financial Exclusion',
    category: 'Senior Students',
    description: 'Assistance with financial exclusion matters.',
    details: 'Refer to the ITS notification. Visit Mr Rodney Lebelo at Student Accounts next to the cashiers (building 12, ground floor).'
  },
  {
    id: 'nsfas-enquiries',
    title: 'NSFAS Enquiries',
    category: 'Senior Students',
    description: 'National Student Financial Aid Scheme support and information.',
    details: 'For enquiries, visit the Financial Aid Office. Find your propensity letter form from the Financial Aid Office. Take your propensity letter form to your Academic Department and then to OneStop to obtain signatures. Other NSFAS issues can be resolved by visiting their website.'
  },
  {
    id: 'change-of-course',
    title: 'Change of Course',
    category: 'Senior Students',
    description: 'Process for changing your academic course (not admission related).',
    details: 'Were you registered the previous academic year? If yes, apply for change of course via EC (Electronic Campus). You can only apply once a year during the October/November period due to the faculty having one intake per year. After you receive an approval email, you have to first cancel your current course before the new course can be opened on the system. Thereafter, you can register for the new course. You must visit your Academic Department to determine for which modules you will be credited and for which modules you need to register for.'
  },
  {
    id: 'admissions',
    title: 'Admissions',
    category: 'Newcomer Students',
    description: 'Information about application processes and deadlines.',
    details: 'Visit the TUT website to check application closing dates (www.tut.ac.za). Do not visit any office and ask staff to screen your grade 12 certificate. You must apply on-line. You will have to visit www.tut.ac.za daily to see which courses are available if you did not apply earlier or if you want to apply late.'
  },
  {
    id: 'bursaries',
    title: 'Bursaries',
    category: 'All Students',
    description: 'Financial assistance and bursary information.',
    details: 'Visit the FUNDI office in building 12 on the ground floor.'
  },
  {
    id: 'timetables',
    title: 'Class & Test Timetables',
    category: 'All Students',
    description: 'Access your class and test schedules.',
    details: 'Visit your Academic Department to obtain your timetables. If you experience clashes on the timetables, visit your Academic Department urgently.'
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'department' | 'service' | 'manual'>('home');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleDepartmentClick = (department: Department) => {
    setSelectedDepartment(department);
    setCurrentView('department');
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setCurrentView('service');
  };

  const handleNavigate = (view: 'home' | 'manual') => {
    setCurrentView(view);
    setSelectedDepartment(null);
    setSelectedService(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedDepartment(null);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      
      {currentView === 'home' && (
        <HomePage 
          departments={departments}
          services={services}
          onDepartmentClick={handleDepartmentClick}
          onServiceClick={handleServiceClick}
        />
      )}
      {currentView === 'department' && selectedDepartment && (
        <DepartmentDetails 
          department={selectedDepartment}
          onBack={handleBackToHome}
        />
      )}
      {currentView === 'service' && selectedService && (
        <ServiceDetails 
          service={selectedService}
          onBack={handleBackToHome}
        />
      )}
      {currentView === 'manual' && (
        <UserManual onBack={handleBackToHome} />
      )}
    </div>
  );
}

export default App;