import React, { useState, useEffect } from 'react';
import {
	Users,
	FileText,
	Settings,
	BarChart3,
	LogOut,
	Trash2,
	EyeOff,
	BookOpen
} from 'lucide-react';
import { newsStore } from '../../utils/newsStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NewsItem, Service } from '../../types';
import { serviceStore } from '../../utils/serviceStore';
import AdminDetailsUpdater from './sections/AdminDetailsUpdater';
import AdminEmailUpdater from './sections/AdminEmailUpdater';
import AdminPasswordUpdater from './sections/AdminPasswordUpdater';
import AdminUserManagement from './sections/AdminUserManagement';
import NewsManagementSection from './sections/NewsManagementSection';
import ServicesManagementSection from './sections/ServicesManagementSection';
import tutLogo from '../../assets/TUT.png';
// (Slideshow moved to AdminLogin per request)

interface AdminDashboardProps {
	onLogout: () => void;
	onBackToHome: () => void;
}

// (Inline AdminDetailsUpdater removed – using extracted component)

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onBackToHome: _onBackToHome }) => {
	const [activeTab, setActiveTab] = useState('overview');
	// Live date & time (24h)
	const [currentTime, setCurrentTime] = useState('');
	const [currentDate, setCurrentDate] = useState('');
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
	const [newsSearch, setNewsSearch] = useState(''); // title-only search term
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
	const toggleAllCampuses = (checked: boolean) => {
		if (checked) setSelectedCampuses(campusOptions.map(c => c.key));
		else setSelectedCampuses([]);
	};
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
		// Prefer the new campus-shaped endpoint; fall back to legacy News endpoint
		const campusIdToSlug: Record<number,string> = {1:'south',2:'emalahleni',3:'polokwane'};
		try {
			const res = await axios.get(`/api/Campus/adminGetAllCampus`);
			const payload = res.data?.data ?? res.data ?? [];
			// payload is expected to be an array of campus objects each with a `news` array
			let list: NewsItem[] = [];
			for (const campusObj of (Array.isArray(payload) ? payload : [])) {
				const campusId = Number(campusObj?.campusId);
				const slug = campusIdToSlug[campusId] || (campusObj?.campusName || '').toLowerCase().replace(/\s+/g,'') || 'south';
				const newsArray = Array.isArray(campusObj?.news) ? campusObj.news : [];
				for (const n of newsArray) {
					const item: NewsItem = {
						id: (n.newsId ?? n.id ?? genId()).toString(),
						title: n.newsTitle ?? n.title ?? '',
						summary: n.newsDescription ?? n.description ?? n.summary ?? '',
						content: n.newsDescription ?? n.description ?? n.content ?? '',
						category: n.category ?? 'Announcement',
						priority: n.priority ?? 'medium',
						campus: slug as NewsItem['campus'],
						department: n.department ?? undefined,
						date: n.createdAt ?? n.createdAt ?? n.date ?? new Date().toISOString(),
						isVisible: (typeof n.isVisible === 'boolean') ? n.isVisible : true,
						isUrgent: !!n.isUrgent
					};
					if (item.title.trim()) list.push(item);
				}
			}
			return list;
		} catch (err) {
			// fallback to legacy endpoint
			const res = await axios.get(`/api/News/getAllNews`);
			const raw = Array.isArray(res.data) ? res.data : [];
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
				isVisible: !!n.isVisible,
				isUrgent: n.isUrgent || false
			})).filter(n => n.title.trim());
			return list;
		}
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
					list = list.filter(n => n.title?.toLowerCase().includes(q));
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
				list = list.filter(n => n.title?.toLowerCase().includes(q));
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
				// Backend requires a non-null CampusId for each created record.
				// Create one request per selected campus (or the single campus in editing case).
				const campusMap: Record<string, number> = { south: 1, emalahleni: 2, polokwane: 3 };
				const campusesToCreate = selectedCampuses.length ? selectedCampuses : [newsForm.campus || 'south'];
				const file = (newsForm as any).file as File | undefined;
				// Send one request per campus to ensure CampusId is present
				try {
					for (const campusKey of campusesToCreate) {
						const campusId = campusMap[campusKey] || undefined;
						const params: any = {
							AdminId: adminId!,
							Title: newsForm.title,
							Description: newsForm.summary || '',
							Priority: newsForm.priority,
							Category: newsForm.category,
							...(newsForm.department ? { Department: newsForm.department } : {}),
							...(campusId ? { CampusId: campusId } : {}),
							Campus: campusKey // also include slug in case backend expects it
						};
						if (file) {
							const fd = new FormData();
							fd.append('FormFile', file);
							await axios.post(`/api/News/createNews`, fd, { params });
						} else {
							await axios.post(`/api/News/createNews`, {}, { params });
						}
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
			// Call backend updateVisibility endpoint (it infers new state server-side)
			await axios.put(`/api/News/updateVisibility`, {}, { params: { NewsId: Number(id) } });
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
	// Logout confirmation dialog
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const requestLogout = () => { setShowProfile(false); setShowLogoutConfirm(true); };
	const cancelLogoutConfirm = () => setShowLogoutConfirm(false);
	const performLogout = () => { setShowLogoutConfirm(false); onLogout(); };

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
							{/* Profile avatar button (moved to right of time/date) */}
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
					<div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
					<div className="flex items-stretch space-x-8 h-full">
						<div className="w-72 bg-white rounded-lg shadow-sm p-6 sticky top-20 h-[calc(100vh-5rem)] overflow-auto">
						<nav className="space-y-2">
							{tabs.map(tab => { const IconComponent = tab.icon; return (
								<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
									<IconComponent className="w-5 h-5 shrink-0" />
									<span className="whitespace-nowrap text-sm">{tab.label}</span>
								</button>
							); })}
						</nav>
					</div>
					<div className="flex-1 min-h-full">
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
								<div className="bg-white rounded-lg shadow-sm min-h-[420px]">
									<div className="p-6 border-b border-gray-200 flex items-center justify-between">
										<h2 className="text-lg font-semibold text-gray-900">Recent News Articles</h2>
										<button onClick={()=>setActiveTab('news')} className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">View All</button>
									</div>
									<div className="p-6">
										<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
											{newsItems.filter(n => n.isVisible !== false).slice(0,6).map(item => (
												<div key={item.id} className="group relative rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={()=>{ handleEditNews(item); setActiveTab('news'); }}>
													<div className="flex items-start justify-between gap-3">
														<h3 className="text-sm font-semibold text-gray-900 pr-2 line-clamp-2" title={item.title}>{item.title}</h3>
														<span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${item.priority==='high'?'bg-red-100 text-red-700':item.priority==='medium'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>{item.priority}</span>
													</div>
													<p className="mt-2 text-xs text-gray-600 line-clamp-3 min-h-[48px]">{item.summary || item.content || '—'}</p>
													<div className="mt-3 flex flex-wrap items-center gap-2">
														<span className="text-[10px] text-gray-500">{new Date(item.date).toLocaleDateString('en-ZA',{year:'2-digit',month:'short',day:'numeric'})}</span>
														<span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-medium">{item.category}</span>
														{item.campus && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium capitalize">{item.campus}</span>}
														{item.isUrgent && <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-semibold">Urgent</span>}
													</div>
													<div className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
											</div>
											))}
											{!newsLoading && newsItems.filter(n=>n.isVisible!==false).length === 0 && (
												<p className="text-sm text-gray-500 col-span-full">No news articles found.</p>
											)}
										</div>
									</div>
								</div>
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
									onSearchChange={(v)=>setNewsSearch(v)}
									newsFrom={newsFrom}
									newsTo={newsTo}
									total={newsItems.length}
									page={newsPage}
									totalPages={totalNewsPages}
									onCampusFilterChange={(v)=>setNewsCampusFilter(v as any)}
									onAdd={() => { setEditingNews(null); setNewsForm(blankNews); setShowNewsForm(true); }}
									onPrev={() => setNewsPage(p=>Math.max(1,p-1))}
									onNext={() => setNewsPage(p=>Math.min(totalNewsPages,p+1))}
									onToggleVisibility={handleToggleNewsVisibility}
									onEdit={(item)=>{ handleEditNews(item); }}
									onDelete={(item)=> openDeleteNews(item)}
								/>
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
																	<div className="flex items-center justify-between px-2">
																		<label className="flex items-center gap-2 text-sm font-medium">
																			<input type="checkbox" className="rounded border-gray-300" checked={selectedCampuses.length === campusOptions.length} onChange={e => toggleAllCampuses(e.target.checked)} />
																			<span>Select all</span>
																		</label>
																	</div>
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
							<ServicesManagementSection
								services={services}
								serviceSearch={serviceSearch}
								serviceCategoryFilter={serviceCategoryFilter}
								onSearchChange={(v)=>setServiceSearch(v)}
								onCategoryChange={(v)=>setServiceCategoryFilter(v as any)}
								onAdd={() => { setEditingService(null); setServiceForm({ title: '', category: 'All Students', description: '', details: '', statusLink: '', steps: [] }); setShowServiceForm(true); }}
								onEdit={(s)=>handleEditService(s)}
								onDelete={(id)=>handleDeleteService(id)}
								showForm={showServiceForm}
								editingService={editingService}
								serviceForm={serviceForm}
								setServiceForm={(f)=>setServiceForm(f)}
								onCloseForm={()=>{ setShowServiceForm(false); setEditingService(null); }}
								onSave={handleSaveService}
								newStep={newStep}
								setNewStep={(v)=>setNewStep(v)}
								addStep={addStep}
								removeStep={removeStep}
								moveStep={moveStep}
							/>
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
						<button onClick={requestLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"><LogOut className="w-4 h-4" />Logout</button>
					</div>
				</div>
			</div>
		)}
		{showLogoutConfirm && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
				<div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6 space-y-5">
					<h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
					<p className="text-sm text-gray-600">Are you sure you want to log out of the admin dashboard?</p>
					<div className="flex justify-end gap-3 pt-2">
						<button onClick={cancelLogoutConfirm} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
						<button onClick={performLogout} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Logout</button>
					</div>
				</div>
			</div>
		)}
		</div>
	);
};

export default AdminDashboard;
