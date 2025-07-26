import React, { useState } from 'react';
import ReportViewer from './ReportViewer';
import FeedbackPanel from './FeedbackPanel';
import { ChevronLeft, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Comment, Report } from '../types';
import { formatDate } from '../utils/dateUtils';

// Mock report data - would come from API in real app
const mockReport: Report = {
  id: '1',
  module: 'CS301: Software Engineering Principles',
  startDate: '2025-04-01',
endDate: '2025-04-07',
  activities: `During this week, we focused on advanced software design patterns and their practical applications. Key activities included:

1. Lecture on Factory and Observer patterns with real-world examples
2. Hands-on workshop implementing design patterns in a group project
3. Code review sessions where students presented their implementations
4. Interactive discussion on pattern selection criteria and trade-offs

Students showed particular interest in the Observer pattern and its applications in modern web development.`,
  suggestions: `Based on this week's observations:

1. Consider incorporating more pair programming exercises
2. Add a dedicated session on testing design pattern implementations
3. Create a pattern catalog for student reference
4. Schedule additional office hours before the next project milestone`,
  communicationMethods: [
    { 
      id: '1', 
      method: 'Microsoft Teams', 
      details: 'Daily standup meetings at 9:00 AM. Discussed progress, blockers, and next steps. All students actively participated in the discussions.' 
    },
    { 
      id: '2', 
      method: 'Moodle Forums', 
      details: 'Used for asynchronous discussions and sharing additional resources. 15 new thread discussions this week with high engagement.',
      documentUrl: '/forum-analytics.pdf' 
    },
    {
      id: '3',
      method: 'Email',
      details: 'Weekly summary sent to all students with upcoming deadlines and important announcements.',
      documentUrl: '/email-log.pdf'
    }
  ],
  sessions: [
    { 
      id: '1', 
      sessionNumber: 1, 
      studentsAttended: 28, 
      group: 'Full Class', 
      date: '2025-04-02' 
    },
    { 
      id: '2', 
      sessionNumber: 2, 
      studentsAttended: 15, 
      group: 'Group A', 
      date: '2025-04-02' 
    },
    { 
      id: '3', 
      sessionNumber: 3, 
      studentsAttended: 14, 
      group: 'Group B', 
      date: '2025-04-02'
    }
  ],
  author: {
    id: '101',
    name: 'Dr. Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=32',
    role: 'lecturer'
  },
  status: 'under_review',
  submittedAt: '2025-04-08T14:30:00',
  registerPdfUrl: '/attendance-register.pdf'
};

// Mock comments - would come from API in real app
const initialComments: Comment[] = [
  {
    id: '1',
    author: {
      id: '201',
      name: 'Prof. Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=68',
      role: 'reviewer'
    },
    content: 'Excellent coverage of design patterns. The hands-on workshop approach is particularly effective. Could you share more details about how students applied these patterns in their projects?',
    timestamp: new Date('2025-04-09T10:15:00'),
    sectionId: 'activities'
  },
  {
    id: '2',
    author: {
      id: '101',
      name: 'Dr. Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=32',
      role: 'lecturer'
    },
    content: 'Thank you for the feedback! Students implemented the Observer pattern in their project\'s event handling system and used the Factory pattern for creating different types of user interfaces. I\'ll add the project examples to next week\'s report.',
    timestamp: new Date('2025-04-09T11:30:00'),
    sectionId: 'activities',
    parentId: '1'
  },
  {
    id: '3',
    author: {
      id: '202',
      name: 'Dr. Emily Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=45',
      role: 'reviewer'
    },
    content: 'The suggestion for a pattern catalog is valuable. Have you considered using existing resources like RefactoringGuru or creating a custom catalog specific to your course?',
    timestamp: new Date('2025-04-09T14:20:00'),
    sectionId: 'suggestions'
  },
  {
    id: '4',
    author: {
      id: '101',
      name: 'Dr. Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=32',
      role: 'lecturer'
    },
    content: 'I\'m planning to create a custom catalog that aligns with our course projects and includes student-contributed examples. This will make it more relevant to their learning context.',
    timestamp: new Date('2025-04-09T15:45:00'),
    sectionId: 'suggestions',
    parentId: '3'
  }
];

const ReviewPage: React.FC = () => {
  const [report] = useState<Report>(mockReport);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  
  const handleAddComment = (content: string, sectionId: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        id: '201',
        name: 'Prof. Michael Chen',
        avatar: 'https://i.pravatar.cc/150?img=68',
        role: 'reviewer'
      },
      content,
      timestamp: new Date(),
      sectionId,
      parentId
    };
    
    setComments([...comments, newComment]);
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-500';
      case 'under_review': return 'bg-blue-500';
      case 'reviewed': return 'bg-teal-500';
      case 'approved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'under_review': return 'Under Review';
      case 'reviewed': return 'Reviewed';
      case 'approved': return 'Approved';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Report Review</h1>
                <div className="flex items-center mt-1 space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {report.module} ({formatDate(new Date(report.startDate))} - {formatDate(new Date(report.endDate))})

                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(report.status)}`}>
                {getStatusText(report.status)}
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Request Changes
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            <ReportViewer 
              report={report} 
              comments={comments}
              activeSectionId={activeSectionId}
              onSectionClick={setActiveSectionId}
            />
          </div>
          <div className="col-span-1">
            <FeedbackPanel 
              comments={comments} 
              activeSectionId={activeSectionId}
              onAddComment={handleAddComment}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewPage;