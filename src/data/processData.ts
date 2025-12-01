// Process steps for different services across all campuses
export const processSteps: Record<string, string[]> = {
  // Main campus steps
  'mark-enquiries': [
    'Contact your Academic Department directly for all Marks and predicate enquiries',
  ],
  'academic-exclusions': [
    'Refer to the ITS notification',
    'Apply for an appeal against exclusion via EC (Electronic Campus)',
    'Receive outcome via SASO electronically',
    'Sign the receipt letter online via SASO',
    'Follow conditions if block is lifted, or wait 1 year if not lifted',
  ],
  'nsfas-enquiries': [
    'Visit the Financial Aid Office for enquiries',
    'Find your propensity letter form from Financial Aid Office',
    'Take form to your Academic Department',
    'Get signatures from OneStop',
    'Visit NSFAS website for other issues',
  ],
  'change-of-course': [
    'Confirm you were registered the previous academic year',
    'Apply via EC (Electronic Campus) during October/November',
    'Wait for approval email',
    'Cancel your current course first',
    'Register for the new course',
    'Visit Academic Department for module credits',
  ],
  'subject-additions-and-cancellations': [
    'Obtain the form from OneStop',
    'Obtain approval from your Academic Department',
  ],
  'no-walk-ins-policy': [
    'NO HUMANITIES ENQUIRIES at ICT Faculty offices',
    'Do not ask staff to screen grade 12 certificate',
    'Must apply online only',
    'Check www.tut.ac.za daily for available courses',
  ],
  'intercampus-transfers': [
    'Must be registered Computer Science Student',
    'Apply via EC (electronic Campus)',
    'Available end of October to mid-November only',
    'One intake per year only',
  ],
  're-admission': [
    'Had a break in studies? Get form from OneStop',
    'Returning after exclusion? Get Form from OneStop',
    'Get approval from Academic Department',
  ],
  'special-exit-examinations': [
    'Visit Examination Administration Office for all enquiries',
  ],
  'probation': [
    'Refer to ITS notification',
    'Sign probation form via SASO electronically'
  ],
  'other-admission-enquiries': [
    'Application status enquiries',
    'Documentation upload assistance',
    'Campus change (Admission Transfer)',
    'Contact via email: admission@tut.ac.za',
    'Phone: 0861102421',
    'Visit OneStop or Admissions Lab in Building 10',
  ],
  'residence-administration': [
    'Contact Solly Sekgalabje',
    'Phone: 012 382 9500',
    'Email: sekgalabjesb@tut.ac.za',
  ],
  'bursaries': [
    'Visit the FUNDI office in building 12 on the ground floor',
  ],
  'recognition-exemption-cat': [
    'Obtain form from OneStop',
    'Get approvals from Academic Department'
  ],
  'admissions': [
    'Visit www.tut.ac.za to check application closing dates',
    'Use the Quick link provided to apply online'
  ],
  'timetables': [
    'Visit Academic Department for timetables',
    'Report clashes to Academic Department urgently'
  ],
  'financial-exclusion': [
    'Refer to ITS notification',
    'Visit Mr Lebelo at Students Accounts'
  ],
  'wil-computer-science': [
    'Download WIL and Re-admission forms from EC and complete them',
    'Send the placement letter along with the completed forms to the WIL manager (V. Memani, MemaniV@tut.ac.za)',
    'The manager will process the forms and send them back, for the student to proceed with WIL registration',
    'Take the forms and placement letter to the registration office (OneStop, Building 7)',
    'Send the proof of registration from OneStop back to the manager',
    'The manager assigns the student a WIL Coordinator',
    'Proceed to MY WIL PORTAL and register (refer to the student user manual guide on MYTutor) https://wil.tut.ac.za/',
    'The manager will approve your registration',
  ],
  'mentorship-tutoring-program': [
    'For assistance in any of your modules, visit the mentors lab (Building 10-252)',
    'For more mentorship enquiries use the quick link to visit the website',
    'Coming Soon',
  ],
  'studython': [
    'Upon receiving link to register via email',
    'Complete the registration form (NB: use your TUT4LIFE student email)',
    'Select all the modules you need assistance with',
  ],
  'peer-to-peer-learning': [
    'Visit the website using the quick link provided for more info about this program',
  ],
  'wil-informatics': [
    'Send the placement letter along with the latest academic record to your WIL coordinator (DD Malebana, malebanadd@tut.ac.za)',
    'The WIL Coordinator will provide you with WIL and Re-admission forms which you must complete (note: use a desktop when filling these forms because mobile just duplicates the details on the forms)',
    'Send the filled-out forms back to your WIL coordinator for them to sign and after they will send them back to you',
    'After receiving the forms back from the WIL coordinator, Take the forms and placement letter to the registration office (OneStop, Building 7 G05)',
    'After registration has been completed send a pdf of the proof of registration to your WIL coordinator via email so they can allow to register on myWIL Portal (OLUMS)',
    'After that go to https://wil.tut.ac.za/ and register (Refer to the student user manual guide on MYTutor)',
    'The WIL Coordinator will approve your registration',
  ],

  // Polokwane campus steps
  'pol-mark-enquiries': [
    'Contact your Academic Department directly for all Marks and predicate enquiries',
  ],
  'pol-academic-exclusions': [
    'Refer to the ITS notification',
    'Apply for an appeal against exclusion via EC (Electronic Campus)',
    'Coming Soon',
    'Coming Soon',
    'Coming Soon',
  ],
  'pol-nsfas-enquiries': [
    'Coming Soon',
    'Coming Soon',
    'Coming Soon'
  ],
  'pol-change-of-course': [
    'Confirm you were registered the previous academic year',
    'If yes, apply for change of course via EC (Electronic Campus)',
    'You can only apply once a year during the October/November period due to the faculty having one intake per year',
    'After you receive an approval email, you have to first cancel your current course before the new course can be opened on the system',
    'Thereafter, you can register for the new course',
    'You must visit your Academic Department to determine for which modules you will be credited and for which modules you need to register for',
  ],
  'pol-subject-additions-and-cancellations': [
    'Coming Soon',
    'Coming Soon',
    'Coming Soon',
  ],
  'pol-no-walk-ins-policy': [
    'NO HUMANITIES ENQUIRIES at ICT Faculty offices',
    'Do not ask staff to screen grade 12 certificate',
    'Must apply online only',
    'Check www.tut.ac.za daily for available courses',
  ],
  'pol-intercampus-transfers': [
    'Were you a registered student the previous/current academic year in Computer Science?',
    'If yes, apply for an intercampus transfer via EC (Electronic Campus)',
    'The link/tab will be available during the end of October until mid-November',
    'You can only apply during this period due to the Faculty of ICT having only one intake per year',
    'The outcome of your application will be communicated with you via the email you provide',
  ],
  'pol-re-admission': [
    'Coming Soon',
    'Coming Soon',
    'Coming Soon',
  ],
  'pol-special-exit-examinations': [
    'Visit Examination Administration Office for all enquiries',
  ],
  'pol-probation': [
    'Refer to ITS notification',
    'Coming Soon'
  ],
  'pol-other-admission-enquiries': [
    'Via email – admission@tut.ac.za or Via a phone call – 0861102421 or just visit building 1 at campus',
  ],
  'pol-residence-administration': [
    'Coming Soon',
    'Coming Soon',
    'Coming Soon'
  ],
  'pol-bursaries': [
    'Coming Soon',
  ],
  'pol-recognition-exemption-cat': [
    'Coming Soon',
    'Coming Soon'
  ],
  'pol-admissions': [
    'Visit www.tut.ac.za to check application closing dates',
    'Use the Quick link provided to apply online'
  ],
  'pol-timetables': [
    'Visit Academic Department for timetables',
    'Report clashes to Academic Department urgently'
  ],
  'pol-financial-exclusion': [
    'Refer to ITS notification',
    'Visit Mr Lebelo at Students Accounts'
  ],
  'pol-wil-computer-science': [
    'Download WIL and Re-admission forms from EC and complete them',
    'Send the placement letter along with the completed forms to the WIL manager (TS Rankoana, RankoanaTS@tut.ac.za)',
    'The manager will process the forms and send them back, for the student to proceed with WIL registration',
    'Take the forms and placement letter to the registration office (Building 1)',
    'Send the proof of registration from the registration office back to the manager',
    'The manager assigns the student a WIL Coordinator',
    'Proceed to MY WIL PORTAL and register (refer to the student user manual guide on MYTutor)',
    'The manager will approve your registration',
  ],

  // Emalahleni campus steps
  'ema-academic-exclusions': [
    'Get appeal forms from the Student Support Coordinator office in building 14 and complete them',
    'You are then required to submit your appeals by handing in a hard copy exclusion appeal form together with the relevant supporting documents',
  ],
  'ema-probation': [
    'Get appeal forms from the Student Support Coordinator office in building 14 and complete them',
    'Submit the completed forms to the Exclusion Appeal Committee office in building 14 before the closing date',
  ],
  'ema-subject-additions-and-cancellations': [
    'Go to building 7',
  ],
  'ema-re-admission': [
    'Had a break in studies? Get form from Building 7',
  ],
  'ema-special-exit-examinations': [
    'Go to Building 7',
  ],
  'ema-other-admission-enquiries': [
    'Via email – admission@tut.ac.za or Via a phone call – 0861102421 or just visit building 7',
  ],
  'ema-residence-administration': [
    'Visit Building 7',
  ],
  'ema-bursaries': [
    'Visit the FUNDI office in building 7',
  ],
  'ema-recognition-exemption-cat': [
    'Obtain approvals from your Academic Department'
  ],
  'ema-financial-exclusion': [
    'Refer to the ITS notification',
  ],
  'ema-wil-computer-science': [
    'Download WIL and Re-admission forms from EC and complete them',
    'Send the placement letter along with the completed forms to the WIL manager (JK Makhubela, MakhubelaJK@tut.ac.za)',
    'The manager will process the forms and send them back, for the student to proceed with WIL registration',
    'Take the forms and placement letter to the registration office (Building 7)',
    'Send the proof of registration from the registration office back to the manager',
    'The manager assigns the student a WIL Coordinator',
    'Proceed to MY WIL PORTAL and register (refer to the student user manual guide on MYTutor) https://wil.tut.ac.za/',
    'The manager will approve your registration',
  ],
  'ema-class-timetables': [
    'Go to building 7',
    'If you experience clashes on the timetables, visit your Academic Department urgently',
  ],
  'ema-no-walk-ins': [
    'Do not visit any office and ask staff to screen your grade 12 certificate',
    'You must apply on-line',
    'Click on the quick link daily to see which courses are available if you did not apply earlier or if you want to apply late',
  ],
  'ema-admission': [
    'Visit the TUT website to check application closing dates (www.tut.ac.za) use the quick link',
  ],
};

