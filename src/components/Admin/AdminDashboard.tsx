
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  Trash2,
  EyeOff,
  Bell,
  BookOpen,
  // Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';

// Add these imports for charts
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

import { newsStore } from '../../utils/newsStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NewsItem, Service, Department, Course } from '../../types';
import { serviceStore } from '../../utils/serviceStore';
import AdminDetailsUpdater from './sections/AdminDetailsUpdater';
import AdminEmailUpdater from './sections/AdminEmailUpdater';
import AdminPasswordUpdater from './sections/AdminPasswordUpdater';
import AdminUserManagement from './sections/AdminUserManagement';
import NewsManagementSection from './sections/NewsManagementSection';
import ServicesManagementSection from './sections/ServicesManagementSection';
import DepartmentsSection from './sections/DepartmentsSection';

import tutLogo from '../../assets/TUT.png';

// import EventsManagementSection from '../Events/EventsManagementSection';
// import NotificationsPanel from '../notifications/NotificationsPanel';
import StudentStatisticsSection from '../students/StudentStatisticsSection';
import SystemSettingsSection from '../settings/SystemSettingsSection';

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000/api/';

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onBackToHome: _onBackToHome }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Add new state for analytics
  const [newsAnalytics, setNewsAnalytics] = useState(null);
  const [departmentAnalytics, setDepartmentAnalytics] = useState(null);
  const [serviceAnalytics, setServiceAnalytics] = useState(null);
  const [systemAnalytics, setSystemAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Colors for charts
  const CHART_COLORS = {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#8b5cf6',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4'
  };

  const PIE_COLORS = [
    '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444',
    '#06b6d4', '#84cc16', '#f97316', '#6b7280', '#a855f7'
  ];

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setAnalyticsLoading(true);

      const [newsRes, deptRes, serviceRes, systemRes] = await Promise.all([
        axios.get(`${API_URL}analytics/news-overview`),
        axios.get(`${API_URL}analytics/department-overview`),
        axios.get(`${API_URL}analytics/services-overview`),
        axios.get(`${API_URL}analytics/system-overview`)
      ]);

      if (newsRes.data.success) setNewsAnalytics(newsRes.data.data);
      if (deptRes.data.success) setDepartmentAnalytics(deptRes.data.data);
      if (serviceRes.data.success) setServiceAnalytics(serviceRes.data.data);
      if (systemRes.data.success) setSystemAnalytics(systemRes.data.data);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch analytics when overview tab is active
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchAnalyticsData();
      fetchDashboardStats();
    }
  }, [activeTab]);

  // Chart components
  const NewsCategoryChart = () => {
    if (!newsAnalytics?.byCategory) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">News by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={newsAnalytics.byCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="news_count" fill={CHART_COLORS.primary} name="News Articles" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const CampusDistributionChart = () => {
    if (!newsAnalytics?.byCampus) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">News by Campus</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={newsAnalytics.byCampus}
              dataKey="news_count"
              nameKey="campus_name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {newsAnalytics.byCampus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const DepartmentCoursesChart = () => {
    if (!departmentAnalytics?.departments) return null;

    // Get top 10 departments by course count
    const topDepartments = [...departmentAnalytics.departments]
      .sort((a, b) => b.course_count - a.course_count)
      .slice(0, 10);

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Departments by Course Count</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart data={topDepartments} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="department_name" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="course_count" fill={CHART_COLORS.secondary} name="Courses" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const ServiceCategoryChart = () => {
    if (!serviceAnalytics?.byCategory) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Services by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={serviceAnalytics.byCategory}
              dataKey="service_count"
              nameKey="category_name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {serviceAnalytics.byCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const MonthlyNewsTrend = () => {
    if (!newsAnalytics?.monthlyTrend) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly News Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={newsAnalytics.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="news_count"
              stroke={CHART_COLORS.primary}
              name="News Articles"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Enhanced stats cards with more information
  const EnhancedStatsCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium mt-1 ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
              {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );


  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const navigate = useNavigate();

  // Add this state to your AdminDashboard component
  const [dashboardStats, setDashboardStats] = useState({
    students: '0',
    news: '0',
    services: '0',
    departments: '0',
    courses: '0',
    // events: '0',
    urgentNews: '0',
    // upcomingEvents: '0',
    activeAdmins: '0'
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await axios.get(`${API_URL}dashboard/quick-stats`);

      if (response.data.success) {
        setDashboardStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to default values
      setDashboardStats({
        students: '12,450',
        news: '47',
        services: '18',
        departments: '7',
        courses: '5',
        // events: '2',
        urgentNews: '1',
        // upcomingEvents: '2',
        activeAdmins: '2'
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch stats when component mounts and when activeTab changes to overview
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  // Update your stats array to use the actual data
  const stats = [
    {
      label: 'Total Students',
      value: statsLoading ? '...' : dashboardStats.students.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      label: 'News Articles',
      value: statsLoading ? '...' : dashboardStats.news.toLocaleString(),
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      label: 'Active Services',
      value: statsLoading ? '...' : dashboardStats.services.toLocaleString(),
      icon: Settings,
      color: 'bg-purple-500'
    },
    {
      label: 'Departments',
      value: statsLoading ? '...' : dashboardStats.departments.toLocaleString(),
      icon: Users,
      color: 'bg-indigo-500'
    },
    {
      label: 'Courses',
      value: statsLoading ? '...' : dashboardStats.courses.toLocaleString(),
      icon: BookOpen,
      color: 'bg-orange-500'
    },
    // {
    //   label: 'Events',
    //   value: statsLoading ? '...' : dashboardStats.events.toLocaleString(),
    //   icon: Calendar,
    //   color: 'bg-[#do142c]'
    // },
    {
      label: 'Urgent News',
      value: statsLoading ? '...' : dashboardStats.urgentNews.toLocaleString(),
      icon: Bell,
      color: 'bg-red-600'
    },
    // {
    //   label: 'Upcoming Events',
    //   value: statsLoading ? '...' : dashboardStats.upcomingEvents.toLocaleString(),
    //   icon: Calendar,
    //   color: 'bg-teal-500'
    // },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'news', label: 'News Management', icon: FileText },
    // { id: 'events', label: 'Events Management', icon: Calendar },
    { id: 'departments', label: 'Departments', icon: Users },
    { id: 'services', label: 'Services Management', icon: BookOpen },
    { id: 'statistics', label: 'Student Statistics', icon: TrendingUp },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const [newsCampusFilter, setNewsCampusFilter] = useState<'all' | 'south' | 'emalahleni' | 'polokwane'>('all');
  const [newsSearch, setNewsSearch] = useState('');
  const [newsPage, setNewsPage] = useState(1);
  const NEWS_PAGE_SIZE = 10;
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');

  // Campus mapping
  const campusMap: Record<string, number> = {
    south: 1,
    emalahleni: 2,
    polokwane: 3
  };

  const campusIdToSlug: Record<number, string> = {
    1: 'south',
    2: 'emalahleni',
    3: 'polokwane'
  };

  const campusOptions = [
    { key: 'south', label: 'South', id: 1 },
    { key: 'emalahleni', label: 'eMalahleni', id: 2 },
    { key: 'polokwane', label: 'Polokwane', id: 3 }
  ];

  const [selectedCampus, setSelectedCampus] = useState<number>(1);

  // Category mapping
  const categoryMap: Record<string, number> = {
    'Announcement': 1,
    'Academic': 2,
    'Registration': 3,
    'Event': 4,
    'WIL': 5,
    'Deadline': 6
  };

  const categoryIdToName: Record<number, string> = {
    1: 'Announcement',
    2: 'Academic',
    3: 'Registration',
    4: 'Event',
    5: 'WIL',
    6: 'Deadline'
  };

  // Toast and delete states
  const [toast, setToast] = useState<{ id: number; type: 'success' | 'error'; message: string; detail?: string } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const pushToast = (type: 'success' | 'error', message: string, detail?: string) => {
    const id = Date.now();
    setToast({ id, type, message, detail });
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setToast(current => current?.id === id ? null : current);
    }, 5000);
  };

  // Blank news form
  const blankNews: Omit<NewsItem, 'id' | 'date'> = {
    title: '',
    summary: '',
    content: '',
    category: 'Announcement',
    priority: 'medium',
    campus: 'south',
    department: '',
    isUrgent: false,
    isVisible: true
  } as any;

  const [newsForm, setNewsForm] = useState<Omit<NewsItem, 'id' | 'date'>>(blankNews);

  // Fetch news from API
  const fetchNews = async (): Promise<NewsItem[]> => {
    try {
      const res = await axios.get(`${API_URL}news/`);
      const rawData = Array.isArray(res.data) ? res.data : [];

      return rawData.map((n: any) => ({
        id: n.news_id?.toString() || n.id?.toString() || '',
        title: n.title || n.newsTitle || '',
        summary: n.summary || n.newsDescription || n.description || '',
        content: n.content || n.newsDescription || n.description || '',
        category: n.category_name || n.category || 'Announcement',
        category_id: n.category_id,
        campus: n.campus_slug || n.campus || 'south',
        campus_id: n.campus_id,
        priority: n.priority || 'medium',
        isUrgent: !!n.is_urgent,
        isVisible: n.is_visible !== undefined ? !!n.is_visible : true,
        date: n.created_at || n.createdAt || n.date || new Date().toISOString(),
        department: n.department || undefined,
        admin_id: n.admin_id
      })).filter((n: NewsItem) => n.title.trim());
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  };

  // Fetch news effect
  useEffect(() => {
    if (activeTab !== 'news' && activeTab !== 'overview') return;

    let cancelled = false;
    (async () => {
      setNewsLoading(true);
      setNewsError('');
      try {
        let list = await fetchNews();

        // Apply campus filter
        if (newsCampusFilter !== 'all') {
          const allowedCampusIds = campusOptions
            .filter(c => c.key === newsCampusFilter)
            .map(c => c.id);
          list = list.filter(n => allowedCampusIds.includes((n as any).campus_id));
        }

        // Apply search filter
        if (newsSearch) {
          const q = newsSearch.toLowerCase();
          list = list.filter(n => n.title?.toLowerCase().includes(q));
        }

        if (!cancelled) {
          setNewsItems(list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
      } catch (err: any) {
        if (!cancelled) {
          setNewsError(err?.message || 'Failed to fetch news');
          // Fallback to local store
          const campus = newsCampusFilter === 'all' ? undefined : newsCampusFilter;
          const fallback = newsStore.list(campus, newsSearch);
          setNewsItems(fallback);
        }
      } finally {
        if (!cancelled) setNewsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [newsCampusFilter, newsSearch, activeTab]);

  // Deduplicate and paginate news
  const dedupedNews = useMemo(() => {
    const map = new Map<string, NewsItem>();
    for (const n of newsItems) {
      const existing = map.get(n.id);
      if (!existing) map.set(n.id, n);
      else {
        try {
          if (new Date(n.date).getTime() > new Date(existing.date).getTime()) map.set(n.id, n);
        } catch { /* ignore date parse issues */ }
      }
    }
    return Array.from(map.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [newsItems]);

  const totalNewsPages = Math.max(1, Math.ceil(dedupedNews.length / NEWS_PAGE_SIZE));
  const paginatedNews = dedupedNews.slice((newsPage - 1) * NEWS_PAGE_SIZE, newsPage * NEWS_PAGE_SIZE);
  const newsFrom = dedupedNews.length ? (newsPage - 1) * NEWS_PAGE_SIZE + 1 : 0;
  const newsTo = Math.min(dedupedNews.length, newsPage * NEWS_PAGE_SIZE);

  // Reset page when filters change
  useEffect(() => { setNewsPage(1); }, [newsCampusFilter, newsSearch]);
  useEffect(() => { if (newsPage > totalNewsPages) setNewsPage(totalNewsPages); }, [totalNewsPages, newsPage]);

  // Refresh news function
  const refreshNews = async () => {
    setNewsLoading(true);
    setNewsError('');
    try {
      let list = await fetchNews();

      if (newsCampusFilter !== 'all') {
        const allowedCampusIds = campusOptions
          .filter(c => c.key === newsCampusFilter)
          .map(c => c.id);
        list = list.filter(n => allowedCampusIds.includes((n as any).campus_id));
      }

      if (newsSearch) {
        const q = newsSearch.toLowerCase();
        list = list.filter(n => n.title?.toLowerCase().includes(q));
      }

      setNewsItems(list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err: any) {
      setNewsError(err?.message || 'Failed to refresh news');
      const campus = newsCampusFilter === 'all' ? undefined : newsCampusFilter;
      const fallback = newsStore.list(campus, newsSearch);
      setNewsItems(fallback);
    } finally {
      setNewsLoading(false);
    }
  };

  // Create News Function with proper campus ID handling
  const createNews = async () => {
    if (!newsForm.title.trim()) {
      pushToast('error', 'Validation Error', 'Title is required');
      return;
    }

    if (!newsForm.summary.trim()) {
      pushToast('error', 'Validation Error', 'Description is required');
      return;
    }

    setNewsLoading(true);
    setNewsError('');

    try {
      // Get admin ID
      let adminId: number | undefined;
      const stored = sessionStorage.getItem('adminNumericId');
      if (stored) {
        const n = Number(stored);
        if (!Number.isNaN(n)) adminId = n;
      }

      if (!adminId) {
        const currentAdmin = sessionStorage.getItem('currentAdmin');
        if (currentAdmin) {
          try {
            const parsed = JSON.parse(currentAdmin);
            const possible = [parsed.adminId, parsed.AdminId, parsed.id, parsed.Id];
            for (const v of possible) {
              const n = Number(v);
              if (!Number.isNaN(n)) {
                adminId = n;
                break;
              }
            }
          } catch { }
        }
      }

      // Use selectedCampus directly for campus_id
      const campusId = selectedCampus;

      // Prepare data for API
      const newsData = {
        title: newsForm.title,
        summary: newsForm.summary,
        content: newsForm.content || newsForm.summary,
        category_id: categoryMap[newsForm.category] || 1,
        campus_id: campusId,
        priority: newsForm.priority || 'medium',
        is_urgent: !!newsForm.isUrgent,
        admin_id: adminId,
        is_visible: true
      };

      // Create news via API
      const response = await axios.post(`${API_URL}news/`, newsData);

      if (response.data.success) {
        pushToast('success', 'News Created', 'News item created successfully');

        // Reset form and refresh data
        setShowNewsForm(false);
        setNewsForm(blankNews);
        setSelectedCampus(1);
        await refreshNews();
      } else {
        throw new Error(response.data.error || 'Failed to create news');
      }

    } catch (err: any) {
      console.error('Error creating news:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create news';
      pushToast('error', 'Create Failed', errorMessage);
      setNewsError(errorMessage);

      // Fallback to local storage
      newsStore.create({
        ...newsForm,
        campus: campusIdToSlug[selectedCampus] as any
      });
    } finally {
      setNewsLoading(false);
    }
  };

  // Update News Function with proper campus ID handling
  const updateNews = async () => {
    if (!editingNews || !newsForm.title.trim()) {
      pushToast('error', 'Validation Error', 'Title is required');
      return;
    }

    if (!newsForm.summary.trim()) {
      pushToast('error', 'Validation Error', 'Description is required');
      return;
    }

    setNewsLoading(true);
    setNewsError('');

    try {
      // Use selectedCampus directly for campus_id
      const campusId = selectedCampus;

      // Prepare data for API
      const newsData = {
        title: newsForm.title,
        summary: newsForm.summary,
        content: newsForm.content || newsForm.summary,
        category_id: categoryMap[newsForm.category] || 1,
        campus_id: campusId,
        priority: newsForm.priority || 'medium',
        is_urgent: !!newsForm.isUrgent,
        is_visible: !!newsForm.isVisible
      };

      // Update news via API
      const response = await axios.put(`${API_URL}news/${editingNews.id}`, newsData);

      if (response.data.success) {
        pushToast('success', 'News Updated', 'News item updated successfully');

        // Reset form and refresh data
        setShowNewsForm(false);
        setEditingNews(null);
        setNewsForm(blankNews);
        setSelectedCampus(1);
        await refreshNews();
      } else {
        throw new Error(response.data.error || 'Failed to update news');
      }

    } catch (err: any) {
      console.error('Error updating news:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update news';
      pushToast('error', 'Update Failed', errorMessage);
      setNewsError(errorMessage);

      // Fallback to local storage
      newsStore.update(editingNews.id, {
        ...newsForm,
        campus: campusIdToSlug[selectedCampus] as any
      } as any);
    } finally {
      setNewsLoading(false);
    }
  };

  // Combined save function that calls the appropriate function
  const handleSaveNews = async () => {
    if (editingNews) {
      await updateNews();
    } else {
      await createNews();
    }
  };

  // Edit news handler
  const handleEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setNewsForm({
      ...item,
      category: item.category || 'Announcement'
    });

    // Set the selected campus based on the item's campus ID
    if (item.campus_id) {
      setSelectedCampus(item.campus_id);
    } else {
      // Fallback to campus slug mapping
      const campusKey = item.campus || 'south';
      const campusOption = campusOptions.find(c => c.key === campusKey);
      setSelectedCampus(campusOption?.id || 1);
    }

    setShowNewsForm(true);
  };

  // Delete news function with better alerts
  const confirmDeleteNews = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);
    setDeleteError('');

    try {
      const response = await axios.delete(`${API_URL}news/${deleteTarget.id}`);

      if (response.data.success) {
        pushToast('success', 'News Deleted', `"${deleteTarget.title}" has been removed successfully`);
        await refreshNews();
      } else {
        throw new Error(response.data.error || 'Failed to delete news');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete news';
      setDeleteError(errorMessage);
      pushToast('error', 'Delete Failed', errorMessage);
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    }
  };

  const openDeleteNews = (item: NewsItem) => {
    setDeleteTarget(item);
    setDeleteError('');
    setShowDeleteDialog(true);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteTarget(null);
    setDeleteError('');
    setDeleteLoading(false);
  };

  // Toggle visibility function with alerts
  const handleToggleNewsVisibility = async (id: string) => {
    const idx = newsItems.findIndex(n => n.id === id);
    if (idx === -1) return;

    const current = newsItems[idx];
    const updated = { ...current, isVisible: !current.isVisible };

    // Optimistic UI update
    setNewsItems(prev => {
      const clone = [...prev];
      clone[idx] = updated;
      return clone;
    });

    try {
      const response = await axios.patch(`${API_URL}news/${id}/toggle-visibility`);

      if (response.data.success) {
        pushToast(
          'success',
          'Visibility Updated',
          `News is now ${updated.isVisible ? 'visible' : 'hidden'}`
        );
      } else {
        throw new Error('Failed to toggle visibility');
      }
    } catch (err) {
      // Revert on failure
      setNewsItems(prev => {
        const clone = [...prev];
        clone[idx] = current;
        return clone;
      });
      pushToast('error', 'Visibility Update Failed', 'Failed to update news visibility');
    }
  };

  // Service management with API integration
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<'All' | Service['category']>('All');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<Omit<Service, 'id'>>({
    title: '',
    category: 'All Students',
    description: '',
    details: '',
    statusLink: '',
    steps: []
  });
  const [newStep, setNewStep] = useState('');

  // Fetch services from API
  const fetchServices = async (): Promise<Service[]> => {
    try {
      const response = await axios.get(`${API_URL}services`);
      const rawData = Array.isArray(response.data) ? response.data : [];

      return rawData.map((s: any) => ({
        id: s.service_id?.toString() || s.id?.toString() || '',
        title: s.title || s.service_title || '',
        description: s.description || s.service_description || '',
        details: s.details || s.service_details || '',
        category: s.category_name || s.category || 'All Students',
        statusLink: s.status_link || s.statusLink || '',
        steps: s.steps ? (Array.isArray(s.steps) ? s.steps : JSON.parse(s.steps)) : []
      })).filter((s: Service) => s.title.trim());
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  };

  // Fetch services effect
  useEffect(() => {
    if (activeTab !== 'services') return;

    let cancelled = false;
    (async () => {
      setServicesLoading(true);
      setServicesError('');
      try {
        let list = await fetchServices();

        // Apply category filter
        if (serviceCategoryFilter !== 'All') {
          list = list.filter(s => s.category === serviceCategoryFilter);
        }

        // Apply search filter
        if (serviceSearch) {
          const q = serviceSearch.toLowerCase();
          list = list.filter(s =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q)
          );
        }

        if (!cancelled) {
          setServices(list);
        }
      } catch (err: any) {
        if (!cancelled) {
          setServicesError(err?.message || 'Failed to fetch services');
          // Fallback to local store
          const fallback = serviceStore.list(
            serviceCategoryFilter === 'All' ? undefined : serviceCategoryFilter
          );
          if (serviceSearch) {
            const filtered = fallback.filter(s =>
              s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
              s.description.toLowerCase().includes(serviceSearch.toLowerCase())
            );
            setServices(filtered);
          } else {
            setServices(fallback);
          }
        }
      } finally {
        if (!cancelled) setServicesLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [activeTab, serviceSearch, serviceCategoryFilter]);

  // Refresh services function
  const refreshServices = async () => {
    setServicesLoading(true);
    setServicesError('');
    try {
      let list = await fetchServices();

      if (serviceCategoryFilter !== 'All') {
        list = list.filter(s => s.category === serviceCategoryFilter);
      }

      if (serviceSearch) {
        const q = serviceSearch.toLowerCase();
        list = list.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
        );
      }

      setServices(list);
    } catch (err: any) {
      setServicesError(err?.message || 'Failed to refresh services');
      const fallback = serviceStore.list(
        serviceCategoryFilter === 'All' ? undefined : serviceCategoryFilter
      );
      if (serviceSearch) {
        const filtered = fallback.filter(s =>
          s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
          s.description.toLowerCase().includes(serviceSearch.toLowerCase())
        );
        setServices(filtered);
      } else {
        setServices(fallback);
      }
    } finally {
      setServicesLoading(false);
    }
  };

  // API-based service operations
  const handleSaveService = async () => {
    if (!serviceForm.title.trim()) {
      pushToast('error', 'Validation Error', 'Service title is required');
      return;
    }

    try {
      if (editingService) {
        // Update service via API
        const serviceData = {
          title: serviceForm.title,
          description: serviceForm.description,
          details: serviceForm.details,
          category: serviceForm.category,
          status_link: serviceForm.statusLink,
          steps: JSON.stringify(serviceForm.steps || [])
        };

        const response = await axios.put(`${API_URL}services/${editingService.id}`, serviceData);

        if (response.data.success) {
          pushToast('success', 'Service Updated', `"${serviceForm.title}" has been updated`);
          await refreshServices();
        } else {
          throw new Error(response.data.error || 'Failed to update service');
        }
      } else {
        // Create service via API
        const serviceData = {
          title: serviceForm.title,
          description: serviceForm.description,
          details: serviceForm.details,
          category: serviceForm.category,
          status_link: serviceForm.statusLink,
          steps: JSON.stringify(serviceForm.steps || [])
        };

        const response = await axios.post(`${API_URL}services`, serviceData);

        if (response.data.success) {
          pushToast('success', 'Service Created', `"${serviceForm.title}" has been created`);
          await refreshServices();
        } else {
          throw new Error(response.data.error || 'Failed to create service');
        }
      }

      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({
        title: '',
        category: 'All Students',
        description: '',
        details: '',
        statusLink: '',
        steps: []
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save service';
      pushToast('error', 'Operation Failed', errorMessage);

      // Fallback to local storage
      if (editingService) {
        serviceStore.update(editingService.id, serviceForm);
      } else {
        serviceStore.create(serviceForm);
      }
      refreshServices();
    }
  };

  const handleEditService = (s: Service) => {
    setEditingService(s);
    const { id, ...rest } = s;
    setServiceForm(rest);
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    if (confirm(`Are you sure you want to delete "${service.title}"?`)) {
      try {
        const response = await axios.delete(`${API_URL}services${id}`);

        if (response.data.success) {
          pushToast('success', 'Service Deleted', `"${service.title}" has been removed`);
          await refreshServices();
        } else {
          throw new Error(response.data.error || 'Failed to delete service');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to delete service';
        pushToast('error', 'Delete Failed', errorMessage);

        // Fallback to local storage
        serviceStore.remove(id);
        refreshServices();
      }
    }
  };

  // Step management functions
  const addStep = () => {
    if (!newStep.trim()) {
      pushToast('error', 'Validation Error', 'Step description cannot be empty');
      return;
    }
    setServiceForm({
      ...serviceForm,
      steps: [...(serviceForm.steps || []), newStep.trim()]
    });
    setNewStep('');
  };

  const removeStep = (idx: number) => {
    setServiceForm({
      ...serviceForm,
      steps: (serviceForm.steps || []).filter((_, i) => i !== idx)
    });
  };

  const moveStep = (idx: number, dir: -1 | 1) => {
    const steps = [...(serviceForm.steps || [])];
    const target = idx + dir;
    if (target < 0 || target >= steps.length) return;
    [steps[idx], steps[target]] = [steps[target], steps[idx]];
    setServiceForm({ ...serviceForm, steps });
  };

  // Departments management
  const [departmentsByCampus, setDepartmentsByCampus] = useState<Array<{ campusId: number; campusName: string; departments: Department[] }>>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState('');

  // Fetch departments data - FIXED VERSION
  useEffect(() => {
    if (activeTab !== 'departments') return;

    const fetchDepartments = async () => {
      setDepartmentsLoading(true);
      setDepartmentsError('');

      try {
        const response = await axios.get(`${API_URL}departments`);
        const departmentsData = response.data;

        // The API now returns the data already grouped by campus
        setDepartmentsByCampus(departmentsData);
      } catch (error: any) {
        console.error('Error fetching departments:', error);
        setDepartmentsError('Failed to fetch departments');
        pushToast('error', 'Departments Error', 'Failed to load departments data');
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, [activeTab]);

  // Load courses for a department
  const loadCoursesForDepartment = async (departmentId: string): Promise<Course[]> => {
    try {
      const response = await axios.get(`${API_URL}departments/${departmentId}`);
      return response.data.courses || [];
    } catch (error) {
      console.error('Error loading courses:', error);
      pushToast('error', 'Courses Error', 'Failed to load courses for this department');
      return [];
    }
  };

  // Admin profile
  const [adminProfile, setAdminProfile] = useState<{ initials?: string; surname?: string; email?: string }>({});
  const [showProfile, setShowProfile] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('currentAdmin');
      if (raw) {
        const obj = JSON.parse(raw);
        setAdminProfile({
          initials: obj.initials || obj.name || obj.Initials || obj.Name,
          surname: obj.surname || obj.Surname,
          email: obj.email || obj.Email
        });
      }
    } catch { }
  }, []);

  const openProfile = () => setShowProfile(true);
  const closeProfile = () => setShowProfile(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node))
        setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Logout functionality
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const requestLogout = () => { setShowProfile(false); setShowLogoutConfirm(true); };
  const cancelLogoutConfirm = () => setShowLogoutConfirm(false);
  const performLogout = () => { setShowLogoutConfirm(false); onLogout(); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center space-x-4">
              <img
                src={tutLogo}
                alt="TUT Logo"
                className="h-[72px] md:h-[84px] w-auto rounded-md shadow-sm object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-start leading-tight select-none">
                <span className="text-sm font-mono text-gray-700 tabular-nums" aria-label="Current time">{currentTime}</span>
                <span className="text-[11px] font-medium text-gray-500" aria-label="Current date">{currentDate}</span>
              </div>

              {/* Notifications Panel */}
              {/* <NotificationsPanel /> */}

              {/* Profile avatar button */}
              <button onClick={openProfile} className="relative group flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-200 hover:shadow transition">
                <div className="w-10 h-10 rounded-full bg-[#003e87] flex items-center justify-center text-white font-semibold shadow-inner">
                  {(adminProfile.initials || 'AD').slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-tight truncate max-w-[120px]">{adminProfile.surname || 'Admin'}</p>
                  <p className="text-[11px] text-gray-500 truncate max-w-[120px]">{adminProfile.email || '—'}</p>
                </div>
                <span className="sr-only">Open profile menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-stretch space-x-8 h-full">
          <div className="w-72 bg-white rounded-lg shadow-sm p-6 sticky top-20 h-[calc(100vh-5rem)] overflow-auto">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${activeTab === tab.id ? 'bg-[#003e87] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <IconComponent className="w-5 h-5 shrink-0" />
                    <span className="whitespace-nowrap text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1 min-h-full">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Enhanced Stats Grid with Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            {/* Add trend indicators */}
                            {stat.label === 'News Articles' && (
                              <p className="text-xs text-green-600 font-medium mt-1">
                                ↗ 12% this month
                              </p>
                            )}
                            {stat.label === 'Active Services' && (
                              <p className="text-xs text-blue-600 font-medium mt-1">
                                → Steady
                              </p>
                            )}
                            {stat.label === 'Urgent News' && (
                              <p className="text-xs text-red-600 font-medium mt-1">
                                ⚠ Requires attention
                              </p>
                            )}
                          </div>
                          <div className={`p-3 rounded-lg ${stat.color}`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Analytics Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* News Distribution Chart */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">News Distribution</h3>
                      <span className="text-xs text-gray-500">By Category</span>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600">News Analytics</p>
                        <p className="text-xs text-gray-500 mt-1">Category breakdown available</p>
                        <button
                          onClick={() => setActiveTab('news')}
                          className="mt-2 px-3 py-1 bg-[#003e87] text-white text-xs rounded hover:bg-blue-700"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Department Overview Chart */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
                      <span className="text-xs text-gray-500">By Campus</span>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600">Department Analytics</p>
                        <p className="text-xs text-gray-500 mt-1">Campus distribution available</p>
                        <button
                          onClick={() => setActiveTab('departments')}
                          className="mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">System Health</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Database</span>
                        <span className="text-green-600 font-medium">✓ Online</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">API Status</span>
                        <span className="text-green-600 font-medium">✓ Healthy</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Uptime</span>
                        <span className="text-gray-900 font-medium">99.9%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Activity className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Recent Activity</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">New News (7d)</span>
                        <span className="text-gray-900 font-medium">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">New Services</span>
                        <span className="text-gray-900 font-medium">2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">User Logins</span>
                        <span className="text-gray-900 font-medium">142</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Content Overview</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Courses</span>
                        <span className="text-gray-900 font-medium">{dashboardStats.courses}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active Admins</span>
                        <span className="text-gray-900 font-medium">{dashboardStats.activeAdmins}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Service Categories</span>
                        <span className="text-gray-900 font-medium">3</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent News Articles */}
                <div className="bg-white rounded-lg shadow-sm min-h-[420px]">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Recent News Articles</h2>
                      <p className="text-sm text-gray-600 mt-1">Latest updates from all campuses</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('news')}
                      className="px-4 py-2 bg-[#003e87] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Manage News
                    </button>
                  </div>
                  <div className="p-6">
                    {newsLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading news...</span>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {dedupedNews.filter(n => n.isVisible !== false).slice(0, 6).map(item => (
                          <div
                            key={item.id}
                            className="group relative rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            onClick={() => { handleEditNews(item); setActiveTab('news'); }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-sm font-semibold text-gray-900 pr-2 line-clamp-2" title={item.title}>
                                {item.title}
                              </h3>
                              <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${item.priority === 'high' ? 'bg-[#do142c] text-red-700' :
                                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                {item.priority}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-gray-600 line-clamp-3 min-h-[48px]">
                              {item.summary || item.content || '—'}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="text-[10px] text-gray-500">
                                {new Date(item.date).toLocaleDateString('en-ZA', {
                                  year: '2-digit',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-medium">
                                {item.category}
                              </span>
                              {item.campus && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium capitalize">
                                  {item.campus}
                                </span>
                              )}
                              {item.isUrgent && (
                                <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-semibold">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <div className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                        {!newsLoading && newsItems.filter(n => n.isVisible !== false).length === 0 && (
                          <div className="col-span-full text-center py-12">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No news articles found.</p>
                            <button
                              onClick={() => setActiveTab('news')}
                              className="mt-3 px-4 py-2 bg-[#003e87] text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              Create First News Article
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab('news')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <FileText className="w-6 h-6 text-blue-600 mb-2" />
                      <p className="font-medium text-gray-900">Create News</p>
                      <p className="text-sm text-gray-600 mt-1">Add new announcement</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('services')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                    >
                      <Settings className="w-6 h-6 text-green-600 mb-2" />
                      <p className="font-medium text-gray-900">Manage Services</p>
                      <p className="text-sm text-gray-600 mt-1">Update service info</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('departments')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                    >
                      <Users className="w-6 h-6 text-purple-600 mb-2" />
                      <p className="font-medium text-gray-900">Departments</p>
                      <p className="text-sm text-gray-600 mt-1">Manage departments</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('users')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left"
                    >
                      <Users className="w-6 h-6 text-orange-600 mb-2" />
                      <p className="font-medium text-gray-900">User Management</p>
                      <p className="text-sm text-gray-600 mt-1">Admin accounts</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'departments' && (
              <div className="space-y-6">
                {departmentsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600">Loading departments...</span>
                  </div>
                ) : departmentsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{departmentsError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <DepartmentsSection
                    departments={departmentsByCampus}
                    onLoadCourses={loadCoursesForDepartment}
                  />
                )}
              </div>
            )}

            {activeTab === 'news' && (
              <div className="space-y-6">
                <NewsManagementSection
                  newsItems={newsItems}
                  paginatedNews={paginatedNews}
                  newsLoading={newsLoading}
                  newsError={newsError}
                  newsCampusFilter={newsCampusFilter}
                  search={newsSearch}
                  onSearchChange={(v) => setNewsSearch(v)}
                  newsFrom={newsFrom}
                  newsTo={newsTo}
                  total={newsItems.length}
                  page={newsPage}
                  totalPages={totalNewsPages}
                  onCampusFilterChange={(v) => setNewsCampusFilter(v as any)}
                  onAdd={() => {
                    setEditingNews(null);
                    setNewsForm(blankNews);
                    setSelectedCampus(1);
                    setShowNewsForm(true);
                  }}
                  onPrev={() => setNewsPage(p => Math.max(1, p - 1))}
                  onNext={() => setNewsPage(p => Math.min(totalNewsPages, p + 1))}
                  onToggleVisibility={handleToggleNewsVisibility}
                  onEdit={(item) => { handleEditNews(item); }}
                  onDelete={(item) => openDeleteNews(item)}
                />

                {showNewsForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                      <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {editingNews ? 'Edit News' : 'Create News'}
                          </h3>
                          <button
                            onClick={() => {
                              setShowNewsForm(false);
                              setEditingNews(null);
                              setNewsForm(blankNews);
                              setSelectedCampus(1);
                            }}
                            className="p-2 rounded-full hover:bg-gray-100"
                          >
                            <EyeOff className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Title *</label>
                            <input
                              value={newsForm.title}
                              onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter title"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Campus *</label>
                            <select
                              value={selectedCampus}
                              onChange={e => setSelectedCampus(Number(e.target.value))}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {campusOptions.map(campus => (
                                <option key={campus.key} value={campus.id}>
                                  {campus.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Category *</label>
                            <select
                              value={newsForm.category}
                              onChange={e => setNewsForm({ ...newsForm, category: e.target.value as any })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="Announcement">Announcement</option>
                              <option value="Academic">Academic</option>
                              <option value="Registration">Registration</option>
                              <option value="Event">Event</option>
                              <option value="WIL">WIL</option>
                              <option value="Deadline">Deadline</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Priority *</label>
                            <select
                              value={newsForm.priority}
                              onChange={e => setNewsForm({ ...newsForm, priority: e.target.value as any })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Department (optional)</label>
                            <input
                              value={newsForm.department || ''}
                              onChange={e => setNewsForm({ ...newsForm, department: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g. IT, CS"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              id="urgent"
                              type="checkbox"
                              checked={!!newsForm.isUrgent}
                              onChange={e => setNewsForm({ ...newsForm, isUrgent: e.target.checked || undefined })}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor="urgent" className="text-sm text-gray-700">Mark as urgent</label>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Description *</label>
                            <textarea
                              value={newsForm.summary}
                              onChange={e => setNewsForm({ ...newsForm, summary: e.target.value })}
                              rows={4}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter description"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                          <button
                            onClick={() => {
                              setShowNewsForm(false);
                              setEditingNews(null);
                              setNewsForm(blankNews);
                              setSelectedCampus(1);
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveNews}
                            className="px-4 py-2 bg-[#003e87] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            disabled={!newsForm.title || !newsForm.summary || newsLoading}
                          >
                            {newsLoading ? 'Saving...' : editingNews ? 'Update News' : 'Create News'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <ServicesManagementSection
                services={services}
                serviceSearch={serviceSearch}
                serviceCategoryFilter={serviceCategoryFilter}
                onSearchChange={(v) => setServiceSearch(v)}
                onCategoryChange={(v) => setServiceCategoryFilter(v as any)}
                onAdd={() => {
                  setEditingService(null);
                  setServiceForm({
                    title: '',
                    category: 'All Students',
                    description: '',
                    details: '',
                    statusLink: '',
                    steps: []
                  });
                  setShowServiceForm(true);
                }}
                onEdit={(s) => handleEditService(s)}
                onDelete={(id) => handleDeleteService(id)}
                showForm={showServiceForm}
                editingService={editingService}
                serviceForm={serviceForm}
                setServiceForm={(f) => setServiceForm(f)}
                onCloseForm={() => {
                  setShowServiceForm(false);
                  setEditingService(null);
                  setServiceForm({
                    title: '',
                    category: 'All Students',
                    description: '',
                    details: '',
                    statusLink: '',
                    steps: []
                  });
                }}
                onSave={handleSaveService}
                newStep={newStep}
                setNewStep={(v) => setNewStep(v)}
                addStep={addStep}
                removeStep={removeStep}
                moveStep={moveStep}
                servicesLoading={servicesLoading}
                servicesError={servicesError}
                onRefresh={refreshServices}
              />
            )}

            {activeTab === 'statistics' && (
              <div className="space-y-6">
                <StudentStatisticsSection />
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <AdminUserManagement />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <SystemSettingsSection />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#do142c] text-red-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Delete News</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
                </p>
              </div>
            </div>
            {deleteError && <p className="text-xs text-red-600">{deleteError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={cancelDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteNews}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className={`relative overflow-hidden rounded-xl shadow-2xl border max-w-sm w-full mx-4 animate-fade-in pointer-events-auto ${toast.type === 'success' ? 'bg-white border-green-200' : 'bg-white border-red-200'}`}>
            <div className="p-4 pr-5 flex items-start gap-3">
              <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${toast.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-[#do142c] text-red-600'}`}>
                {toast.type === 'success' ? '✓' : '!'}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {toast.message}
                </p>
                {toast.detail && <p className="mt-1 text-xs text-gray-600 leading-relaxed">{toast.detail}</p>}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => setToast(null)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-900 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500"
                  >
                    Done
                  </button>
                </div>
              </div>
              <button
                onClick={() => setToast(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
              <div className={`absolute inset-x-0 bottom-0 h-1 ${toast.type === 'success' ? 'bg-green-500' : 'bg-[#do142c]'}`}></div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeProfile}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-5 relative" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={closeProfile}
              aria-label="Close profile"
            >
              ✕
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-inner">
                {(adminProfile.initials || 'AD').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-gray-900 truncate">{adminProfile.surname || 'Administrator'}</p>
                <p className="text-sm text-gray-600 truncate">{adminProfile.initials || 'N/A'} • {adminProfile.email || 'no-email'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-gray-500 font-medium mb-1">Initials</p>
                <p className="text-gray-900 font-semibold">{adminProfile.initials || '—'}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-gray-500 font-medium mb-1">Surname</p>
                <p className="text-gray-900 font-semibold truncate">{adminProfile.surname || '—'}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 col-span-2">
                <p className="text-gray-500 font-medium mb-1">Email</p>
                <p className="text-gray-900 font-semibold truncate">{adminProfile.email || '—'}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={closeProfile}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={requestLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
            <p className="text-sm text-gray-600">Are you sure you want to log out of the admin dashboard?</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={cancelLogoutConfirm}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={performLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;