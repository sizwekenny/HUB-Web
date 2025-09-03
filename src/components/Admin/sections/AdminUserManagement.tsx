import React, { useEffect, useState } from 'react';
import { adminStore } from '../../../utils/adminStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, UserPlus, Shield, Edit, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface Admin { id: string; name: string; surname: string; email: string; phone: string; role: 'Super Admin'|'Admin'; createdAt: string; lastLogin: string; }

const AdminUserManagement: React.FC = () => {
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const navigate = useNavigate();
  useEffect(() => { setAdmins(adminStore.getAllAdmins()); }, []);

  const [newAdmin, setNewAdmin] = useState({ initials: '', surname: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string,string> = {};
    if(!newAdmin.initials.trim()) newErrors.initials='Initials are required';
    if(!newAdmin.surname.trim()) newErrors.surname='Surname is required';
    if(!newAdmin.email.trim()) newErrors.email='Email is required'; else if(!/\S+@\S+\.\S+/.test(newAdmin.email)) newErrors.email='Email is invalid';
    if(!newAdmin.password) newErrors.password='Password is required'; else if(newAdmin.password.length<6) newErrors.password='Password must be at least 6 characters';
    if(newAdmin.password !== newAdmin.confirmPassword) newErrors.confirmPassword='Passwords do not match';
    if(adminStore.emailExists(newAdmin.email)) newErrors.email='Email already exists';
    setErrors(newErrors); return Object.keys(newErrors).length===0;
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault(); if(!validateForm()) return; setIsSubmitting(true);
    try {
      await axios.post(`/api/admin/addAdmin`, { initials:newAdmin.initials, surname:newAdmin.surname, email:newAdmin.email, password:newAdmin.password });
      adminStore.addAdmin({ name:newAdmin.initials, surname:newAdmin.surname, email:newAdmin.email, phone:'', password:newAdmin.password, role:'Admin' });
      setAdmins(adminStore.getAllAdmins());
      setNewAdmin({ initials:'', surname:'', email:'', password:'', confirmPassword:'' });
      setShowAddAdminForm(false); setErrors({}); navigate('/admin/dashboard');
    } catch(err){ console.error('Error adding admin:', err); } finally { setIsSubmitting(false); }
  };
  const handleDeleteAdmin = (id:string) => { if(window.confirm('Are you sure you want to delete this admin?')) { if(adminStore.deleteAdmin(id)) setAdmins(adminStore.getAllAdmins()); } };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Management</h2>
              <p className="text-sm text-gray-600 mt-1">Manage administrator accounts and permissions</p>
            </div>
            <button onClick={()=>setShowAddAdminForm(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"><UserPlus className="w-4 h-4" /><span>Add Admin</span></button>
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
                {admins.map(admin => (
                  <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Shield className="w-5 h-5 text-blue-600" /></div>
                        <div>
                          <p className="font-medium text-gray-900">{admin.name} {admin.surname}</p>
                          <p className="text-sm text-gray-500">Added {admin.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-900">{admin.email}</span></div>
                        <div className="flex items-center space-x-2"><Phone className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-900">{admin.phone}</span></div>
                      </div>
                    </td>
                    <td className="py-4 px-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${admin.role==='Super Admin' ? 'bg-purple-100 text-purple-800':'bg-blue-100 text-blue-800'}`}>{admin.role}</span></td>
                    <td className="py-4 px-4"><span className="text-sm text-gray-900">{admin.lastLogin}</span></td>
                    <td className="py-4 px-4"><div className="flex items-center space-x-2"><button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"><Edit className="w-4 h-4" /></button>{admin.role!=='Super Admin' && <button onClick={()=>handleDeleteAdmin(admin.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"><Trash2 className="w-4 h-4" /></button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showAddAdminForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3"><div className="p-2 bg-blue-100 rounded-lg"><UserPlus className="w-6 h-6 text-blue-600" /></div><h2 className="text-xl font-semibold text-gray-900">Add New Admin</h2></div>
                <button onClick={()=>{ setShowAddAdminForm(false); setErrors({}); setNewAdmin({ initials:'', surname:'', email:'', password:'', confirmPassword:'' }); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"><Edit className="w-5 h-5 text-gray-400 transform rotate-45" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Initials *</label>
                    <input type="text" value={newAdmin.initials} onChange={e=>setNewAdmin({...newAdmin, initials:e.target.value})} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.initials ? 'border-red-300':'border-gray-300'}`} placeholder="e.g. LW" />
                    {errors.initials && <p className="text-red-500 text-xs mt-1">{errors.initials}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Surname *</label>
                    <input type="text" value={newAdmin.surname} onChange={e=>setNewAdmin({...newAdmin, surname:e.target.value})} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.surname ? 'border-red-300':'border-gray-300'}`} placeholder="Enter surname" />
                    {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" value={newAdmin.email} onChange={e=>setNewAdmin({...newAdmin, email:e.target.value})} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-300':'border-gray-300'}`} placeholder="admin@tut.ac.za" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>{/* Phone removed */}</div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <div className="relative">
                    <input type={showPassword ? 'text':'password'} value={newAdmin.password} onChange={e=>setNewAdmin({...newAdmin, password:e.target.value})} className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-300':'border-gray-300'}`} placeholder="Enter password" />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}</button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <input type="password" value={newAdmin.confirmPassword} onChange={e=>setNewAdmin({...newAdmin, confirmPassword:e.target.value})} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-300':'border-gray-300'}`} placeholder="Confirm password" />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2"><AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" /><div className="text-sm text-blue-800"><p className="font-medium">Admin Permissions:</p><ul className="mt-1 space-y-1 text-xs"><li>• Full access to admin dashboard</li><li>• Can manage news and content</li><li>• Cannot delete Super Admin accounts</li><li>• Cannot modify system settings</li></ul></div></div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={()=>{ setShowAddAdminForm(false); setErrors({}); setNewAdmin({ initials:'', surname:'', email:'', password:'', confirmPassword:'' }); }} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">{isSubmitting ? 'Adding...' : 'Add Admin'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminUserManagement;