// Program code descriptions
export const programDescriptions: Record<string, string> = {
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

// Program durations
export const programDurations: Record<string, string> = {
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

// Lecturer information interface
export interface Lecturer {
  name: string;
  email: string;
  office?: string;
}

export interface SubjectInfo {
  subject: string;
  lecturers: Lecturer[];
}

// Program subjects
export const programSubjects: Record<string, SubjectInfo[]> = {
  'DPIFF0': [
    { subject: 'BCMF15D', lecturers: [{ name: 'Ms. Irene Abraham-Samgeorge', email: 'abrahamia@tut.ac.za' }] },
    { subject: 'BFSF15D', lecturers: [{ name: 'Mr. Dimakatso Malebana', email: 'malebanadd@tut.ac.za' }] }
  ],
  'DPIF20': [
    { subject: 'BCM115D', lecturers: [{ name: 'Ms. Irene Abraham-Samgeorge', email: 'abrahamia@tut.ac.za' }] },
    { subject: 'BFS115D', lecturers: [{ name: 'Mr. Dimakatso Malebana', email: 'malebanadd@tut.ac.za' }] }
  ],
  'ADIF20': [
    { subject: 'KWM117V', lecturers: [{ name: 'Dr. Cecile Kgoetiane', email: 'kgwetianech@tut.ac.za' }] },
    { subject: 'ITM117V', lecturers: [{ name: 'Mr. Mashithishi Phurutsi', email: 'phurutsimb@tut.ac.za' }] }
  ]
};

// First Year Foundation subjects
export const fyfSubjects: SubjectInfo[] = [
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
      { name: 'Ms. MT Popela (Module Coordinator COE/CAP105X)', email: 'PopelaMT@tut.ac.za', office: '12-224' },
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

// Administrator and HOD Information
export const administratorInfo = {
  name: 'Sihle Dlamini',
  position: 'Administrator: ICT 1st Year and Foundation Unit',
  office: '18-G07',
  services: [
    'Module Additions/Cancellations Signatures',
    'Predicate Enquiries',
    'Re-admissions Processing',
    'January/February 2026 Period Operations'
  ],
  contactLocation: 'Building 18-G07'
};

export const hodInfo = {
  name: 'Mr MB Phurutsi',
  position: 'Head of Department - Foundation Unit',
  office: '18-G07',
  email: 'PhurutsiMB@tut.ac.za',
  tel: '9796'
};

// Helper functions
export const getCodeDescription = (code: string): string => {
  return programDescriptions[code] || 'Program description not available';
};

export const getProgramDuration = (code: string): string => {
  return programDurations[code] || 'Varies';
};

export const getProgramSubjects = (programCode: string): SubjectInfo[] => {
  return programSubjects[programCode] || [];
};

export const getProcessSteps = (serviceKey: string): string[] => {
  return processSteps[serviceKey] || ['Process information not available for this service.'];
};

// Supported Modules
export const supportedModules = [
'CGA115D', 'CGB115D', 'CGBF15D', 'CPL115X', 'CPL115D', 'ATH115D'
];


// EUC Contact Information
export const eucContact = {
coordinator: 'Dr MM Swanepoel',
email: 'Swanepoelmm@tut.ac.za',
phone: '012 382 5857',
office: '12-201 Soshanguve South'
};


// Head of Department
export const hodDepartment = {
name: 'Dr Kgasi',
position: 'Head of Department'
};


// Administration
export const administrationInfo = {
name: 'A.M Mokwena',
position: 'Administrator',
email: 'Mokwenaam@tut.ac.za',
officePhone: '012 382 9399'
};

 export const ictData = {
    exclusions: {
      academic: [
        "Refer to the ITS notification.",
        "Apply for an appeal against exclusion via EC (Electronic Campus).",
        "You will receive the outcome via SASO electronically.",
        "Sign the outcome letter via SASO online.",
        "If block was lifted: read conditions and register in cooperation with your Academic Department.",
        "If not lifted: You are excluded for 1 year from ICT Faculty.",
        "No reconsideration at Academic Department or SASO after rejection.",
      ],
      financial: [
        "Refer to the ITS notification.",
        "Visit Mr Rodney Lebelo at Student Accounts (building 12, ground floor)."
      ]
    },

    nsfas: [
      "Visit the Financial Aid Office.",
      "Get a propensity letter form and have it signed by your Academic Department and OneStop.",
      "For other issues, visit the NSFAS website."
    ],

    courseChange: [
      "Must have been registered the previous academic year.",
      "Apply via EC during October/November only.",
      "After approval, cancel current course before registering new one.",
      "Visit Academic Department for credit evaluations."
    ],

    exams: {
      specialExit: "Visit the Examination Administration office.",
      probation: [
        "Refer to the ITS notification.",
        "Sign probation form via SASO electronically."
      ]
    },

    timetables: "Visit your Academic Department. If there are clashes, visit urgently.",

    readmissions: [
      "Break in studies: Get form from OneStop building 7, get Academic Department approval.",
      "Returning after exclusion: Same process via OneStop building 7 + Academic Department."
    ],

    intercampusTransfer: [
      "Registered Computer Science student: Apply via EC during late Oct to mid-Nov.",
      "Outcome sent via email."
    ],

    admissions: [
      "Visit www.tut.ac.za for application closing dates.",
      "After applying: check status, upload documents, request campus transfer via:",
      "Email: admission@tut.ac.za",
      "Phone: 0861102421",
      "Visit OneStop building 7 or Admissions Lab in building 10"
    ],

    newcomers: [
      "NO humanities queries at ICT offices.",
      "NO walk-ins to screen grade 12. Apply online.",
      "Visit www.tut.ac.za daily for late applications."
    ],

    bursaries: "Visit FUNDI office, building 12, ground floor.",

    residence: "Contact Solly Sekgalabje (012 382 9500) or sekgalabjesb@tut.ac.za",

    cat: "Get CAT form from OneStop building 7. Approval needed from your Academic Department.",

    sds: {
      description: [
        "You might face challenges or personal barriers that could have a negative impact on your well-being and studies.",
        "Student Development and Support (SDS) offers services and interventions to equip you with skills to deal with barriers in a positive way.",
        "SDS supports you from orientation to graduation.",
        "All SDS services are free to TUT students."
      ],
      mentoring: [
        "SDS runs the mentor training programme.",
        "Mentors are senior students who support first-years academically and emotionally."
      ],
      lifeSkills: [
        "Life Skills is a compulsory first-year module.",
        "It helps develop the skills needed to succeed at university.",
        "The module covers managing workload, making friends, and other common first-year challenges."
      ],
      contact: {
        office: "South Campus Office: Building 5, 2nd Floor, Room 215",
        email: "counselling@tut.ac.za",
        phone: ["012 382 9863", "012 382 9038"],
        afterHours: {
          sadag: "SADAG online 24-hour Counselling: 0800 687 888",
          er24: "ER24 emergency response (24-hour): 084 124"
        }
      }
    }
  };