import React, { useState, useEffect } from 'react';
import { Users, BarChart3, TrendingUp, School } from 'lucide-react';
import axios from 'axios';

// Define the shape of your data
interface CampusStat {
  campus_name: string;
  student_count: number;
}

interface DepartmentStat {
  department_name: string;
  student_count: number;
}

interface StudentStatistics {
  total_students: number;
  campus_stats: CampusStat[];
  department_stats: DepartmentStat[];
}

interface ApiResponse {
  success: boolean;
  data: StudentStatistics;
  message?: string;
}

type TimeRange = 'current' | 'last_year' | 'all_time';

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000';

const StudentStatisticsSection: React.FC = () => {
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [timeRange, setTimeRange] = useState<TimeRange>('current');

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get<ApiResponse>(
        `${API_URL}/api/student-statistics/statistics?time_range=${timeRange}`
      );
      
      if (response.data.success) {
        setStatistics(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch statistics');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch student statistics';
      setError(errorMessage);
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchStatistics}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!statistics) return null;

  const totalStudents = statistics.total_students || 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Student Statistics</h2>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="current">Current Academic Year</option>
                <option value="last_year">Last Academic Year</option>
                <option value="all_time">All Time</option>
              </select>
              <button
                onClick={fetchStatistics}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold mt-1">{totalStudents.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
              <div className="mt-4 flex items-center text-blue-200 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Active across all campuses</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Campuses</p>
                  <p className="text-3xl font-bold mt-1">
                    {statistics.campus_stats?.length || 0}
                  </p>
                </div>
                <School className="w-8 h-8 text-green-200" />
              </div>
              <div className="mt-4 text-green-200 text-sm">Multiple campus locations</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Departments</p>
                  <p className="text-3xl font-bold mt-1">
                    {statistics.department_stats?.length || 0}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-200" />
              </div>
              <div className="mt-4 text-purple-200 text-sm">Various academic departments</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg per Campus</p>
                  <p className="text-3xl font-bold mt-1">
                    {statistics.campus_stats?.length && statistics.campus_stats.length > 0
                      ? Math.round(totalStudents / statistics.campus_stats.length).toLocaleString()
                      : '0'}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-200" />
              </div>
              <div className="mt-4 text-orange-200 text-sm">
                Average student distribution
              </div>
            </div>
          </div>

          {/* Campus Distribution */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <School className="w-5 h-5 text-blue-600" />
                Campus Distribution
              </h3>
              <div className="space-y-4">
                {statistics.campus_stats && statistics.campus_stats.length > 0 ? (
                  statistics.campus_stats.map((campus) => {
                    const percentage = totalStudents
                      ? Math.round((campus.student_count / totalStudents) * 100)
                      : 0;
                    return (
                      <div key={campus.campus_name} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              {campus.campus_name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {campus.student_count || 0} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No campus data available
                  </div>
                )}
              </div>
            </div>

            {/* Department Distribution */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Department Distribution
              </h3>
              <div className="space-y-4">
                {statistics.department_stats && statistics.department_stats.length > 0 ? (
                  <>
                    {statistics.department_stats.slice(0, 8).map((dept) => {
                      const percentage = totalStudents
                        ? Math.round((dept.student_count / totalStudents) * 100)
                        : 0;
                      return (
                        <div key={dept.department_name} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700 truncate mr-2">
                                {dept.department_name}
                              </span>
                              <span className="text-sm text-gray-500 whitespace-nowrap">
                                {dept.student_count || 0} ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {statistics.department_stats.length > 8 && (
                      <div className="text-center text-sm text-gray-500 mt-4">
                        +{statistics.department_stats.length - 8} more departments
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No department data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {totalStudents.toLocaleString()}
                </p>
                <p className="text-gray-600 mt-1">Total Students</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {statistics.campus_stats?.length || 0}
                </p>
                <p className="text-gray-600 mt-1">Active Campuses</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {statistics.department_stats?.length || 0}
                </p>
                <p className="text-gray-600 mt-1">Departments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStatisticsSection;