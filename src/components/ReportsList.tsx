import React from 'react';
import { FileText, ChevronRight, Calendar, User, MessageSquare } from 'lucide-react';
import { Report } from '../types';
import { formatDate } from '../utils/dateUtils';

interface ReportsListProps {
  reports: Report[];
  onReportSelect: (reportId: string) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, onReportSelect }) => {
  const getStatusBadge = (status: Report['status']) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800',
      under_review: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800'
    };

    const labels = {
      pending: 'Pending Review',
      under_review: 'Under Review',
      reviewed: 'Reviewed',
      approved: 'Approved'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weekly Reports</h1>
            <p className="mt-1 text-sm text-gray-500">Review and provide feedback on submitted reports</p>
          </div>
          <div className="flex gap-3">
            <select className="rounded-md border-gray-300 shadow-sm px-4 py-2 bg-white text-sm">
              <option>All Modules</option>
              <option>Software Engineering</option>
              <option>Web Development</option>
              <option>Database Systems</option>
            </select>
            <select className="rounded-md border-gray-300 shadow-sm px-4 py-2 bg-white text-sm">
              <option>All Status</option>
              <option>Pending Review</option>
              <option>Under Review</option>
              <option>Reviewed</option>
              <option>Approved</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onReportSelect(report.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{report.module}</h2>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(new Date(report.startDate))} - {formatDate(new Date(report.endDate))}

                        </span>
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {report.author.name}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {report.communicationMethods.length} communications
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(report.status)}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsList;