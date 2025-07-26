import React from 'react';
import { Report, Comment, ReportSection } from '../types';
import { Calendar, Users, MessageSquare, PaperclipIcon, FileText } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface ReportViewerProps {
  report: Report;
  comments: Comment[];
  activeSectionId: string | null;
  onSectionClick: (sectionId: string) => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ 
  report, 
  comments, 
  activeSectionId, 
  onSectionClick 
}) => {
  // Generate sections from the report
  const reportSections: ReportSection[] = [
    {
      id: 'activities',
      title: 'Weekly Activities',
      content: report.activities,
      type: 'text'
    },
    {
      id: 'suggestions',
      title: 'Suggestions',
      content: report.suggestions,
      type: 'text'
    },
    {
      id: 'communication',
      title: 'Communication Methods',
      content: (
        <ul className="space-y-2">
          {report.communicationMethods.map(method => (
            <li key={method.id} className="flex items-start">
              <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <div className="font-medium">{method.method}</div>
                <p className="text-gray-600">{method.details}</p>
                {method.documentUrl && (
                  <a 
                    href={method.documentUrl} 
                    className="text-blue-600 hover:underline flex items-center mt-1"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <PaperclipIcon className="w-4 h-4 mr-1" /> View document
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      ),
      type: 'list'
    },
    {
      id: 'sessions',
      title: 'Sessions',
      content: (
        <div className="space-y-4">
          {report.sessions.map(session => (
            <div key={session.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="font-medium">Session #{session.sessionNumber}</div>
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                 <span>{formatDate(new Date(report.startDate))} - {formatDate(new Date(report.endDate))}</span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="text-sm flex items-center">
                  <Users className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-gray-600">{session.studentsAttended} students</span>
                </div>
                <div className="text-sm text-gray-600">
                  Group: {session.group}
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
      type: 'sessions'
    },
    {
      id: 'register',
      title: 'Attendance Register',
      content: report.registerPdfUrl ? (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="text-center">
            <FileText className="w-10 h-10 text-blue-500 mx-auto mb-2" />
            <a 
              href={report.registerPdfUrl} 
              className="text-blue-600 hover:underline font-medium"
              target="_blank" 
              rel="noopener noreferrer"
            >
              View Attendance Register
            </a>
            <p className="text-sm text-gray-500 mt-1">PDF Document</p>
          </div>
        </div>
      ) : 'No attendance register uploaded',
      type: 'pdf'
    }
  ];

  // Count comments for each section
  const commentCounts = reportSections.reduce((acc, section) => {
    acc[section.id] = comments.filter(c => c.sectionId === section.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Report header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{report.module}</h2>
            <div className="flex items-center mt-2 text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
               <span>{formatDate(new Date(report.startDate))} - {formatDate(new Date(report.endDate))}</span>
            </div>
          </div>
          <div className="flex items-center">
            <img 
              src={report.author.avatar} 
              alt={report.author.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <div className="font-medium">{report.author.name}</div>
              <div className="text-sm text-gray-500">Submitted on {formatDate(new Date(report.submittedAt))}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Report sections */}
      <div className="divide-y divide-gray-200">
        {reportSections.map(section => {
          const hasComments = commentCounts[section.id] > 0;
          const isActive = activeSectionId === section.id;
          
          return (
            <div 
              key={section.id}
              className={`p-6 transition-colors ${
                isActive ? 'bg-blue-50' : hasComments ? 'bg-amber-50' : ''
              }`}
              onClick={() => onSectionClick(section.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                {hasComments && (
                  <div className="flex items-center text-amber-600 bg-amber-100 px-2 py-1 rounded-full text-sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {commentCounts[section.id]}
                  </div>
                )}
              </div>
              <div className="text-gray-700">
                {typeof section.content === 'string' ? (
                  <p>{section.content}</p>
                ) : (
                  section.content
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportViewer;