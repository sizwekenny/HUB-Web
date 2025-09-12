// Moved original AdminLogin implementation here for proper path resolution
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Lock, User, ArrowLeft, Shield, Loader2 } from 'lucide-react';
import BackgroundSlideshow from '../BackgroundSlideshow';
import southImg from '../../assets/south.jpg';
import emaImg from '../../assets/emalahleni.jpg';
import polImg from '../../assets/polokwane.png';
import tutImg from '../../assets/TUT.png';
import tutFull from '../../assets/TUT2.png';
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
	const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
	const [capsLock, setCapsLock] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [touched, setTouched] = useState<{email:boolean; password:boolean}>({email:false,password:false});
	const navigate = useNavigate();
	const errorRef = useRef<HTMLDivElement | null>(null);
	const emailInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(()=>{ emailInputRef.current?.focus(); },[]);
	useEffect(()=>{ const saved = localStorage.getItem('adminLoginEmail'); if(saved){ setFormData(f=>({...f,email:saved})); setRememberMe(true);} },[]);
	useEffect(()=>{ if(rememberMe && formData.email) localStorage.setItem('adminLoginEmail', formData.email); else if(!rememberMe) localStorage.removeItem('adminLoginEmail'); },[rememberMe, formData.email]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (error) setError('');
	};
	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => { setTouched(t=>({...t,[e.target.name]:true})); };

		// Removed password strength meter per request

	const emailValid = !formData.email || /.+@.+\..+/.test(formData.email);
	const passwordValid = !formData.password || formData.password.length >= 8;
	const disabledSubmit = isLoading || !formData.email || !formData.password || !emailValid || !passwordValid;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true); setError(''); setFieldErrors({});
		try {
			const result = await http.post('/admin/AdminLogin', formData);
			if (result.status === 200){
				sessionStorage.setItem('currentAdmin', JSON.stringify(result.data));
				const obj:any = result.data || {}; const possible = [obj.adminId, obj.AdminId, obj.id, obj.Id];
				let numericId: number | undefined; for(const v of possible){ if(v==null) continue; const n=Number(v); if(!Number.isNaN(n)&&Number.isFinite(n)){ numericId=n; break; }}
				if(numericId!==undefined) sessionStorage.setItem('adminNumericId', String(numericId));
				onLoginSuccess(); navigate('/admin/dashboard');
			}
		} catch(err:any){
			// Try to parse structured errors (field-level) if present on server response
			try {
				const data = err?.response?.data;
				if (data) {
					// ModelState style
					if (data.errors && typeof data.errors === 'object') {
						const fe: any = {};
						if (data.errors.Email) fe.email = (data.errors.Email as string[]).join(' ');
						if (data.errors.Password) fe.password = (data.errors.Password as string[]).join(' ');
						setFieldErrors(fe);
						if (Object.keys(fe).length) {
							setTimeout(()=>{ if (fe.email) emailInputRef.current?.focus(); else errorRef.current?.focus(); },50);
							setError('Please fix the highlighted fields.');
							return;
						}
					}
					// ASP.NET ProblemDetails style
					if (data.detail || data.title) {
						// If the ProblemDetails indicates a missing user, map to generic credentials message
						const msg = [data.title, data.detail].filter(Boolean).join(': ');
						if (/user not found/i.test(msg) || err?.response?.status === 401) {
							setError('Invalid email or password.');
						} else {
							setError(msg);
						}
						setTimeout(()=>errorRef.current?.focus(),50);
						return;
					}
				}
			} catch {}
			// When server returns a plain string containing an exception message, avoid revealing whether the user exists.
			const raw = extractErrorMessage(err) || 'Invalid credentials or server error.';
			if (/user not found/i.test(String(raw)) || err?.response?.status === 401) setError('Invalid email or password.');
			else setError(raw);
			setTimeout(()=>errorRef.current?.focus(),50);
		} finally { setIsLoading(false); }
	};

	const handleKeyState = (e: React.KeyboardEvent<HTMLInputElement>) => { if(e.getModifierState) setCapsLock(e.getModifierState('CapsLock')); };

	return (
		<div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden font-sans">
			<BackgroundSlideshow
				images={[southImg, emaImg, polImg, tutImg]}
				intervalMs={6000}
				fadeDurationMs={1200}
				overlayClassName="bg-gradient-to-br from-blue-950/80 via-indigo-950/70 to-purple-950/75"
			/>
			{/* Existing decorative gradients layered above slideshow for subtle texture */}
			<div className="pointer-events-none absolute inset-0 mix-blend-overlay bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.25),transparent_55%)]" />
			<div className="absolute inset-0 bg-gradient-to-br from-slate-900/55 via-indigo-900/45 to-purple-900/50 backdrop-blur-[3px]" />

			{/* Top-left institutional full logo + styled back button */}
			<div className="absolute top-4 left-4 z-20 flex flex-col items-start space-y-3">
				<img src={tutFull} alt="TUT Full Logo" className="w-56 md:w-60 max-w-[260px] h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]" />
				<button
					onClick={onBack}
					className="group flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-black/30 hover:shadow-xl hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
				>
					<ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
					<span className="font-medium tracking-wide">Back to Home</span>
				</button>
			</div>

			<div className="w-full max-w-md relative z-10">
				<div className="text-center mb-8 animate-in fade-in duration-700">
					<div className="flex flex-col items-center mb-5">
						<div className="p-4 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl ring-4 ring-white/25">
							<Shield className="w-12 h-12 text-white drop-shadow" />
						</div>
					</div>
					<h1 className="text-3xl font-extrabold tracking-tight text-gray-100 mb-2 drop-shadow-sm">Admin Portal</h1>
					<p className="text-gray-200/90">Secure access to the ICT Faculty Hub</p>
				</div>
				<div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 border border-gray-100 ring-1 ring-black/5 animate-in zoom-in-95 duration-500">
					<form onSubmit={handleSubmit} noValidate className="space-y-6">
						<div>
							<label htmlFor="admin-email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
								<input ref={emailInputRef} id="admin-email" name="email" type="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} aria-invalid={!emailValid && touched.email} aria-describedby={!emailValid && touched.email ? 'email-error' : undefined} className={`block w-full pl-10 pr-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border ${!emailValid && touched.email ? 'border-red-400' : 'border-gray-300'}`} placeholder="admin@example.com" required />
							</div>
							{!emailValid && touched.email && <p id="email-error" className="mt-1 text-xs text-red-600">Enter a valid email address.</p>}
								{fieldErrors.email && <p id="email-server-error" className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
						</div>
						<div>
							<label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
								<input id="admin-password" name="password" type={showPassword? 'text':'password'} value={formData.password} onChange={handleInputChange} onBlur={handleBlur} onKeyDown={handleKeyState} onKeyUp={handleKeyState} aria-invalid={!passwordValid && touched.password} aria-describedby={!passwordValid && touched.password ? 'password-error' : undefined} className={`block w-full pl-10 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border ${!passwordValid && touched.password ? 'border-red-400' : 'border-gray-300'}`} placeholder="••••••••" required />
								<button type="button" aria-label={showPassword? 'Hide password' : 'Show password'} onClick={()=>setShowPassword(s=>!s)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">{showPassword? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
								{capsLock && <div className="absolute -bottom-5 left-0 text-xs text-amber-600 font-medium">Caps Lock is ON</div>}
							</div>
							  {!passwordValid && touched.password && <p id="password-error" className="mt-2 text-xs text-red-600">Password must be at least 8 characters.</p>}
							  {fieldErrors.password && <p id="password-server-error" className="mt-2 text-xs text-red-600">{fieldErrors.password}</p>}
						</div>
						<div className="flex items-center justify-between text-sm">
							<label className="inline-flex items-center gap-2 select-none">
								<input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} />
								<span className="text-gray-600">Remember me</span>
							</label>
							<button type="button" className="text-blue-600 hover:underline" onClick={()=>alert('Password recovery not implemented yet.')}>Forgot password?</button>
						</div>
						{error && <div ref={errorRef} tabIndex={-1} aria-live="assertive" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400">{error.startsWith('Network error') ? (<span>{error}. Ensure backend is reachable & CORS enabled.</span>) : error}</div>}
						<button type="submit" disabled={disabledSubmit} className="relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
							<span className={`${isLoading? 'opacity-0':''}`}>{isLoading? '' : 'Sign In'}</span>
							{isLoading && <span className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" aria-label="Signing In" /></span>}
						</button>
					</form>
					{/* Demo credentials removed intentionally. */}
				</div>
				<div className="text-center mt-6 text-xs text-gray-300">Having trouble? Contact <a href="mailto:it-support@tut.ac.za" className="text-blue-300 hover:text-blue-200 font-medium underline-offset-2" >IT Support</a> · <span className="text-gray-400/80">v1.0</span></div>
			</div>
		</div>
	);
};

export default AdminLogin;
