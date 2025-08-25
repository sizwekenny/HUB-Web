// Moved original AdminLogin implementation here for proper path resolution
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowLeft, Shield } from 'lucide-react';
// Removed local demo adminStore fallback to enforce backend-only authentication.
import { http, extractErrorMessage } from '../../utils/http';
import { useNavigate } from 'react-router-dom';

interface AdminLoginProps {
	onBack: () => void;
	onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onLoginSuccess }) => {
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (error) setError('');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		try {
				const result = await http.post('/admin/AdminLogin', formData);
				if(result.status === 200){
					sessionStorage.setItem('currentAdmin', JSON.stringify(result.data));
					// Derive numeric admin id for required createNews AdminId query param
					const obj:any = result.data || {};
					const possible = [obj.adminId, obj.AdminId, obj.id, obj.Id];
					let numericId: number | undefined;
					for (const v of possible){
						if (v == null) continue;
						const n = Number(v);
						if (!Number.isNaN(n) && Number.isFinite(n)) { numericId = n; break; }
					}
					if (numericId !== undefined) sessionStorage.setItem('adminNumericId', String(numericId));
					onLoginSuccess();
					navigate('/admin/dashboard');
				}
			} catch (err: any) {
				setError(extractErrorMessage(err) || 'Invalid credentials or server error.');
			} finally { setIsLoading(false);}  
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
			<button onClick={onBack} className="absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
				<ArrowLeft className="w-5 h-5" />
				<span className="font-medium">Back to Home</span>
			</button>
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
							<Shield className="w-12 h-12 text-white" />
						</div>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
					<p className="text-gray-600">Access the ICT Faculty Hub administration panel</p>
				</div>
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
								<input name="email" type="email" value={formData.email} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email" required />
							</div>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
								<input name="password" type={showPassword? 'text':'password'} value={formData.password} onChange={handleInputChange} className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your password" required />
								<button type="button" onClick={()=>setShowPassword(s=>!s)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">{showPassword? <EyeOff className="h-5 w-5"/>:<Eye className="h-5 w-5"/>}</button>
							</div>
						</div>
						{error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
							{error.startsWith('Network error') ? (
								<span>{error}. Ensure backend is running at the configured URL and certificate is trusted (https dev localhost may need to accept cert) and CORS allows this origin.</span>
							) : error}
						</div>}
						<button type="submit" disabled={isLoading||!formData.email||!formData.password} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50">{isLoading? 'Signing In...':'Sign In'}</button>
					</form>
					{/* Demo credentials removed to prevent non-production login paths. */}
				</div>
				<div className="text-center mt-6 text-sm text-gray-500">Having trouble? Contact <a href="mailto:it-support@tut.ac.za" className="text-blue-600 font-medium">IT Support</a></div>
			</div>
		</div>
	);
};

export default AdminLogin;
