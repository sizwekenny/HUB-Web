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
  category: 'Senior Students' | 'Newcomer Students' | 'All Students';
  description: string;
  details: string;
  statusLink?: string;
  // Ordered procedural steps for this service (editable by admins)
  steps?: string[];
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
  category: 'Registration' | 'Academic' | 'Announcement' | 'Deadline' | 'Event' | 'WIL';
  priority: 'high' | 'medium' | 'low';
  /** Optional department code/name this news item relates to */
  department?: string;
  isUrgent?: boolean;
  /**
   * Visibility flag. When false the item is considered disabled/hidden from public views
   * but still appears in the admin panel for re‑activation. Undefined defaults to true.
   */
  isVisible?: boolean;
  /**
   * Campus tag identifies which campus the news item applies to.
   * If omitted, item is considered global (all campuses).
   * Values should align with internal campus ids used in landing page.
   */
  // Supported campuses currently: Soshanguve South (south), eMalahleni (emalahleni), Polokwane (polokwane)
  campus?: 'south' | 'emalahleni' | 'polokwane' | 'all';
  downloadFile?: {
    filename: string;
    url: string;
    type: 'pdf' | 'png' | 'jpg' | 'jpeg' | 'docx' | 'xlsx';
    size?: string;
  };
}
