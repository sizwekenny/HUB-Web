// Moved original AdminLogin implementation here for proper path resolution
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowLeft, Shield } from 'lucide-react';
import { adminStore } from '../../utils/adminStore';
import { api } from '../../utils/api';

interface AdminLoginProps {
	onBack: () => void;
	onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onLoginSuccess }) => {
	const [formData, setFormData] = useState({ username: '', password: '' });
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

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
			const result = await api.admin.login(formData.username, formData.password);
			if (result && (result.id || result.token)) {
				sessionStorage.setItem('currentAdmin', JSON.stringify(result));
				if (result.token) sessionStorage.setItem('authToken', result.token);
				onLoginSuccess();
			} else {
				const local = adminStore.authenticate(formData.username, formData.password);
				if (local) {
					sessionStorage.setItem('currentAdmin', JSON.stringify(local));
					onLoginSuccess();
				} else setError('Invalid credentials.');
			}
		} catch (err: any) {
			const local = adminStore.authenticate(formData.username, formData.password);
			if (local) {
				sessionStorage.setItem('currentAdmin', JSON.stringify(local));
				onLoginSuccess();
			} else setError(err?.message || 'Login failed.');
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
							<label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
								<input name="username" value={formData.username} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your username" required />
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
						{error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
						<button type="submit" disabled={isLoading||!formData.username||!formData.password} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50">{isLoading? 'Signing In...':'Sign In'}</button>
					</form>
					<div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
						<h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</h3>
						<p className="text-sm text-gray-600"><span className="font-medium">Username:</span> admin</p>
						<p className="text-sm text-gray-600"><span className="font-medium">Password:</span> admin123</p>
					</div>
				</div>
				<div className="text-center mt-6 text-sm text-gray-500">Having trouble? Contact <a href="mailto:it-support@tut.ac.za" className="text-blue-600 font-medium">IT Support</a></div>
			</div>
		</div>
	);
};

export default AdminLogin;
