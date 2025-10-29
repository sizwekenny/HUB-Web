// data.ts
export interface Department {
  id: string;
  name: string;
  codes: string[];
  description: string;
  buildingNumber: string;
  email: string;
  contactNumber: string;
}

export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  details: string;
  statusLink?: string;
}


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
  },
  {
    id: 'fyf',
    name: 'ICT First Year & Foundation',
    codes: ['TROF05D/PPAF05D', 'COHF05D/CHOF05D', 'COEF05X/CAPF05X & 16P105X/16E105X','CN1F05D/CFAF05D/CGAF05D',''],
    description: 'Practical IT programs focusing on technology and systems.',
    buildingNumber: 'BUILDING 18-G-14',
    email: 'coming soon',
    contactNumber: 'coming soon'
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
    id: 'Mentorship & Tutoring program',
    title: 'Mentorship & Tutoring program',
    category: 'All Students',
    description: 'Mentorship program for guidance and support.',
    details: 'Mentorship program for guidance and support.',
    statusLink: 'https://sds.onlinewebshop.net/'

  },
  {
    id: 'Studython',
    title: 'Studython',
    category: 'All Students',
    description: 'Studython program for academic support.',
    details: '•	Please arrive at Nkuna Statue by 17:00 on the day of the event. •	A detailed timetable will be provided on the day of the Studython. •	Even if your modules are not appearing on the form, you are welcome to attend.'

  },
  {
    id: 'Peer to Peer learning',
    title: 'Peer to Peer learning',
    category: 'All Students',
    description: 'Peer to Peer learning program for academic support.',
    details: 'Peer to Peer learning program for academic support.',
    statusLink: 'https://sds.onlinewebshop.net/'
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
export { departments, emaDepartments, polDepartments, services, emaServices, polServices };