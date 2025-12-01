// import React, { useState, useEffect } from 'react';
// import { Users, Search, Filter, Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, Key } from 'lucide-react';
// import axios from 'axios';

// const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000/api/';

// interface Admin {
//   admin_id: number;
//   initials: string;
//   surname: string;
//   email: string;
//   role: string;
//   phone: string;
//   is_active: boolean;
//   last_login: string;
//   created_at: string;
//   updated_at: string;
// }

// interface Role {
//   role: string;
// }

// const AdminUserManagement: React.FC = () => {
//   const [admins, setAdmins] = useState<Admin[]>([]);
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Filters
//   const [search, setSearch] = useState('');
//   const [roleFilter, setRoleFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalAdmins, setTotalAdmins] = useState(0);
//   const itemsPerPage = 10;

//   // Form state
//   const [showForm, setShowForm] = useState(false);
//   const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
//   const [formData, setFormData] = useState({
//     initials: '',
//     surname: '',
//     email: '',
//     role: 'Admin',
//     phone: '',
//     is_active: true
//   });

//   // Fetch admins
//   const fetchAdmins = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//         ...(search && { search }),
//         ...(roleFilter && { role: roleFilter }),
//         ...(statusFilter && { is_active: statusFilter })
//       });

//       const url = `${API_URL}user-management/admins?${params}`;
//       console.log('🔄 Fetching admins from:', url);
      
//       const response = await axios.get(url);
//       console.log('✅ API Response:', response.data);
      
//       if (response.data.success) {
//         setAdmins(response.data.data.admins);
//         setTotalPages(response.data.data.pagination.total_pages);
//         setTotalAdmins(response.data.data.pagination.total_admins);
//       } else {
//         throw new Error(response.data.error || 'Failed to fetch admins');
//       }
//     } catch (err: any) {
//       console.error('❌ Full error details:', err);
//       console.error('❌ Error response:', err.response);
      
//       if (err.response) {
//         setError(`Server Error: ${err.response.status} - ${err.response.data?.error || err.response.statusText}`);
//       } else if (err.request) {
//         setError('Network Error: Could not connect to the server. Check if the backend is running.');
//       } else {
//         setError(`Request Error: ${err.message}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch roles for filters and form
//   const fetchRoles = async () => {
//     try {
//       const response = await axios.get(`${API_URL}user-management/roles`);
//       if (response.data.success) setRoles(response.data.data);
//     } catch (err) {
//       console.error('Error fetching roles:', err);
//     }
//   };

//   useEffect(() => {
//     fetchAdmins();
//     fetchRoles();
//   }, [currentPage, search, roleFilter, statusFilter]);

//   const handleCreateAdmin = async () => {
//     if (!formData.initials || !formData.surname || !formData.email) {
//       setError('Please fill in all required fields: initials, surname, and email');
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log('🔄 Creating admin with data:', formData);
      
//       const response = await axios.post(`${API_URL}user-management/admins`, formData);
      
//       console.log('✅ Create admin response:', response.data);
      
//       if (response.data.success) {
//         setShowForm(false);
//         setFormData({
//           initials: '',
//           surname: '',
//           email: '',
//           role: 'Admin',
//           phone: '',
//           is_active: true
//         });
        
//         if (response.data.temporary_password) {
//           alert(`✅ Admin created successfully!\nTemporary password: ${response.data.temporary_password}`);
//         } else {
//           alert('✅ Admin created successfully!');
//         }
        
//         fetchAdmins();
//         setError('');
//       } else {
//         throw new Error(response.data.error || 'Failed to create admin');
//       }
//     } catch (err: any) {
//       console.error('💥 Create admin error:', err);
//       console.error('📋 Error response:', err.response?.data);
      
//       let errorMessage = 'Failed to create admin';
      
//       if (err.response?.data) {
//         const errorData = err.response.data;
//         errorMessage = `${errorData.error || 'Error'}`;
//         if (errorData.details) {
//           errorMessage += `\nDetails: ${errorData.details}`;
//         }
//         if (errorData.sqlMessage) {
//           errorMessage += `\nSQL: ${errorData.sqlMessage}`;
//         }
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add the missing handleUpdateAdmin function
//   const handleUpdateAdmin = async () => {
//     if (!editingAdmin) return;

//     if (!formData.initials || !formData.surname || !formData.email) {
//       setError('Please fill in all required fields: initials, surname, and email');
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log('🔄 Updating admin with data:', formData);
      
//       const response = await axios.put(`${API_URL}user-management/admins/${editingAdmin.admin_id}`, formData);
      
//       console.log('✅ Update admin response:', response.data);
      
//       if (response.data.success) {
//         setShowForm(false);
//         setEditingAdmin(null);
//         setFormData({
//           initials: '',
//           surname: '',
//           email: '',
//           role: 'Admin',
//           phone: '',
//           is_active: true
//         });
        
//         alert('✅ Admin updated successfully!');
//         fetchAdmins();
//         setError('');
//       } else {
//         throw new Error(response.data.error || 'Failed to update admin');
//       }
//     } catch (err: any) {
//       console.error('💥 Update admin error:', err);
//       console.error('📋 Error response:', err.response?.data);
      
//       let errorMessage = 'Failed to update admin';
      
//       if (err.response?.data) {
//         const errorData = err.response.data;
//         errorMessage = `${errorData.error || 'Error'}`;
//         if (errorData.details) {
//           errorMessage += `\nDetails: ${errorData.details}`;
//         }
//         if (errorData.sqlMessage) {
//           errorMessage += `\nSQL: ${errorData.sqlMessage}`;
//         }
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleStatus = async (adminId: number) => {
//     try {
//       const response = await axios.patch(`${API_URL}user-management/admins/${adminId}/toggle-status`);
      
//       if (response.data.success) {
//         fetchAdmins();
//       } else {
//         throw new Error(response.data.error || 'Failed to toggle admin status');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.error || err.message || 'Failed to toggle admin status');
//     }
//   };

//   const handleResetPassword = async (adminId: number) => {
//     if (!confirm('Are you sure you want to reset this admin\'s password? They will receive a temporary password.')) return;

//     try {
//       const response = await axios.patch(`${API_URL}user-management/admins/${adminId}/reset-password`);
      
//       if (response.data.success) {
//         alert(`Password reset successfully! Temporary password: ${response.data.data.temporary_password}`);
//         fetchAdmins();
//       } else {
//         throw new Error(response.data.error || 'Failed to reset password');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.error || err.message || 'Failed to reset password');
//     }
//   };

//   const handleDeleteAdmin = async (adminId: number) => {
//     if (!confirm('Are you sure you want to delete this admin?')) return;

//     try {
//       const response = await axios.delete(`${API_URL}user-management/admins/${adminId}`);
      
//       if (response.data.success) {
//         fetchAdmins();
//       } else {
//         throw new Error(response.data.error || 'Failed to delete admin');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.error || err.message || 'Failed to delete admin');
//     }
//   };

//   const openEditForm = (admin: Admin) => {
//     setEditingAdmin(admin);
//     setFormData({
//       initials: admin.initials,
//       surname: admin.surname,
//       email: admin.email,
//       role: admin.role || 'Admin',
//       phone: admin.phone || '',
//       is_active: admin.is_active
//     });
//     setShowForm(true);
//   };

//   const openCreateForm = () => {
//     setEditingAdmin(null);
//     setFormData({
//       initials: '',
//       surname: '',
//       email: '',
//       role: 'Admin',
//       phone: '',
//       is_active: true
//     });
//     setShowForm(true);
//   };

//   const resetFilters = () => {
//     setSearch('');
//     setRoleFilter('');
//     setStatusFilter('');
//     setCurrentPage(1);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-sm">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <h2 className="text-lg font-semibold text-gray-900">Admin Management</h2>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={fetchAdmins}
//                 className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Refresh
//               </button>
//               <button
//                 onClick={openCreateForm}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Admin
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           {/* Filters */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div className="relative">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search admins..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
            
//             <select
//               value={roleFilter}
//               onChange={(e) => setRoleFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">All Roles</option>
//               {roles.map((role, index) => (
//                 <option key={index} value={role.role}>
//                   {role.role}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">All Status</option>
//               <option value="true">Active</option>
//               <option value="false">Inactive</option>
//             </select>
//           </div>

//           {/* Error Display */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//               <p className="text-red-800">{error}</p>
//               <button
//                 onClick={() => setError('')}
//                 className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//               >
//                 Dismiss
//               </button>
//             </div>
//           )}

//           {/* Admins Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-200">
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={6} className="px-4 py-8 text-center">
//                       <div className="flex justify-center items-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                         <span className="ml-3 text-gray-600">Loading admins...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : admins.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
//                       No admins found
//                     </td>
//                   </tr>
//                 ) : (
//                   admins.map(admin => (
//                     <tr key={admin.admin_id} className="hover:bg-gray-50">
//                       <td className="px-4 py-4">
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">
//                             {admin.initials} {admin.surname}
//                           </p>
//                           <p className="text-sm text-gray-500">{admin.email}</p>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4">
//                         <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
//                           {admin.role || 'Admin'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">
//                         {admin.phone || '—'}
//                       </td>
//                       <td className="px-4 py-4">
//                         <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
//                           admin.is_active 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {admin.is_active ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-500">
//                         {admin.last_login 
//                           ? new Date(admin.last_login).toLocaleDateString()
//                           : 'Never'
//                         }
//                       </td>
//                       <td className="px-4 py-4">
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleToggleStatus(admin.admin_id)}
//                             className={`p-1 rounded ${
//                               admin.is_active 
//                                 ? 'text-yellow-600 hover:text-yellow-800' 
//                                 : 'text-green-600 hover:text-green-800'
//                             }`}
//                             title={admin.is_active ? 'Deactivate' : 'Activate'}
//                           >
//                             {admin.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                           </button>
//                           <button
//                             onClick={() => handleResetPassword(admin.admin_id)}
//                             className="p-1 text-purple-600 hover:text-purple-800"
//                             title="Reset Password"
//                           >
//                             <Key className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => openEditForm(admin)}
//                             className="p-1 text-blue-600 hover:text-blue-800"
//                             title="Edit"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteAdmin(admin.admin_id)}
//                             className="p-1 text-red-600 hover:text-red-800"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between mt-6">
//             <div className="text-sm text-gray-700">
//               Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalAdmins)} of {totalAdmins} admins
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Admin Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-6 space-y-6">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   {editingAdmin ? 'Edit Admin' : 'Create Admin'}
//                 </h3>
//                 <button 
//                   onClick={() => setShowForm(false)} 
//                   className="p-2 rounded-full hover:bg-gray-100"
//                 >
//                   ✕
//                 </button>
//               </div>
              
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Initials *</label>
//                   <input 
//                     value={formData.initials} 
//                     onChange={e => setFormData({ ...formData, initials: e.target.value })} 
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
//                     placeholder="Enter initials" 
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Surname *</label>
//                   <input 
//                     value={formData.surname} 
//                     onChange={e => setFormData({ ...formData, surname: e.target.value })} 
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
//                     placeholder="Enter surname" 
//                   />
//                 </div>
                
//                 <div className="space-y-2 md:col-span-2">
//                   <label className="text-sm font-medium text-gray-700">Email *</label>
//                   <input 
//                     type="email"
//                     value={formData.email} 
//                     onChange={e => setFormData({ ...formData, email: e.target.value })} 
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
//                     placeholder="Enter email" 
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Role</label>
//                   <select 
//                     value={formData.role} 
//                     onChange={e => setFormData({ ...formData, role: e.target.value })} 
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     {roles.map((role, index) => (
//                       <option key={index} value={role.role}>
//                         {role.role}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Phone</label>
//                   <input 
//                     value={formData.phone} 
//                     onChange={e => setFormData({ ...formData, phone: e.target.value })} 
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
//                     placeholder="Enter phone number" 
//                   />
//                 </div>
                
//                 <div className="flex items-center space-x-2 md:col-span-2">
//                   <input 
//                     id="is_active" 
//                     type="checkbox" 
//                     checked={formData.is_active} 
//                     onChange={e => setFormData({ ...formData, is_active: e.target.checked })} 
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded" 
//                   />
//                   <label htmlFor="is_active" className="text-sm text-gray-700">Active Admin</label>
//                 </div>
//               </div>
              
//               <div className="flex justify-end gap-3 pt-4 border-t">
//                 <button 
//                   onClick={() => setShowForm(false)} 
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   onClick={editingAdmin ? handleUpdateAdmin : handleCreateAdmin} 
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" 
//                   disabled={loading || !formData.initials || !formData.surname || !formData.email}
//                 >
//                   {loading ? 'Saving...' : editingAdmin ? 'Update Admin' : 'Create Admin'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminUserManagement;


import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, Key } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000/api/';

interface Admin {
  admin_id: number;
  initials: string;
  surname: string;
  email: string;
  role: string;
  phone: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

interface Role {
  role: string;
}

const AdminUserManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const itemsPerPage = 10;

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    initials: '',
    surname: '',
    email: '',
    role: 'Admin',
    phone: '',
    is_active: true
  });

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch admins
  const fetchAdmins = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { is_active: statusFilter })
      });

      const url = `${API_URL}user-management/admins?${params}`;
      console.log('🔄 Fetching admins from:', url);
      
      const response = await axios.get(url);
      console.log('✅ API Response:', response.data);
      
      if (response.data.success) {
        setAdmins(response.data.data.admins);
        setTotalPages(response.data.data.pagination.total_pages);
        setTotalAdmins(response.data.data.pagination.total_admins);
      } else {
        throw new Error(response.data.error || 'Failed to fetch admins');
      }
    } catch (err: any) {
      console.error('❌ Full error details:', err);
      console.error('❌ Error response:', err.response);
      
      if (err.response) {
        setError(`Server Error: ${err.response.status} - ${err.response.data?.error || err.response.statusText}`);
      } else if (err.request) {
        setError('Network Error: Could not connect to the server. Check if the backend is running.');
      } else {
        setError(`Request Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles for filters and form
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_URL}user-management/roles`);
      if (response.data.success) setRoles(response.data.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchRoles();
  }, [currentPage, search, roleFilter, statusFilter]);

  const handleCreateAdmin = async () => {
    if (!formData.initials || !formData.surname || !formData.email) {
      setError('Please fill in all required fields: initials, surname, and email');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Creating admin with data:', formData);
      
      const response = await axios.post(`${API_URL}user-management/admins`, formData);
      
      console.log('✅ Create admin response:', response.data);
      
      if (response.data.success) {
        setShowForm(false);
        setFormData({
          initials: '',
          surname: '',
          email: '',
          role: 'Admin',
          phone: '',
          is_active: true
        });
        
        if (response.data.temporary_password) {
          alert(`✅ Admin created successfully!\nTemporary password: ${response.data.temporary_password}`);
        } else {
          alert('✅ Admin created successfully!');
        }
        
        fetchAdmins();
        setError('');
      } else {
        throw new Error(response.data.error || 'Failed to create admin');
      }
    } catch (err: any) {
      console.error('💥 Create admin error:', err);
      console.error('📋 Error response:', err.response?.data);
      
      let errorMessage = 'Failed to create admin';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        errorMessage = `${errorData.error || 'Error'}`;
        if (errorData.details) {
          errorMessage += `\nDetails: ${errorData.details}`;
        }
        if (errorData.sqlMessage) {
          errorMessage += `\nSQL: ${errorData.sqlMessage}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdmin = async () => {
    if (!editingAdmin) return;

    if (!formData.initials || !formData.surname || !formData.email) {
      setError('Please fill in all required fields: initials, surname, and email');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Updating admin with data:', formData);
      
      const response = await axios.put(`${API_URL}user-management/admins/${editingAdmin.admin_id}`, formData);
      
      console.log('✅ Update admin response:', response.data);
      
      if (response.data.success) {
        setShowForm(false);
        setEditingAdmin(null);
        setFormData({
          initials: '',
          surname: '',
          email: '',
          role: 'Admin',
          phone: '',
          is_active: true
        });
        
        alert('✅ Admin updated successfully!');
        fetchAdmins();
        setError('');
      } else {
        throw new Error(response.data.error || 'Failed to update admin');
      }
    } catch (err: any) {
      console.error('💥 Update admin error:', err);
      console.error('📋 Error response:', err.response?.data);
      
      let errorMessage = 'Failed to update admin';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        errorMessage = `${errorData.error || 'Error'}`;
        if (errorData.details) {
          errorMessage += `\nDetails: ${errorData.details}`;
        }
        if (errorData.sqlMessage) {
          errorMessage += `\nSQL: ${errorData.sqlMessage}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (adminId: number) => {
    try {
      const response = await axios.patch(`${API_URL}user-management/admins/${adminId}/toggle-status`);
      
      if (response.data.success) {
        fetchAdmins();
      } else {
        throw new Error(response.data.error || 'Failed to toggle admin status');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to toggle admin status');
    }
  };

  const handleResetPassword = async (adminId: number) => {
    if (!confirm('Are you sure you want to reset this admin\'s password? They will receive a temporary password.')) return;

    try {
      const response = await axios.patch(`${API_URL}user-management/admins/${adminId}/reset-password`);
      
      if (response.data.success) {
        alert(`Password reset successfully! Temporary password: ${response.data.data.temporary_password}`);
        fetchAdmins();
      } else {
        throw new Error(response.data.error || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to reset password');
    }
  };

  const handleChangePassword = async (adminId: number) => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Changing password for admin:', adminId);
      
      const response = await axios.patch(
        `${API_URL}user-management/admins/${adminId}/change-password`,
        { new_password: passwordData.newPassword }
      );
      
      console.log('✅ Change password response:', response.data);
      
      if (response.data.success) {
        setShowPasswordModal(false);
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setSelectedAdmin(null);
        
        alert('✅ Password changed successfully!');
        setError('');
      } else {
        throw new Error(response.data.error || 'Failed to change password');
      }
    } catch (err: any) {
      console.error('💥 Change password error:', err);
      
      let errorMessage = 'Failed to change password';
      if (err.response?.data) {
        errorMessage = err.response.data.error || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: number) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    try {
      const response = await axios.delete(`${API_URL}user-management/admins/${adminId}`);
      
      if (response.data.success) {
        fetchAdmins();
      } else {
        throw new Error(response.data.error || 'Failed to delete admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to delete admin');
    }
  };

  const openEditForm = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      initials: admin.initials,
      surname: admin.surname,
      email: admin.email,
      role: admin.role || 'Admin',
      phone: admin.phone || '',
      is_active: admin.is_active
    });
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingAdmin(null);
    setFormData({
      initials: '',
      surname: '',
      email: '',
      role: 'Admin',
      phone: '',
      is_active: true
    });
    setShowForm(true);
  };

  const openPasswordModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setShowPasswordModal(true);
    setError('');
  };

  const resetFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Admin Management</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchAdmins}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={openCreateForm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Admin
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search admins..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              {roles.map((role, index) => (
                <option key={index} value={role.role}>
                  {role.role}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError('')}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Admins Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading admins...</span>
                      </div>
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No admins found
                    </td>
                  </tr>
                ) : (
                  admins.map(admin => (
                    <tr key={admin.admin_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {admin.initials} {admin.surname}
                          </p>
                          <p className="text-sm text-gray-500">{admin.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {admin.role || 'Admin'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {admin.phone || '—'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          admin.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {admin.last_login 
                          ? new Date(admin.last_login).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(admin.admin_id)}
                            className={`p-1 rounded ${
                              admin.is_active 
                                ? 'text-yellow-600 hover:text-yellow-800' 
                                : 'text-green-600 hover:text-green-800'
                            }`}
                            title={admin.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {admin.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openPasswordModal(admin)}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Change Password"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(admin.admin_id)}
                            className="p-1 text-purple-600 hover:text-purple-800"
                            title="Reset to Temporary Password"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditForm(admin)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.admin_id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalAdmins)} of {totalAdmins} admins
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingAdmin ? 'Edit Admin' : 'Create Admin'}
                </h3>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Initials *</label>
                  <input 
                    value={formData.initials} 
                    onChange={e => setFormData({ ...formData, initials: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter initials" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Surname *</label>
                  <input 
                    value={formData.surname} 
                    onChange={e => setFormData({ ...formData, surname: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter surname" 
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input 
                    type="email"
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter email" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <select 
                    value={formData.role} 
                    onChange={e => setFormData({ ...formData, role: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {roles.map((role, index) => (
                      <option key={index} value={role.role}>
                        {role.role}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter phone number" 
                  />
                </div>
                
                <div className="flex items-center space-x-2 md:col-span-2">
                  <input 
                    id="is_active" 
                    type="checkbox" 
                    checked={formData.is_active} 
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })} 
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded" 
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700">Active Admin</label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  onClick={() => setShowForm(false)} 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={editingAdmin ? handleUpdateAdmin : handleCreateAdmin} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" 
                  disabled={loading || !formData.initials || !formData.surname || !formData.email}
                >
                  {loading ? 'Saving...' : editingAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Change Password
                </h3>
                <button 
                  onClick={() => setShowPasswordModal(false)} 
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Changing password for: <strong>{selectedAdmin.initials} {selectedAdmin.surname}</strong>
                </p>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">New Password *</label>
                  <input 
                    type="password"
                    value={passwordData.newPassword} 
                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter new password" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password *</label>
                  <input 
                    type="password"
                    value={passwordData.confirmPassword} 
                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Confirm new password" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  onClick={() => setShowPasswordModal(false)} 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleChangePassword(selectedAdmin.admin_id)} 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50" 
                  disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;