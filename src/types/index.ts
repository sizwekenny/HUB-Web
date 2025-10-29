export interface Department {
  id: string;
  name: string;
  codes: string[];
  description: string;
  buildingNumber?: string;
  email?: string;
  contactNumber?: string;
  link?: string;
  courses?: Course[];
}

export interface Course {
  courseCode: string;
  courseName: string;
  duration?: string;
  nqfLevel?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  details?: string;
  category: string;
  steps?: string[];
  statusLink?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactLocation?: string;
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
