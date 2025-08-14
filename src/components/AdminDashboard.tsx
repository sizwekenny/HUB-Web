import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  LogOut, 
  Home,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Mail,
  Phone,
  UserPlus,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { adminStore } from '../utils/adminStore';

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
}

interface Admin {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Admin';
  createdAt: string;
  lastLogin: string;
}

const AdminUserManagement: React.FC = () => {
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);

  // Load admins from store on component mount
  useEffect(() => {
    setAdmins(adminStore.getAllAdmins());
  }, []);

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newAdmin.name.trim()) newErrors.name = 'Name is required';
    if (!newAdmin.surname.trim()) newErrors.surname = 'Surname is required';
    if (!newAdmin.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) newErrors.email = 'Email is invalid';
    if (!newAdmin.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?[0-9]{10,}$/.test(newAdmin.phone.replace(/\s/g, ''))) newErrors.phone = 'Phone number is invalid';
    if (!newAdmin.password) newErrors.password = 'Password is required';
    else if (newAdmin.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (newAdmin.password !== newAdmin.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    // Check if email already exists
    if (adminStore.emailExists(newAdmin.email)) {
      newErrors.email = 'Email already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add admin to store
      adminStore.addAdmin({
        name: newAdmin.name,
        surname: newAdmin.surname,
        email: newAdmin.email,
        phone: newAdmin.phone,
        password: newAdmin.password,
        role: 'Admin'
      });
      
      // Update local state
      setAdmins(adminStore.getAllAdmins());
      
      setNewAdmin({
        name: '',
        surname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      setShowAddAdminForm(false);
      setErrors({});
    } catch (error) {
      console.error('Error adding admin:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = (id: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      if (adminStore.deleteAdmin(id)) {
        setAdmins(adminStore.getAllAdmins());
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Management</h2>
              <p className="text-sm text-gray-600 mt-1">Manage administrator accounts and permissions</p>
            </div>
            <button
              onClick={() => setShowAddAdminForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Admin</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Admin</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{admin.name} {admin.surname}</p>
                          <p className="text-sm text-gray-500">Added {admin.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{admin.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{admin.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        admin.role === 'Super Admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900">{admin.lastLogin}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        {admin.role !== 'Super Admin' && (
                          <button 
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdminForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Add New Admin</h2>
                </div>
                <button
                  onClick={() => {
                    setShowAddAdminForm(false);
                    setErrors({});
                    setNewAdmin({
                      name: '',
                      surname: '',
                      email: '',
                      phone: '',
                      password: '',
                      confirmPassword: ''
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <Edit className="w-5 h-5 text-gray-400 transform rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surname *
                    </label>
                    <input
                      type="text"
                      value={newAdmin.surname}
                      onChange={(e) => setNewAdmin({...newAdmin, surname: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.surname ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter surname"
                    />
                    {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="admin@tut.ac.za"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+27123456789"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={newAdmin.confirmPassword}
                    onChange={(e) => setNewAdmin({...newAdmin, confirmPassword: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Admin Permissions:</p>
                      <ul className="mt-1 space-y-1 text-xs">
                        <li>• Full access to admin dashboard</li>
                        <li>• Can manage news and content</li>
                        <li>• Cannot delete Super Admin accounts</li>
                        <li>• Cannot modify system settings</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAdminForm(false);
                      setErrors({});
                      setNewAdmin({
                        name: '',
                        surname: '',
                        email: '',
                        phone: '',
                        password: '',
                        confirmPassword: ''
                      });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onBackToHome }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Students', value: '12,450', icon: Users, color: 'bg-blue-500' },
    { label: 'News Articles', value: '47', icon: FileText, color: 'bg-blue-600' },
    { label: 'Active Services', value: '18', icon: Settings, color: 'bg-blue-700' },
    { label: 'Monthly Views', value: '89.2k', icon: BarChart3, color: 'bg-blue-800' },
  ];

  const recentNews = [
    { id: 1, title: 'Programming B CT2 Venues Released', date: '2024-01-15', status: 'Published' },
    { id: 2, title: 'WIL Opportunities Available', date: '2024-01-14', status: 'Draft' },
    { id: 3, title: 'Semester Test Schedule', date: '2024-01-13', status: 'Published' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'news', label: 'News Management', icon: FileText },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                ICT Faculty Hub
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <Home className="w-4 h-4" />
                <span>Back to Site</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-lg ${stat.color}`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent News Articles</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentNews.map((article) => (
                        <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">{article.title}</h3>
                            <p className="text-sm text-gray-500">{article.date}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              article.status === 'Published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {article.status}
                            </span>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'news' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-900">News Management</h2>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        <Plus className="w-4 h-4" />
                        <span>Add News Article</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search news articles..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>All Categories</option>
                        <option>Academic</option>
                        <option>Registration</option>
                        <option>Events</option>
                        <option>WIL</option>
                      </select>
                    </div>
                    
                    <div className="space-y-4">
                      {recentNews.map((article) => (
                        <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{article.title}</h3>
                            <p className="text-sm text-gray-500">{article.date}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              article.status === 'Published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {article.status}
                            </span>
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <AdminUserManagement />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Site Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Site Title
                          </label>
                          <input
                            type="text"
                            defaultValue="ICT Faculty Hub"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Email
                          </label>
                          <input
                            type="email"
                            defaultValue="info@tut.ac.za"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
