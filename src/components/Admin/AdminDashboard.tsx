import React, { useState, useEffect } from 'react';
import {
	Users,
	FileText,
	Settings,
	BarChart3,
	LogOut,
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
	AlertTriangle,
	ListOrdered,
	BookOpen
} from 'lucide-react';
import { adminStore } from '../../utils/adminStore';
import { newsStore } from '../../utils/newsStore'; // kept only as a fallback if API fails
// Using direct axios calls (consistent with AdminLogin pattern)
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NewsItem, Service } from '../../types';
import { serviceStore } from '../../utils/serviceStore';
// (Slideshow moved to AdminLogin per request)

interface AdminDashboardProps {
	onLogout: () => void;
	onBackToHome: () => void;
}

// Lightweight component to update admin initials & surname via backend endpoint /Admin/updateDetails
const AdminDetailsUpdater: React.FC = () => {
	const [initials, setInitials] = useState('');
	const [surname, setSurname] = useState('');
	const [status, setStatus] = useState<'idle'|'saving'|'success'|'error'>('idle');
	const [message, setMessage] = useState('');
	const [touched, setTouched] = useState<{initials:boolean; surname:boolean}>({initials:false, surname:false});

	useEffect(()=>{
		try { const raw = sessionStorage.getItem('currentAdmin'); if(raw){ const obj=JSON.parse(raw); setInitials(obj.initials || obj.Initials || obj.name || ''); setSurname(obj.surname || obj.Surname || ''); } } catch {}
	},[]);

	const validInitials = initials.trim().length>0 && initials.trim().length<=10;
	const validSurname = surname.trim().length>1;
	const disabled = !validInitials || !validSurname || status==='saving';

	const handleSubmit = async (e:React.FormEvent) => {
		e.preventDefault();
		if(disabled) return;
		setStatus('saving'); setMessage('');
		try {
			let adminId: number | undefined; const stored = sessionStorage.getItem('adminNumericId'); if(stored){ const n=Number(stored); if(!Number.isNaN(n)) adminId=n; }
			if(!adminId){ const raw = sessionStorage.getItem('currentAdmin'); if(raw){ try { const obj=JSON.parse(raw); const poss=[obj.adminId,obj.AdminId,obj.id,obj.Id]; for(const v of poss){ const n=Number(v); if(!Number.isNaN(n)){ adminId=n; break; } } } catch{} } }
			if(!adminId) throw new Error('Missing adminId');
			await axios.post('/api/Admin/updateDetails', { adminId, initials: initials.trim(), surname: surname.trim() });
			// Update session copy
			try { const raw = sessionStorage.getItem('currentAdmin'); if(raw){ const obj=JSON.parse(raw); obj.initials = initials.trim(); obj.surname = surname.trim(); sessionStorage.setItem('currentAdmin', JSON.stringify(obj)); } } catch{}
			setStatus('success'); setMessage('Details updated successfully.');
			setTimeout(()=> setStatus('idle'), 2500);
		} catch(err:any){ setStatus('error'); setMessage(err?.response?.data?.message || err?.message || 'Update failed'); }
	};

	return (
		<div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Profile Details</h3>
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="grid md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Initials<span className="text-red-500">*</span></label>
						<input value={initials} onChange={e=>setInitials(e.target.value)} onBlur={()=>setTouched(t=>({...t,initials:true}))} className={`w-full px-3 py-2 rounded-lg border ${!validInitials && touched.initials ? 'border-red-300 focus:ring-red-500 focus:border-red-500':'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} maxLength={10} placeholder="e.g. LRP" />
						{!validInitials && touched.initials && <p className="mt-1 text-xs text-red-600">Provide 1–10 character initials.</p>}
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Surname<span className="text-red-500">*</span></label>
						<input value={surname} onChange={e=>setSurname(e.target.value)} onBlur={()=>setTouched(t=>({...t,surname:true}))} className={`w-full px-3 py-2 rounded-lg border ${!validSurname && touched.surname ? 'border-red-300 focus:ring-red-500 focus:border-red-500':'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} placeholder="Surname" />
						{!validSurname && touched.surname && <p className="mt-1 text-xs text-red-600">Surname must be at least 2 characters.</p>}
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button type="submit" disabled={disabled} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
						{status==='saving' && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
						<span>{status==='saving' ? 'Saving...' : 'Update Details'}</span>
					</button>
					{status==='success' && <span className="text-xs text-green-600 font-medium">{message}</span>}
					{status==='error' && <span className="text-xs text-red-600 font-medium">{message}</span>}
				</div>
			</form>
		</div>
	);
};

// Separate component for updating admin email via /Admin/updateEmail endpoint
const AdminEmailUpdater: React.FC = () => {
	const [email, setEmail] = useState('');
	const [originalEmail, setOriginalEmail] = useState('');
	const [status, setStatus] = useState<'idle'|'saving'|'success'|'error'>('idle');
	const [message, setMessage] = useState('');
	const [touched, setTouched] = useState(false);

	useEffect(()=>{ try { const raw = sessionStorage.getItem('currentAdmin'); if(raw){ const obj=JSON.parse(raw); const e=obj.email || obj.Email || ''; setEmail(e); setOriginalEmail(e);} } catch{} },[]);

	const validEmail = /.+@.+\..+/.test(email.trim());
	const changed = email.trim() !== originalEmail.trim();
	const disabled = !validEmail || !changed || status==='saving';

	const handleSubmit = async (e:React.FormEvent) => {
		e.preventDefault(); if(disabled) return; setStatus('saving'); setMessage('');
		try {
			let adminId: number | undefined; const stored = sessionStorage.getItem('adminNumericId'); if(stored){ const n=Number(stored); if(!Number.isNaN(n)) adminId=n; }
			if(!adminId){ const raw = sessionStorage.getItem('currentAdmin'); if(raw){ try { const obj=JSON.parse(raw); const poss=[obj.adminId,obj.AdminId,obj.id,obj.Id]; for(const v of poss){ const n=Number(v); if(!Number.isNaN(n)){ adminId=n; break; } } } catch{} } }
			if(!adminId) throw new Error('Missing admin id');
			await axios.post('/api/Admin/updateEmail', { id: adminId, email: email.trim() });
			try { const raw = sessionStorage.getItem('currentAdmin'); if(raw){ const obj=JSON.parse(raw); obj.email = email.trim(); sessionStorage.setItem('currentAdmin', JSON.stringify(obj)); } } catch{}
			setOriginalEmail(email.trim());
			setStatus('success'); setMessage('Email updated successfully.');
			setTimeout(()=> setStatus('idle'), 2500);
		} catch(err:any){ setStatus('error'); setMessage(err?.response?.data?.message || err?.message || 'Update failed'); }
	};

	return (
		<div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">Update Email</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
					<input value={email} onChange={e=>{setEmail(e.target.value); if(!touched) setTouched(true);}} onBlur={()=>setTouched(true)} type="email" className={`w-full px-3 py-2 rounded-lg border ${(!validEmail && touched)?'border-red-300 focus:ring-red-500 focus:border-red-500':'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} placeholder="admin@example.com" />
					{!validEmail && touched && <p className="mt-1 text-xs text-red-600">Enter a valid email.</p>}
				</div>
				<div className="flex items-center gap-3">
					<button type="submit" disabled={disabled} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
						{status==='saving' && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
						<span>{status==='saving' ? 'Updating...' : 'Update Email'}</span>
					</button>
					{status==='success' && <span className="text-xs text-green-600 font-medium">{message}</span>}
					{status==='error' && <span className="text-xs text-red-600 font-medium">{message}</span>}
				</div>
			</form>
			{changed && validEmail && status!=='saving' && <p className="mt-2 text-[11px] text-gray-500">Remember to use the new email next time you sign in.</p>}
		</div>
	);
};

// Password update component using /Admin/updatePassword
const AdminPasswordUpdater: React.FC = () => {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [show, setShow] = useState<{current:boolean; next:boolean; confirm:boolean}>({current:false,next:false,confirm:false});
	const [status, setStatus] = useState<'idle'|'saving'|'success'|'error'>('idle');
	const [message, setMessage] = useState('');
	const minLen = 8;
	const validNew = newPassword.length >= minLen && newPassword !== currentPassword;
	const match = newPassword === confirmPassword && confirmPassword.length>0;
	const disabled = !currentPassword || !validNew || !match || status==='saving';

	// Strength scoring (simple heuristic): length, variety of char classes
	const strengthScore = (() => {
		if(!newPassword) return 0;
		let score = 0;
		const pw = newPassword;
		if(pw.length >= 8) score += 1;
		if(pw.length >= 12) score += 1;
		if(/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
		if(/[0-9]/.test(pw)) score += 1;
		if(/[^A-Za-z0-9]/.test(pw)) score += 1;
		return Math.min(score,5);
	})();
	const strengthLabel = ['','Weak','Fair','Good','Strong','Excellent'][strengthScore];
	const strengthColor = ['bg-gray-300','bg-red-500','bg-amber-500','bg-blue-500','bg-green-500','bg-emerald-600'][strengthScore];

	const submit = async (e:React.FormEvent) => {
		e.preventDefault(); if(disabled) return; setStatus('saving'); setMessage('');
		try {
			let adminId: number | undefined; const stored = sessionStorage.getItem('adminNumericId'); if(stored){ const n=Number(stored); if(!Number.isNaN(n)) adminId=n; }
			if(!adminId){ const raw = sessionStorage.getItem('currentAdmin'); if(raw){ try { const obj=JSON.parse(raw); const poss=[obj.adminId,obj.AdminId,obj.id,obj.Id]; for(const v of poss){ const n=Number(v); if(!Number.isNaN(n)){ adminId=n; break; } } } catch{} } }
			if(!adminId) throw new Error('Missing admin id');
			await axios.post('/api/Admin/updatePassword', { id: adminId, currentPassword, password: newPassword });
			setStatus('success'); setMessage('Password updated. Use the new password next login.');
			setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
			setTimeout(()=> setStatus('idle'), 3000);
		} catch(err:any){ setStatus('error'); setMessage(err?.response?.data?.message || err?.message || 'Update failed'); }
	};

	return (
		<div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">Update Password</h3>
			<form onSubmit={submit} className="space-y-5">
				<div className="grid md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Current Password<span className="text-red-500">*</span></label>
						<div className="relative">
							<input type={show.current? 'text':'password'} value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"/>
							<button type="button" onClick={()=>setShow(s=>({...s,current:!s.current}))} className="absolute inset-y-0 right-0 px-3 text-xs text-gray-500 hover:text-gray-700">{show.current? 'Hide':'Show'}</button>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">New Password<span className="text-red-500">*</span></label>
						<div className="relative">
							<input type={show.next? 'text':'password'} value={newPassword} onChange={e=>setNewPassword(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${(newPassword && !validNew)?'border-red-300 focus:ring-red-500 focus:border-red-500':'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}/>
							<button type="button" onClick={()=>setShow(s=>({...s,next:!s.next}))} className="absolute inset-y-0 right-0 px-3 text-xs text-gray-500 hover:text-gray-700">{show.next? 'Hide':'Show'}</button>
						</div>
						{newPassword && (
							<div className="mt-2 space-y-1">
								<div className="flex items-center justify-between text-[11px] font-medium">
									<span className="text-gray-600">Strength:</span>
									<span className={`text-gray-700 ${strengthScore<=2?'text-red-600':strengthScore===3?'text-amber-600':strengthScore>=4?'text-green-600':''}`}>{strengthLabel}</span>
								</div>
								<div className="flex gap-1" aria-hidden="true">
									{[1,2,3,4,5].map(i => (
										<div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${strengthScore>=i ? strengthColor : 'bg-gray-200'}`}></div>
									))}
								</div>
								{!validNew && <p className="text-[11px] text-red-600">Must be at least {minLen} chars & different from current.</p>}
								{validNew && strengthScore<3 && <p className="text-[11px] text-amber-600">Consider adding uppercase, numbers & symbols for a stronger password.</p>}
							</div>
						)}
					</div>
						<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password<span className="text-red-500">*</span></label>
						<div className="relative">
							<input type={show.confirm? 'text':'password'} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${(confirmPassword && !match)?'border-red-300 focus:ring-red-500 focus:border-red-500':'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}/>
							<button type="button" onClick={()=>setShow(s=>({...s,confirm:!s.confirm}))} className="absolute inset-y-0 right-0 px-3 text-xs text-gray-500 hover:text-gray-700">{show.confirm? 'Hide':'Show'}</button>
						</div>
						{confirmPassword && !match && <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>}
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button type="submit" disabled={disabled} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
						{status==='saving' && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
						<span>{status==='saving' ? 'Updating...' : 'Update Password'}</span>
					</button>
					{status==='success' && <span className="text-xs text-green-600 font-medium">{message}</span>}
					{status==='error' && <span className="text-xs text-red-600 font-medium">{message}</span>}
				</div>
			</form>
			<p className="mt-3 text-[11px] text-gray-500">After changing, you will stay logged in for this session. Use the new password next time you log in.</p>
		</div>
	);
};

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

// Using relative /api base via http instance to avoid CORS in dev (proxied by Vite)

const AdminUserManagement: React.FC = () => {
	const [showAddAdminForm, setShowAddAdminForm] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [admins, setAdmins] = useState<Admin[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		setAdmins(adminStore.getAllAdmins());
	}, []);

	const [newAdmin, setNewAdmin] = useState({
		initials: '',
		surname: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		if (!newAdmin.initials.trim()) newErrors.initials = 'Initials are required';
		if (!newAdmin.surname.trim()) newErrors.surname = 'Surname is required';
		if (!newAdmin.email.trim()) newErrors.email = 'Email is required';
		else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) newErrors.email = 'Email is invalid';
		if (!newAdmin.password) newErrors.password = 'Password is required';
		else if (newAdmin.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
		if (newAdmin.password !== newAdmin.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
		if (adminStore.emailExists(newAdmin.email)) newErrors.email = 'Email already exists';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;
		setIsSubmitting(true);
		try {
			await axios.post(`/api/admin/addAdmin`, {
				initials: newAdmin.initials,
				surname: newAdmin.surname,
				email: newAdmin.email,
				password: newAdmin.password
			});
			// Add to local store for immediate UI feedback (using initials as name)
			adminStore.addAdmin({
				name: newAdmin.initials,
				surname: newAdmin.surname,
				email: newAdmin.email,
				phone: '',
				password: newAdmin.password,
				role: 'Admin'
			});
			setAdmins(adminStore.getAllAdmins());
			setNewAdmin({ initials: '', surname: '', email: '', password: '', confirmPassword: '' });
			setShowAddAdminForm(false);
			setErrors({});
			navigate('/admin/dashboard');
		} catch (error) {
			console.error('Error adding admin:', error);
		} finally { setIsSubmitting(false); }
	};

	const handleDeleteAdmin = (id: string) => {
		if (window.confirm('Are you sure you want to delete this admin?')) {
			if (adminStore.deleteAdmin(id)) setAdmins(adminStore.getAllAdmins());
		}
	};

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-sm">
				<div className="p-6 border-b border-gray-200">
					<div className="flex justify-between items-center">
						<div>
							<h2 className="text-lg font-semibold text-gray-900">Admin Management</h2>
							<p className="text-sm text-gray-600 mt-1">Manage administrator accounts and permissions</p>
						</div>
						<button onClick={() => setShowAddAdminForm(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
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
								{admins.map(admin => (
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
											<span className={`px-2 py-1 text-xs font-medium rounded-full ${admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{admin.role}</span>
										</td>
										<td className="py-4 px-4"><span className="text-sm text-gray-900">{admin.lastLogin}</span></td>
										<td className="py-4 px-4">
											<div className="flex items-center space-x-2">
												<button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"><Edit className="w-4 h-4" /></button>
												{admin.role !== 'Super Admin' && (
													<button onClick={() => handleDeleteAdmin(admin.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"><Trash2 className="w-4 h-4" /></button>
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
			{showAddAdminForm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center space-x-3">
									<div className="p-2 bg-blue-100 rounded-lg"><UserPlus className="w-6 h-6 text-blue-600" /></div>
									<h2 className="text-xl font-semibold text-gray-900">Add New Admin</h2>
								</div>
								<button onClick={() => { setShowAddAdminForm(false); setErrors({}); setNewAdmin({ initials: '', surname: '', email: '', password: '', confirmPassword: '' }); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
									<Edit className="w-5 h-5 text-gray-400 transform rotate-45" />
								</button>
							</div>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Initials *</label>
										<input type="text" value={newAdmin.initials} onChange={e => setNewAdmin({ ...newAdmin, initials: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.initials ? 'border-red-300' : 'border-gray-300'}`} placeholder="e.g. LW" />
										{errors.initials && <p className="text-red-500 text-xs mt-1">{errors.initials}</p>}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Surname *</label>
										<input type="text" value={newAdmin.surname} onChange={e => setNewAdmin({ ...newAdmin, surname: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.surname ? 'border-red-300' : 'border-gray-300'}`} placeholder="Enter surname" />
										{errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
									<input type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`} placeholder="admin@tut.ac.za" />
									{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
								</div>
								<div>
									{/* Phone removed - not required by endpoint */}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
									<div className="relative">
										<input type={showPassword ? 'text' : 'password'} value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-300' : 'border-gray-300'}`} placeholder="Enter password" />
										<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}</button>
									</div>
									{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
									<input type="password" value={newAdmin.confirmPassword} onChange={e => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`} placeholder="Confirm password" />
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
									<button type="button" onClick={() => { setShowAddAdminForm(false); setErrors({}); setNewAdmin({ initials: '', surname: '', email: '', password: '', confirmPassword: '' }); }} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">Cancel</button>
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

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onBackToHome: _onBackToHome }) => {
	const [activeTab, setActiveTab] = useState('overview');
	const navigate = useNavigate();
	const stats = [
		{ label: 'Total Students', value: '12,450', icon: Users, color: 'bg-blue-500' },
		{ label: 'News Articles', value: '47', icon: FileText, color: 'bg-blue-600' },
		{ label: 'Active Services', value: '18', icon: Settings, color: 'bg-blue-700' },
		{ label: 'Monthly Views', value: '89.2k', icon: BarChart3, color: 'bg-blue-800' },
	];
	const tabs = [
		{ id: 'overview', label: 'Overview', icon: BarChart3 },
		{ id: 'news', label: 'News Management', icon: FileText },
		{ id: 'services', label: 'Services Management', icon: BookOpen },
		{ id: 'users', label: 'User Management', icon: Users },
		{ id: 'settings', label: 'Settings', icon: Settings },
	];
	const [newsCampusFilter, setNewsCampusFilter] = useState<'all' | 'south' | 'emalahleni' | 'polokwane'>('all');
	const [newsSearch, setNewsSearch] = useState('');
	// Pagination state for News Management
	const [newsPage, setNewsPage] = useState(1);
	const NEWS_PAGE_SIZE = 10;
	const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
	const [showNewsForm, setShowNewsForm] = useState(false);
	const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
	const [newsLoading, setNewsLoading] = useState(false);
	const [newsError, setNewsError] = useState<string>('');
	const [services, setServices] = useState<Service[]>(serviceStore.list());
	const [serviceSearch, setServiceSearch] = useState('');
	const [serviceCategoryFilter, setServiceCategoryFilter] = useState<'All' | Service['category']>('All');
	const [showServiceForm, setShowServiceForm] = useState(false);
	const [editingService, setEditingService] = useState<Service | null>(null);
	const [serviceForm, setServiceForm] = useState<Omit<Service, 'id'>>({ title: '', category: 'All Students', description: '', details: '', statusLink: '', steps: [] });
	const [newStep, setNewStep] = useState('');

	// Delete news modal + toast
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
	const [deletePassword, setDeletePassword] = useState('');
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteError, setDeleteError] = useState('');
	const [toast, setToast] = useState<{ id:number; type:'success'|'error'; message:string; detail?:string }|null>(null);
	const pushToast = (type:'success'|'error', message:string, detail?:string) => {
		const id = Date.now();
		setToast({ id, type, message, detail });
	};
	const blankNews: Omit<NewsItem, 'id' | 'date'> = { title: '', summary: '', content: '', category: 'Announcement', priority: 'medium', campus: 'south', department: '' } as any;
	const [newsForm, setNewsForm] = useState<Omit<NewsItem, 'id' | 'date'>>(blankNews);

	// Derived pagination values for news
	const totalNewsPages = Math.max(1, Math.ceil(newsItems.length / NEWS_PAGE_SIZE));
	const paginatedNews = newsItems.slice((newsPage - 1) * NEWS_PAGE_SIZE, newsPage * NEWS_PAGE_SIZE);
	const newsFrom = newsItems.length ? (newsPage - 1) * NEWS_PAGE_SIZE + 1 : 0;
	const newsTo = Math.min(newsItems.length, newsPage * NEWS_PAGE_SIZE);

	// Reset page when filters/search change
	useEffect(() => { setNewsPage(1); }, [newsCampusFilter, newsSearch]);
	// Clamp page if data shrinks
	useEffect(() => { if (newsPage > totalNewsPages) setNewsPage(totalNewsPages); }, [totalNewsPages, newsPage]);
	const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]); // for multi-campus create
	const campusOptions = [
		{ key: 'south', label: 'South' },
		{ key: 'emalahleni', label: 'eMalahleni' },
		{ key: 'polokwane', label: 'Polokwane' }
	];
	const toggleCampus = (key: string) => {
		setSelectedCampuses(prev => prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]);
	};

	// Utility: safe ID generation (older browsers may lack crypto.randomUUID)
	const genId = () => {
		try { const c:any = crypto; if (c?.randomUUID) return c.randomUUID(); } catch {}
		return Math.random().toString(36).slice(2, 11);
	};

	// Reusable backend fetch + normalization (direct axios to /api/News/getAllNews)
	const fetchAndNormalizeNews = async (): Promise<NewsItem[]> => {
		const res = await axios.get(`/api/News/getAllNews`);
		const raw = Array.isArray(res.data) ? res.data : [];
		const campusIdToSlug: Record<number,string> = {1:'south',2:'emalahleni',3:'polokwane'};
		let list: NewsItem[] = raw.map((n:any) => ({
			id: (n.newsId ?? n.id ?? genId()).toString(),
			title: n.newsTitle ?? n.title ?? '',
			summary: n.newsDescription ?? n.description ?? n.summary ?? '',
			content: n.newsDescription ?? n.description ?? n.content ?? '',
			category: n.category ?? 'Announcement',
			priority: n.priority ?? 'medium',
			campus: (campusIdToSlug[Number(n.campusId)] ?? n.campus ?? 'south') as NewsItem['campus'],
			department: n.department ?? undefined,
			date: n.createdAt ?? n.date ?? new Date().toISOString(),
			// Backend default for isVisible is false; map explicitly to boolean
			isVisible: !!n.isVisible,
			isUrgent: n.isUrgent || false
		})).filter(n => n.title.trim());
		return list;
	};

	// Fetch news (overview + news tabs)
	useEffect(() => {
		if (activeTab !== 'news' && activeTab !== 'overview') return;
		let cancelled = false;
		(async () => {
			setNewsLoading(true); setNewsError('');
			try {
				let list = await fetchAndNormalizeNews();
				if (newsCampusFilter !== 'all') {
					const campusMap: Record<string,(string|number)[]> = { south:['south',1,'1'], emalahleni:['emalahleni',2,'2'], polokwane:['polokwane',3,'3'] };
					const allowed = campusMap[newsCampusFilter] || [newsCampusFilter];
					list = list.filter(n => allowed.includes((n as any).campus));
				}
				if (newsSearch) {
					const q = newsSearch.toLowerCase();
					list = list.filter(n => n.title?.toLowerCase().includes(q) || n.summary?.toLowerCase().includes(q));
				}
				if (!cancelled) setNewsItems(list.sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime()));
			} catch (err:any) {
				const campus = newsCampusFilter === 'all' ? undefined : newsCampusFilter;
				const fallback = newsStore.list(campus, newsSearch);
				if (!cancelled) {
					setNewsItems(prev => {
						if (prev.length === 0) return fallback;
						const map = new Map<string,NewsItem>();
						prev.forEach(n => map.set(n.id, n));
						fallback.forEach(n => { if (!map.has(n.id)) map.set(n.id, n); });
						return Array.from(map.values());
					});
					setNewsError(err?.message || 'Using cached data (fetch failed).');
				}
			} finally { if (!cancelled) setNewsLoading(false); }
		})();
		return () => { cancelled = true; };
	}, [newsCampusFilter, newsSearch, activeTab]);
	useEffect(() => { if (activeTab === 'services') refreshServices(); }, [activeTab, serviceSearch, serviceCategoryFilter]);
	const refreshServices = () => { let list = serviceStore.list(serviceCategoryFilter === 'All' ? undefined : serviceCategoryFilter); if (serviceSearch) list = list.filter(s => s.title.toLowerCase().includes(serviceSearch.toLowerCase()) || s.description.toLowerCase().includes(serviceSearch.toLowerCase())); setServices(list); };
	const handleSaveService = () => { if (!serviceForm.title.trim()) return; if (editingService) serviceStore.update(editingService.id, serviceForm); else serviceStore.create(serviceForm); setShowServiceForm(false); setEditingService(null); setServiceForm({ title: '', category: 'All Students', description: '', details: '', statusLink: '', steps: [] }); refreshServices(); };
	const handleEditService = (s: Service) => { setEditingService(s); const { id, ...rest } = s; setServiceForm(rest); setShowServiceForm(true); };
	const handleDeleteService = (id: string) => { if (confirm('Delete this service?')) { serviceStore.remove(id); refreshServices(); } };
	const addStep = () => { if (!newStep.trim()) return; setServiceForm({ ...serviceForm, steps: [...(serviceForm.steps || []), newStep.trim()] }); setNewStep(''); };
	const removeStep = (idx: number) => { setServiceForm({ ...serviceForm, steps: (serviceForm.steps || []).filter((_, i) => i !== idx) }); };
	const moveStep = (idx: number, dir: -1 | 1) => { const steps = [...(serviceForm.steps || [])]; const target = idx + dir; if (target < 0 || target >= steps.length) return; [steps[idx], steps[target]] = [steps[target], steps[idx]]; setServiceForm({ ...serviceForm, steps }); };
	const refreshNews = async () => {
		setNewsLoading(true); setNewsError('');
		try {
			let list = await fetchAndNormalizeNews();
			if (newsCampusFilter !== 'all') {
				const campusMap: Record<string,(string|number)[]> = { south:['south',1,'1'], emalahleni:['emalahleni',2,'2'], polokwane:['polokwane',3,'3'] };
				const allowed = campusMap[newsCampusFilter] || [newsCampusFilter];
				list = list.filter(n => allowed.includes((n as any).campus));
			}
			if (newsSearch) {
				const q = newsSearch.toLowerCase();
				list = list.filter(n => n.title?.toLowerCase().includes(q) || n.summary?.toLowerCase().includes(q));
			}
			setNewsItems(list.sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime()));
		} catch (err:any) {
			const campus = newsCampusFilter === 'all' ? undefined : newsCampusFilter;
			const fallback = newsStore.list(campus, newsSearch);
			setNewsItems(prev => {
				if (prev.length === 0) return fallback;
				const map = new Map<string,NewsItem>();
				prev.forEach(n => map.set(n.id, n));
				fallback.forEach(n => { if (!map.has(n.id)) map.set(n.id, n); });
				return Array.from(map.values());
			});
			setNewsError(err?.message || 'Using cached data (refresh failed).');
		} finally { setNewsLoading(false); }
	};

	const handleSaveNews = async () => {
		if (!newsForm.title.trim()) return;
		if (!editingNews && selectedCampuses.length === 0) return; // need at least one campus when creating
		setNewsLoading(true); setNewsError('');
		try {
			// Resolve adminId (required by backend create endpoint)
			let adminId: number | undefined;
			const stored = sessionStorage.getItem('adminNumericId');
			if (stored) { const n = Number(stored); if (!Number.isNaN(n)) adminId = n; }
			if (!adminId) {
				const currentAdmin = sessionStorage.getItem('currentAdmin');
				if (currentAdmin) {
					try { const parsed = JSON.parse(currentAdmin); const possible = [parsed.adminId, parsed.AdminId, parsed.id, parsed.Id]; for (const v of possible){ const n = Number(v); if (!Number.isNaN(n)) { adminId = n; break; } } } catch {}
				}
			}
			if (!editingNews && !adminId) throw new Error('Missing AdminId: please re-login.');

			if (editingNews) {
				// PUT /api/News/updateNews expects all fields as query params + optional formFile (multipart)
				try {
					const campusMap: Record<string, number> = { south: 1, emalahleni: 2, polokwane: 3 };
					const campusKey = (editingNews.campus || newsForm.campus || 'south') as keyof typeof campusMap;
					const campusId = campusMap[campusKey] || 1;
					const params = {
						NewsId: Number(editingNews.id),
						Title: newsForm.title,
						Description: newsForm.summary || '',
						Priority: newsForm.priority,
						Category: newsForm.category,
						CampusId: campusId
					};
					const file = (newsForm as any).file as File | undefined;
					if (file) {
						const fd = new FormData();
						fd.append('formFile', file); // name per swagger (case-insensitive usually)
						await axios.put(`/api/News/updateNews`, fd, { params });
					} else {
						// No file: send empty body with query params
						await axios.put(`/api/News/updateNews`, {}, { params });
					}
				} catch (updateErr:any) {
					console.error('Update news failed', updateErr?.response?.status, updateErr?.response?.data || updateErr?.message);
					// fallback to legacy/local update so UI remains responsive
					newsStore.update(editingNews.id, newsForm as any);
				}
			} else {
				// Multi-campus create in a single request if backend supports CampusIds[], else fallback to first
				const campusMap: Record<string, number> = { south: 1, emalahleni: 2, polokwane: 3 };
				const campusIds = selectedCampuses.map(c => campusMap[c]).filter(Boolean);
				const file = (newsForm as any).file as File | undefined;
				const baseParams: any = {
					AdminId: adminId!,
					Title: newsForm.title,
					Description: newsForm.summary || '',
					Priority: newsForm.priority,
					Category: newsForm.category,
					CampusIds: campusIds,
					...(newsForm.department ? { Department: newsForm.department } : {})
				};
				// Serialize arrays as repeated query params (?CampusIds=1&CampusIds=2)
				const paramsSerializer = (p:any) => {
					const usp = new URLSearchParams();
					Object.entries(p).forEach(([k,v]) => {
						if (Array.isArray(v)) v.forEach(val => usp.append(k, String(val)));
						else if (v !== undefined && v !== null) usp.append(k, String(v));
					});
					return usp.toString();
				};
				try {
					if (file) {
						const fd = new FormData();
						fd.append('FormFile', file);
						await axios.post(`/api/News/createNews`, fd, { params: baseParams, paramsSerializer });
					} else {
						// Empty body; backend binds from query params
						await axios.post(`/api/News/createNews`, {}, { params: baseParams, paramsSerializer });
					}
				} catch (createErr:any) {
					console.error('Create news failed', createErr?.response?.status, createErr?.response?.data || createErr?.message);
					throw createErr;
				}
			}
			setShowNewsForm(false); setEditingNews(null); setNewsForm(blankNews); setSelectedCampuses([]);
			pushToast('success', editingNews ? 'News updated' : 'News created', editingNews ? 'Changes saved successfully.' : 'New item added successfully.');
			navigate('/admin/dashboard');
			await refreshNews();
			setNewsSearch(''); // clear search bar after delete
		} catch (err:any) {
			// fallback to local mutation if offline/failed
			if (editingNews) newsStore.update(editingNews.id, newsForm); else selectedCampuses.forEach(c => newsStore.create({ ...newsForm, campus: c as any }));
			setNewsError(err?.message || 'Saved locally (offline).');
			setShowNewsForm(false); setEditingNews(null); setNewsForm(blankNews); setSelectedCampuses([]);
			const campus = newsCampusFilter === 'all' ? undefined : newsCampusFilter; setNewsItems(newsStore.list(campus, newsSearch));
		} finally { setNewsLoading(false); }
	};

	const handleEditNews = (item: NewsItem) => { setEditingNews(item); setNewsForm({ ...item }); setShowNewsForm(true); };

	const openDeleteNews = (item: NewsItem) => { setDeleteTarget(item); setDeletePassword(''); setDeleteError(''); setShowDeleteDialog(true); };
	const confirmDeleteNews = async () => {
		if (!deleteTarget) return; if (!deletePassword.trim()) { setDeleteError('Password is required'); return; }
		setDeleteLoading(true); setDeleteError('');
		try {
			// Resolve adminId
			let adminId: number | undefined; const stored = sessionStorage.getItem('adminNumericId'); if (stored){ const n=Number(stored); if(!Number.isNaN(n)) adminId=n; }
			if (!adminId){ const ca=sessionStorage.getItem('currentAdmin'); if (ca){ try { const p=JSON.parse(ca); for (const v of [p.adminId,p.AdminId,p.id,p.Id]) { const n=Number(v); if(!Number.isNaN(n)){ adminId=n; break; } } } catch {} } }
			if (!adminId) throw new Error('Missing AdminId');
			await axios.delete(`/api/News/deleteNews`, { data: { newsId: Number(deleteTarget.id), password: deletePassword, adminId } });
			pushToast('success','News item deleted','The selected news entry was removed successfully.');
			setShowDeleteDialog(false); setDeleteTarget(null); setDeletePassword('');
			await refreshNews();
			setNewsSearch(''); // clear search bar after delete
		} catch (err:any) {
			console.error('Delete news failed', err?.response?.status, err?.response?.data || err?.message);
			if (err?.response?.status === 401 || err?.response?.status === 403) setDeleteError('Invalid password'); else setDeleteError(err?.message || 'Delete failed');
			if (!navigator.onLine) { // offline fallback
				newsStore.remove(deleteTarget.id); pushToast('error','Offline delete','Item removed locally while offline.'); setShowDeleteDialog(false); setDeleteTarget(null);
				const campus = newsCampusFilter === 'all' ? undefined : newsCampusFilter; setNewsItems(newsStore.list(campus, newsSearch));
				setNewsSearch(''); // clear search bar after offline delete
			}
		} finally { setDeleteLoading(false); }
	};
	const cancelDelete = () => { if (deleteLoading) return; setShowDeleteDialog(false); setDeleteTarget(null); };

	// Defensive: if opening delete dialog triggers browser autofill placing admin email into search, clear it
	useEffect(() => {
		if (!showDeleteDialog) return;
		try {
			const adminRaw = sessionStorage.getItem('currentAdmin');
			if (!adminRaw) return;
			const parsed = JSON.parse(adminRaw);
			const email = parsed?.email || parsed?.Email || parsed?.userEmail;
			if (email && newsSearch === email) setNewsSearch('');
		} catch {}
	}, [showDeleteDialog, newsSearch]);

	const handleToggleNewsVisibility = async (id: string) => {
		const idx = newsItems.findIndex(n => n.id === id);
		if (idx === -1) return;
		const current = newsItems[idx];
		const updated = { ...current, isVisible: !current.isVisible };
		// Optimistic UI
		setNewsItems(prev => {
			const clone = [...prev];
			clone[idx] = updated;
			return clone;
		});
		try {
			// Call new backend toggle endpoint (it infers new state server-side)
			await axios.put(`/api/News/updateAvailability`, {}, { params: { NewsId: Number(id) } });
		} catch (err) {
			// Revert on failure
			setNewsItems(prev => {
				const clone = [...prev];
				clone[idx] = current;
				return clone;
			});
		}
	};

	// Logout via profile modal
	const confirmLogout = () => { setShowProfile(false); onLogout(); };

	// Admin profile (parsed from sessionStorage currentAdmin)
	const [adminProfile, setAdminProfile] = useState<{initials?:string; surname?:string; email?:string}>({});
	const [showProfile, setShowProfile] = useState(false);
	useEffect(()=>{
		try{
			const raw = sessionStorage.getItem('currentAdmin');
			if(raw){ const obj = JSON.parse(raw); setAdminProfile({ initials: obj.initials || obj.name || obj.Initials || obj.Name, surname: obj.surname || obj.Surname, email: obj.email || obj.Email }); }
		}catch{}
	},[]);
	const openProfile = () => setShowProfile(true);
	const closeProfile = () => setShowProfile(false);

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
							<span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">ICT Faculty Hub</span>
						</div>
						<div className="flex items-center space-x-4">
							{/* Profile avatar button */}
							<button onClick={openProfile} className="relative group flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-200 hover:shadow transition">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-inner">
									{(adminProfile.initials||'AD').slice(0,2).toUpperCase()}
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
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex space-x-8">
					<div className="w-72 bg-white rounded-lg shadow-sm p-6">
						<nav className="space-y-2">
							{tabs.map(tab => { const IconComponent = tab.icon; return (
								<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
									<IconComponent className="w-5 h-5 shrink-0" />
									<span className="whitespace-nowrap text-sm">{tab.label}</span>
								</button>
							); })}
						</nav>
					</div>
					<div className="flex-1">
						{activeTab === 'overview' && (
							<div className="space-y-8">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
									{stats.map((stat, index) => { const IconComponent = stat.icon; return (
										<div key={index} className="bg-white rounded-lg shadow-sm p-6">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-sm font-medium text-gray-600">{stat.label}</p>
													<p className="text-3xl font-bold text-gray-900">{stat.value}</p>
												</div>
												<div className={`p-3 rounded-lg ${stat.color}`}><IconComponent className="w-6 h-6 text-white" /></div>
											</div>
										</div>
									); })}
								</div>
								<div className="bg-white rounded-lg shadow-sm">
									<div className="p-6 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-900">Recent News Articles</h2></div>
									<div className="p-6">
										<div className="space-y-4">
											{newsItems.filter(n => n.isVisible !== false).slice(0,5).map(item => (
												<div key={item.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
													<div className="min-w-0 pr-4">
														<h3 className="font-medium text-gray-900 truncate" title={item.title}>{item.title}</h3>
														<p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
															<span>{new Date(item.date).toLocaleDateString('en-ZA',{year:'numeric',month:'short',day:'numeric'})}</span>
															<span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-medium">{item.category}</span>
															{item.campus && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium capitalize">{item.campus}</span>}
															{item.isUrgent && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold">URGENT</span>}
														</p>
													</div>
													<div className="flex items-center gap-3">
														<span className={`px-2 py-1 rounded-full text-xs font-medium ${item.priority === 'high' ? 'bg-red-100 text-red-700' : item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{item.priority}</span>
														<button
															onClick={(e) => { e.stopPropagation(); handleToggleNewsVisibility(item.id); }}
															aria-label={item.isVisible === false ? 'Enable news item' : 'Disable news item'}
															className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${item.isVisible === false ? 'bg-gray-300' : 'bg-green-500'}`}
														>
															<span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${item.isVisible === false ? 'translate-x-1' : 'translate-x-5'}`}></span>
														</button>
														<button onClick={() => { handleEditNews(item); setActiveTab('news'); }} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
													</div>
												</div>
											))}
											{!newsLoading && newsItems.filter(n=>n.isVisible!==false).length === 0 && (
												<p className="text-sm text-gray-500">No news articles found.</p>
											)}
										</div>
									</div>
								</div>
							</div>
						)}
						{activeTab === 'news' && (
							<div className="space-y-6">
								<div className="bg-white rounded-lg shadow-sm">
									<div className="p-6 border-b border-gray-200">
										<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
											<h2 className="text-lg font-semibold text-gray-900">News Management</h2>
											<div className="flex flex-wrap gap-3 items-center">
												<select value={newsCampusFilter} onChange={e => setNewsCampusFilter(e.target.value as any)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
													<option value="all">All Campuses</option>
													<option value="south">South</option>
													<option value="emalahleni">eMalahleni</option>
													<option value="polokwane">Polokwane</option>
												</select>
												<button onClick={() => { setEditingNews(null); setNewsForm(blankNews); setShowNewsForm(true); }} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"><Plus className="w-4 h-4" /><span>Add News</span></button>
											</div>
										</div>
									</div>
									<div className="p-6">
										<div className="overflow-x-auto max-h-[520px] overflow-y-auto">
											{newsError && <div className="mb-4 p-3 rounded-md bg-yellow-50 text-yellow-800 text-xs border border-yellow-200">{newsError}</div>}
											<table className="w-full text-sm">
												<thead>
													<tr className="border-b border-gray-200 text-left">
														<th className="py-3 px-2 font-semibold text-gray-700">Title</th>
														<th className="py-3 px-2 font-semibold text-gray-700">Campus</th>
														<th className="py-3 px-2 font-semibold text-gray-700">Category</th>
														<th className="py-3 px-2 font-semibold text-gray-700">Priority</th>
														<th className="py-3 px-2 font-semibold text-gray-700">Visible</th>
														<th className="py-3 px-2 font-semibold text-gray-700">Date</th>
														<th className="py-3 px-2 font-semibold text-gray-700 text-right">Actions</th>
													</tr>
												</thead>
												<tbody>
													{newsLoading && newsItems.length === 0 && (
														<tr><td colSpan={7} className="py-8 text-center text-gray-500 text-sm">Loading news...</td></tr>
													)}
													{paginatedNews.map(item => (
														<tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
															<td className="py-3 px-2 max-w-xs">
																<p className="font-medium text-gray-900 line-clamp-1" title={item.title}>{item.title}</p>
																<p className="text-xs text-gray-500 line-clamp-1" title={item.summary}>{item.summary}</p>
															</td>
															<td className="py-3 px-2"><span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium capitalize">{item.campus || 'All'}</span></td>
															<td className="py-3 px-2"><span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">{item.category}</span></td>
															<td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-medium ${item.priority === 'high' ? 'bg-red-100 text-red-700' : item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{item.priority}</span></td>
															<td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isVisible === false ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>{item.isVisible === false ? 'Hidden' : 'Visible'}</span></td>
															<td className="py-3 px-2 whitespace-nowrap">{new Date(item.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
															<td className="py-3 px-2"><div className="flex items-center justify-end space-x-2">
																{/* Visibility toggle switch */}
																<button
																	onClick={(e) => { e.stopPropagation(); handleToggleNewsVisibility(item.id); }}
																	aria-label={item.isVisible === false ? 'Enable news item' : 'Disable news item'}
																	className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${item.isVisible === false ? 'bg-gray-300' : 'bg-green-500'}`}
																>
																	<span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${item.isVisible === false ? 'translate-x-1' : 'translate-x-6'}`}></span>
																</button>
																<button onClick={(e) => { e.stopPropagation(); handleEditNews(item); }} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Edit news"><Edit className="w-4 h-4" /></button>
																<button onClick={(e) => { e.stopPropagation(); openDeleteNews(item); }} className="p-2 text-gray-400 hover:text-red-600 transition-colors" aria-label="Delete news"><Trash2 className="w-4 h-4" /></button>
															</div></td>
														</tr>
													))}
													{newsItems.length === 0 && (
														<tr><td colSpan={6} className="py-10 text-center text-gray-500 text-sm">No news found for current filters.</td></tr>
													)}
												</tbody>
											</table>
											</div>
											{/* Pagination controls */}
											{newsItems.length > 0 && (
												<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-xs text-gray-600">
													<div>Showing {newsFrom}-{newsTo} of {newsItems.length}</div>
													<div className="flex items-center gap-2">
														<button
															type="button"
															onClick={() => setNewsPage(p => Math.max(1, p - 1))}
															disabled={newsPage === 1}
															className="px-2.5 py-1.5 rounded-md border text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
															aria-label="Previous page"
														>Prev</button>
														<span className="min-w-[90px] text-center">Page {newsPage} of {totalNewsPages}</span>
														<button
															type="button"
															onClick={() => setNewsPage(p => Math.min(totalNewsPages, p + 1))}
															disabled={newsPage === totalNewsPages}
															className="px-2.5 py-1.5 rounded-md border text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
															aria-label="Next page"
														>Next</button>
													</div>
												</div>
											)}
									</div>
								</div>
								{showNewsForm && (
									<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
										<div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
											<div className="p-6 space-y-6">
												<div className="flex items-center justify-between">
													<h3 className="text-xl font-semibold text-gray-900">{editingNews ? 'Edit News' : 'Create News'}</h3>
													<button onClick={() => { setShowNewsForm(false); setEditingNews(null); setNewsForm(blankNews); }} className="p-2 rounded-full hover:bg-gray-100"><EyeOff className="w-5 h-5 text-gray-500" /></button>
												</div>
												<div className="grid md:grid-cols-2 gap-4">
													<div className="space-y-2"><label className="text-sm font-medium text-gray-700">Title *</label><input value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter title" /></div>
													<div className="space-y-2">
														<label className="text-sm font-medium text-gray-700">Campus *</label>
														{editingNews ? (
															<div className="px-3 py-2 border rounded-lg bg-gray-50 text-sm capitalize">{editingNews.campus || 'all'}</div>
														) : (
															<div className="border rounded-lg p-2 space-y-1">
																{campusOptions.map(c => (
																	<label key={c.key} className="flex items-center gap-2 text-sm">
																		<input type="checkbox" className="rounded border-gray-300" checked={selectedCampuses.includes(c.key)} onChange={() => toggleCampus(c.key)} />
																		<span className="capitalize">{c.label}</span>
																	</label>
																))}
																{selectedCampuses.length === 0 && <p className="text-xs text-red-600">Select at least one campus.</p>}
															</div>
														)}
													</div>
													<div className="space-y-2"><label className="text-sm font-medium text-gray-700">Category *</label><select value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option value="Announcement">Announcement</option><option value="Academic">Academic</option><option value="Registration">Registration</option><option value="Event">Event</option><option value="WIL">WIL</option></select></div>
													<div className="space-y-2"><label className="text-sm font-medium text-gray-700">Priority *</label><select value={newsForm.priority} onChange={e => setNewsForm({ ...newsForm, priority: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
													<div className="space-y-2"><label className="text-sm font-medium text-gray-700">Department (optional)</label><input value={newsForm.department || ''} onChange={e => setNewsForm({ ...newsForm, department: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. IT, CS" /></div>
													<div className="space-y-2"><label className="text-sm font-medium text-gray-700">Attachment (optional)</label><input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={e => { const file = e.target.files?.[0]; setNewsForm({ ...(newsForm as any), file }); }} className="w-full text-sm" /></div>
													<div className="space-y-2 md:col-span-2"><label className="text-sm font-medium text-gray-700">Description *</label><textarea value={newsForm.summary} onChange={e => setNewsForm({ ...newsForm, summary: e.target.value })} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter description" /></div>
													<div className="flex items-center space-x-2 md:col-span-2"><input id="urgent" type="checkbox" checked={!!newsForm.isUrgent} onChange={e => setNewsForm({ ...newsForm, isUrgent: e.target.checked || undefined })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" /><label htmlFor="urgent" className="text-sm text-gray-700">Mark as urgent</label></div>
												</div>
												<div className="flex justify-end gap-3 pt-4 border-t"><button onClick={() => { setShowNewsForm(false); setEditingNews(null); setNewsForm(blankNews); setSelectedCampuses([]); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button><button onClick={handleSaveNews} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={!newsForm.title || !newsForm.summary || (!editingNews && selectedCampuses.length === 0)}>{editingNews ? 'Update' : 'Create'} News</button></div>
											</div>
										</div>
									</div>
								)}
							</div>
						)}
						{activeTab === 'services' && (
							<div className="space-y-6">
								<div className="bg-white rounded-lg shadow-sm">
									<div className="p-6 border-b border-gray-200">
										<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
											<h2 className="text-lg font-semibold text-gray-900">Services Management</h2>
											<div className="flex flex-wrap gap-3 items-center">
												<select value={serviceCategoryFilter} onChange={e => setServiceCategoryFilter(e.target.value as any)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"><option value="All">All Categories</option><option value="Senior Students">Senior Students</option><option value="Newcomer Students">Newcomer Students</option><option value="All Students">All Students</option></select>
												<div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input value={serviceSearch} onChange={e => setServiceSearch(e.target.value)} placeholder="Search services..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" /></div>
												<button onClick={() => { setEditingService(null); setServiceForm({ title: '', category: 'All Students', description: '', details: '', statusLink: '', steps: [] }); setShowServiceForm(true); }} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"><Plus className="w-4 h-4" /><span>Add Service</span></button>
											</div>
										</div>
									</div>
									<div className="p-6">
										<div className="overflow-x-auto">
											<table className="w-full text-sm">
												<thead><tr className="border-b border-gray-200 text-left"><th className="py-3 px-2 font-semibold text-gray-700">Title</th><th className="py-3 px-2 font-semibold text-gray-700">Category</th><th className="py-3 px-2 font-semibold text-gray-700">Steps</th><th className="py-3 px-2 font-semibold text-gray-700">Quick Link</th><th className="py-3 px-2 font-semibold text-gray-700 text-right">Actions</th></tr></thead>
												<tbody>
													{services.map(s => (
														<tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
															<td className="py-3 px-2 max-w-xs"><p className="font-medium text-gray-900 line-clamp-1" title={s.title}>{s.title}</p><p className="text-xs text-gray-500 line-clamp-1" title={s.description}>{s.description}</p></td>
															<td className="py-3 px-2"><span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{s.category}</span></td>
															<td className="py-3 px-2">{s.steps?.length || 0}</td>
															<td className="py-3 px-2">{s.statusLink ? <a href={s.statusLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">Link</a> : <span className="text-gray-400 text-xs">None</span>}</td>
															<td className="py-3 px-2"><div className="flex items-center justify-end space-x-2"><button onClick={() => handleEditService(s)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button><button onClick={() => handleDeleteService(s.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button></div></td>
														</tr>
													))}
													{services.length === 0 && (
														<tr><td colSpan={5} className="py-10 text-center text-gray-500 text-sm">No services found.</td></tr>
													)}
												</tbody>
											</table>
										</div>
									</div>
								</div>
								{showServiceForm && (
									<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
										<div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
											<div className="p-6 space-y-6">
												<div className="flex items-center justify-between"><h3 className="text-xl font-semibold text-gray-900">{editingService ? 'Edit Service' : 'Create Service'}</h3><button onClick={() => { setShowServiceForm(false); setEditingService(null); }} className="p-2 rounded-full hover:bg-gray-100"><EyeOff className="w-5 h-5 text-gray-500" /></button></div>
												<div className="grid md:grid-cols-2 gap-4">
													<div className="space-y-2"><label className="text-sm font-medium text-gray-700">Title *</label><input value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter title" /></div>
													<div className="space-y-2"><label className="text-sm font-medium text-gray-700">Category</label><select value={serviceForm.category} onChange={e => setServiceForm({ ...serviceForm, category: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option value="Senior Students">Senior Students</option><option value="Newcomer Students">Newcomer Students</option><option value="All Students">All Students</option></select></div>
													<div className="space-y-2 md:col-span-2"><label className="text-sm font-medium text-gray-700">Short Description *</label><textarea value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /></div>
													<div className="space-y-2 md:col-span-2"><label className="text-sm font-medium text-gray-700">Details *</label><textarea value={serviceForm.details} onChange={e => setServiceForm({ ...serviceForm, details: e.target.value })} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /></div>
													<div className="space-y-2 md:col-span-2"><label className="text-sm font-medium text-gray-700">Quick Link (optional)</label><input value={serviceForm.statusLink || ''} onChange={e => setServiceForm({ ...serviceForm, statusLink: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://" /></div>
													<div className="space-y-2 md:col-span-2"><label className="text-sm font-medium text-gray-700 flex items-center gap-2">Steps <ListOrdered className="w-4 h-4 text-gray-500" /></label><div className="space-y-3"><div className="flex gap-2"><input value={newStep} onChange={e => setNewStep(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Add a step and press +" /><button type="button" onClick={addStep} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" /></button></div><ol className="space-y-2 list-decimal ml-5">{(serviceForm.steps || []).map((s, idx) => (<li key={idx} className="bg-gray-50 rounded-lg p-3 flex justify-between items-start gap-3"><span className="text-sm text-gray-800 flex-1 whitespace-pre-wrap">{s}</span><div className="flex gap-1"><button type="button" onClick={() => moveStep(idx, -1)} disabled={idx === 0} className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-40">↑</button><button type="button" onClick={() => moveStep(idx, 1)} disabled={idx === (serviceForm.steps!.length - 1)} className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-40">↓</button><button type="button" onClick={() => removeStep(idx)} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">✕</button></div></li>))}{(serviceForm.steps || []).length === 0 && <p className="text-xs text-gray-500">No steps added yet.</p>}</ol></div></div>
												</div>
												<div className="flex justify-end gap-3 pt-4 border-t"><button onClick={() => { setShowServiceForm(false); setEditingService(null); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button><button onClick={handleSaveService} disabled={!serviceForm.title || !serviceForm.description || !serviceForm.details} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{editingService ? 'Update' : 'Create'} Service</button></div>
											</div>
										</div>
									</div>
								)}
							</div>
						)}
						{activeTab === 'users' && (<div className="space-y-6"><AdminUserManagement /></div>)}
						{activeTab === 'settings' && (
							<div className="bg-white rounded-lg shadow-sm">
								<div className="p-6 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-900">System Settings</h2></div>
								<div className="p-6 space-y-10">
									{/* Admin Details Update */}
									<AdminDetailsUpdater />
									<AdminEmailUpdater />
									<AdminPasswordUpdater />
									{/* Placeholder site configuration (unchanged) */}
									<div className="space-y-6">
										<div>
											<h3 className="text-lg font-medium text-gray-900 mb-4">Site Configuration</h3>
											<div className="space-y-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
													<input type="text" defaultValue="ICT Faculty Hub" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
													<input type="email" defaultValue="info@tut.ac.za" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
												</div>
											</div>
										</div>
										<div className="pt-2"><button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">Save Settings</button></div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			{showDeleteDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6 space-y-5">
						<div className="flex items-start gap-3">
							<div className="p-2 rounded-lg bg-red-100 text-red-600"><Trash2 className="w-5 h-5" /></div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-gray-900">Delete News</h3>
								<p className="text-xs text-gray-600 mt-1">This action is permanent. Enter your admin password to confirm deletion{deleteTarget ? ` of "${deleteTarget.title}"` : ''}.</p>
							</div>
						</div>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">Password</label>
							<input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${deleteError ? 'border-red-300' : 'border-gray-300'}`} placeholder="Enter password" autoFocus />
							{deleteError && <p className="text-xs text-red-600">{deleteError}</p>}
						</div>
						<div className="flex justify-end gap-3 pt-2">
							<button onClick={cancelDelete} disabled={deleteLoading} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50">Cancel</button>
							<button onClick={confirmDeleteNews} disabled={deleteLoading} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">{deleteLoading ? 'Deleting...' : 'Delete'}</button>
						</div>
					</div>
				</div>
			)}
			{toast && (
				<div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
					<div className={`relative overflow-hidden rounded-xl shadow-2xl border max-w-sm w-full mx-4 animate-fade-in pointer-events-auto ${toast.type === 'success' ? 'bg-white border-green-200' : 'bg-white border-red-200'}`}>
						<div className="p-4 pr-5 flex items-start gap-3">
							<div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${toast.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{toast.type === 'success' ? '✓' : '!'}</div>
							<div className="flex-1">
								<p className={`text-sm font-semibold ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{toast.message}</p>
								{toast.detail && <p className="mt-1 text-xs text-gray-600 leading-relaxed">{toast.detail}</p>}
								<div className="mt-3 flex justify-end">
									<button onClick={() => setToast(null)} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-900 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500">Done</button>
								</div>
							</div>
							<button onClick={() => setToast(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" aria-label="Close">✕</button>
							<div className={`absolute inset-x-0 bottom-0 h-1 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
						</div>
					</div>
				</div>
			)}
		{showProfile && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeProfile}>
				<div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-5 relative" onClick={e=>e.stopPropagation()}>
					<button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={closeProfile} aria-label="Close profile">✕</button>
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-inner">
							{(adminProfile.initials||'AD').slice(0,2).toUpperCase()}
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
						<button onClick={closeProfile} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Close</button>
						<button onClick={confirmLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"><LogOut className="w-4 h-4" />Logout</button>
					</div>
				</div>
			</div>
		)}
		</div>
	);
};

export default AdminDashboard;
