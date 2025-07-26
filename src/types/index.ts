export interface Department {
  id: string;
  name: string;
  codes: string[];
  description: string;
}

export interface Service {
  id: string;
  title: string;
  category: 'Senior Students' | 'Newcomer Students' | 'All Students';
  description: string;
  details: string;
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

export interface Report {
  id: string;
  module: string;
  startDate: string;
  endDate: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'reviewed' | 'approved';

  author: Author;

  activities: string;
  suggestions: string;

  communicationMethods: CommunicationMethod[];

  sessions: Session[];

  registerPdfUrl?: string;
}
