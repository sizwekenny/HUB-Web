// export interface Department {
//   id: string;
//   name: string;
//   codes: string[];
//   description: string;
//   buildingNumber?: string;
//   email?: string;
//   contactNumber?: string;
//   link?: string;
//   courses?: Course[];
// }


export interface Department {
  id: string;
  name: string;
  department_code?: string;
  description?: string;
  building_number?: string;
  email?: string;
  contact_number?: string;
  website_link?: string;
  is_active?: boolean;
  courses?: Course[];
}

export interface Course {
  courseCode: string;
  courseName: string;
  duration?: string;
  nqfLevel?: string;
}

// export interface Service {
//   id: string;
//   title: string;
//   description: string;
//   details?: string;
//   category: string;
//   steps?: string[];
//   statusLink?: string;
//   contactPhone?: string;
//   contactEmail?: string;
//   contactLocation?: string;
// }
export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  details?: string;
  steps?: string[];
  statusLink?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  category_id?: number;
}



export interface Comment {
  id: string;
  sectionId: string;
  parentId?: string;
  content: string;
  timestamp: string | number | Date;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
}

export interface ReportSection {
  id: string;
  title: string;
  content: string | React.ReactNode;
  type: 'text' | 'list' | 'sessions' | 'pdf';
}

export interface CommunicationMethod {
  id: string;
  method: string;
  details: string;
  documentUrl?: string;
}

export interface Session {
  id: string;
  sessionNumber: number;
  date: string;
  studentsAttended: number;
  group: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category:
    | 'Registration'
    | 'Academic'
    | 'Announcement'
    | 'Deadline'
    | 'Event'
    | 'WIL'
    | 'Health'
    | 'Student Support'
    | 'Awareness & Safety';
  priority: 'high' | 'medium' | 'low';
  department?: string;
  isUrgent?: boolean;
  isVisible?: boolean;
  campus?: 'south' | 'emalahleni' | 'polokwane' | 'all';
  downloadFile?: {
    filename: string;
    url: string;
    type: 'pdf' | 'png' | 'jpg' | 'jpeg' | 'docx' | 'xlsx';
    size?: string;
  };
}

/* ----------------------------------------------------------------
   Component Prop Interfaces
   These fix missing-prop and implicit-any errors from your log
---------------------------------------------------------------- */

export interface NavigationProps {
  departments: Department[];
  services: Service[];
  currentView: string;
  onNavigate: (view: string) => void;
  onFilterChange?: (filter: 'all' | 'senior' | 'newcomer') => void;
}

export interface DepartmentDetailsProps {
  department: Department;
  onBack: () => void;
}

export interface ServiceDetailsProps {
  service: Service;
  onBack: () => void;
}

export interface UserManualProps {
  onBack: () => void;
}

export interface AdminLoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export interface AdminDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
}





// In your types.ts file, update RealDepartment interface:
export interface RealDepartment {
  id: string;
  name: string;
  department_code: string;
  description: string;
  building_number: string;
  email: string;
  contact_number: string;
  website_link: string;
  is_active: boolean;
  campus_name: string;
  campus_id?: number | string; // Add this line
  programs: Program[];
  courses: Course[];
  lecturers: Lecturer[];
}

export interface Program {
  program_id: string;
  program_code: string;
  program_name: string;
  description: string;
  duration: string;
  is_active: boolean;
}

export interface Course {
  course_id: string;
  course_code: string;
  course_name: string;
  description: string;
  nqf_level: string;
  credits: string;
  duration: string;
  is_active: boolean;
}

export interface Lecturer {
  lecturer_id: string;
  name: string;
  email: string;
  office: string;
  phone: string;
  position: string;
  is_active: boolean;
}

// Your existing interfaces remain the same
export interface Department {
  id: string;
  name: string;
  description: string;
  codes: string[];
  icon: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  priority: string;
  isUrgent: boolean;
  downloadFile?: {
    url: string;
    filename: string;
    type: string;
  };
}