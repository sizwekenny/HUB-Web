// import React, { useState, useEffect, useMemo } from 'react';
// import { Plus, Edit, Trash2, Eye, EyeOff, Download } from 'lucide-react';

// const NewsManagementSection = () => {
//   const [newsItems, setNewsItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [search, setSearch] = useState('');
//   const [campusFilter, setCampusFilter] = useState('all');
//   const [page, setPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [viewItem, setViewItem] = useState(null);
//   const [viewCampuses, setViewCampuses] = useState(null);
//   const [editingItem, setEditingItem] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [campuses, setCampuses] = useState([]); // ✅ ADD THIS
//   const [categories, setCategories] = useState([]); // ✅ ADD THIS

//   const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000';

//   console.log(API_URL, "----------------")

//   // Fetch news items
//   const fetchNews = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch(API_URL + '/api/news');
//       if (!response.ok) throw new Error('Failed to fetch news');
//       const data = await response.json();
//       setNewsItems(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Fetch campuses for dropdown
//   const fetchCampuses = async () => {
//     try {
//       const response = await fetch(API_URL + '/api/news/campuses/list');
//       if (!response.ok) throw new Error('Failed to fetch campuses');
//       const data = await response.json();
//       setCampuses(data);
//     } catch (err) {
//       console.error('Error fetching campuses:', err);
//     }
//   };

//   // Fetch categories for dropdown
//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(API_URL + '/api/news/categories/list');
//       if (!response.ok) throw new Error('Failed to fetch categories');
//       const data = await response.json();
//       setCategories(data);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//     }
//   };

//   useEffect(() => {
//     fetchNews();
//     fetchCampuses();
//     fetchCategories();
//   }, []);

//   // Create news item
//   const createNews = async (newsData) => {
//     try {
//       const response = await fetch(API_URL + '/api/news', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newsData),
//       });

//       if (!response.ok) throw new Error('Failed to create news');

//       const result = await response.json();
//       fetchNews(); // Refresh the list
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Update news item
//   const updateNews = async (id, newsData) => {
//     try {
//       const response = await fetch(API_URL + `/api/news/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newsData),
//       });

//       if (!response.ok) throw new Error('Failed to update news');

//       const result = await response.json();
//       fetchNews(); // Refresh the list
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Delete news item
//   const deleteNews = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this news item?')) {
//       return;
//     }

//     try {
//       const response = await fetch(API_URL + `/api/news/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) throw new Error('Failed to delete news');

//       fetchNews(); // Refresh the list
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Toggle visibility
//   const toggleVisibility = async (id, currentVisibility) => {
//     try {
//       const item = newsItems.find(item => item.news_id === id);
//       if (!item) return;

//       await updateNews(id, {
//         ...item,
//         is_visible: !currentVisibility
//       });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Handle download
//   const handleDownload = (item) => {
//     if (item.attachment_url) {
//       window.open(item.attachment_url, '_blank');
//     }
//   };

//   // Form handlers
//   const handleAdd = () => {
//     setEditingItem(null);
//     setShowForm(true);
//   };

//   const handleEdit = (item) => {
//     setEditingItem(item);
//     setShowForm(true);
//   };

//   const handleFormSubmit = async (formData) => {
//     try {
//       if (editingItem) {
//         await updateNews(editingItem.news_id, formData);
//       } else {
//         await createNews(formData);
//       }
//       setShowForm(false);
//       setEditingItem(null);
//     } catch (err) {
//       // Error is already set in the CRUD functions
//     }
//   };

//   const handleFormCancel = () => {
//     setShowForm(false);
//     setEditingItem(null);
//   };

//   // Filter and pagination logic
//   const filteredItems = useMemo(() => {
//     return newsItems.filter(item => {
//       const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) ||
//         item.summary?.toLowerCase().includes(search.toLowerCase());
//       const matchesCampus = campusFilter === 'all' ||
//         item.campus_name?.toLowerCase() === campusFilter.toLowerCase();
//       return matchesSearch && matchesCampus;
//     });
//   }, [newsItems, search, campusFilter]);

//   const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
//   const startIndex = (page - 1) * itemsPerPage;
//   const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

//   const handlePrevPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) setPage(page + 1);
//   };

//   // Utility functions
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   const formatDateTime = (dateString) => {
//     return new Date(dateString).toLocaleString();
//   };

//   const getPriorityStyle = (priority) => {
//     switch (priority?.toLowerCase()) {
//       case 'high': return 'bg-red-100 text-red-700';
//       case 'medium': return 'bg-yellow-100 text-yellow-700';
//       case 'low': return 'bg-green-100 text-green-700';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const isExpired = (item) => {
//     if (!item.expiry_date) return false;
//     return new Date(item.expiry_date) < new Date();
//   };

//   const openView = (item, campuses = null) => {
//     setViewItem(item);
//     setViewCampuses(campuses);
//   };

//   const closeView = () => {
//     setViewItem(null);
//     setViewCampuses(null);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-sm">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <h2 className="text-lg font-semibold text-gray-900">News Management</h2>
//             <div className="flex flex-wrap gap-3 items-center">
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search title..."
//                   className="pl-3 pr-10 py-2 w-48 md:w-60 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 {search && (
//                   <button
//                     type="button"
//                     onClick={() => setSearch('')}
//                     aria-label="Clear search"
//                     className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//               <select
//                 value={campusFilter}
//                 onChange={(e) => setCampusFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               >
//                 <option value="all">All Campuses</option>
//                 <option value="south">South</option>
//                 <option value="emalahleni">eMalahleni</option>
//                 <option value="polokwane">Polokwane</option>
//               </select>
//               <button
//                 onClick={handleAdd}
//                 className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Add News</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
//             {error && (
//               <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 text-xs border border-red-200">
//                 {error}
//               </div>
//             )}

//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-200 text-left">
//                   <th className="py-3 px-2 font-semibold text-gray-700">Title</th>
//                   <th className="py-3 px-2 font-semibold text-gray-700">Campus</th>
//                   <th className="py-3 px-2 font-semibold text-gray-700">Category</th>
//                   <th className="py-3 px-2 font-semibold text-gray-700">Priority</th>
//                   <th className="py-3 px-2 font-semibold text-gray-700">Status</th>
//                   <th className="py-3 px-2 font-semibold text-gray-700">Publish Date</th>
//                   <th className="py-3 px-2 font-semibold text-gray-700 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading && newsItems.length === 0 && (
//                   <tr>
//                     <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
//                       Loading news...
//                     </td>
//                   </tr>
//                 )}

//                 {paginatedItems.map((item) => (
//                   <tr
//                     key={item.news_id}
//                     onClick={() => openView(item)}
//                     className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
//                   >
//                     <td className="py-3 px-2 max-w-xs">
//                       <p className="font-medium text-gray-900 line-clamp-1" title={item.title}>
//                         {item.title}
//                         {isExpired(item) && (
//                           <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">Expired</span>
//                         )}
//                       </p>
//                       <p className="text-xs text-gray-500 line-clamp-1" title={item.summary}>
//                         {item.summary}
//                       </p>
//                     </td>

//                     <td className="py-3 px-2">
//                       <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium capitalize">
//                         {item.campus_name || 'All'}
//                       </span>
//                     </td>

//                     <td className="py-3 px-2">
//                       <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
//                         {item.category_name || `Category ${item.category_id}`}
//                       </span>
//                     </td>

//                     <td className="py-3 px-2">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyle(item.priority)}`}>
//                         {item.priority || 'Normal'}
//                       </span>
//                     </td>

//                     <td className="py-3 px-2">
//                       <div className="flex flex-col gap-1">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
//                           }`}>
//                           {item.is_visible ? 'Visible' : 'Hidden'}
//                         </span>
//                         {item.is_urgent && (
//                           <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
//                             Urgent
//                           </span>
//                         )}
//                       </div>
//                     </td>

//                     <td className="py-3 px-2 whitespace-nowrap">
//                       {formatDate(item.publish_date || item.created_at)}
//                     </td>

//                     <td className="py-3 px-2">
//                       <div className="flex items-center justify-end space-x-2">
//                         {/* Toggle Visibility */}
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleVisibility(item.news_id, item.is_visible);
//                           }}
//                           aria-label={item.is_visible ? 'Hide news item' : 'Show news item'}
//                           className={`p-2 rounded-full transition-colors ${item.is_visible
//                             ? 'text-green-600 hover:bg-green-100'
//                             : 'text-gray-400 hover:bg-gray-100'
//                             }`}
//                         >
//                           {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                         </button>

//                         {/* Attachment Download */}
//                         {item.attachment_url && (
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDownload(item);
//                             }}
//                             aria-label="Download attachment"
//                             className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
//                           >
//                             <Download className="w-4 h-4" />
//                           </button>
//                         )}

//                         {/* Edit */}
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleEdit(item);
//                           }}
//                           className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
//                           aria-label="Edit news"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>

//                         {/* Delete */}
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             deleteNews(item.news_id);
//                           }}
//                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                           aria-label="Delete news"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//                 {!loading && newsItems.length === 0 && (
//                   <tr>
//                     <td colSpan={7} className="py-10 text-center text-gray-500 text-sm">
//                       No news items found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {newsItems.length > 0 && (
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-xs text-gray-600">
//               <div>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length}</div>
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={handlePrevPage}
//                   disabled={page === 1}
//                   className="px-2.5 py-1.5 rounded-md border text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
//                 >
//                   Prev
//                 </button>
//                 <span className="min-w-[90px] text-center">Page {page} of {totalPages}</span>
//                 <button
//                   type="button"
//                   onClick={handleNextPage}
//                   disabled={page === totalPages}
//                   className="px-2.5 py-1.5 rounded-md border text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* News Detail Modal */}
//       {viewItem && (
//         <div
//           className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="news-view-title"
//           onMouseDown={(e) => { if (e.target === e.currentTarget) closeView(); }}
//         >
//           <div
//             className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 animate-in fade-in zoom-in-95"
//             onMouseDown={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
//               <div>
//                 <h3 id="news-view-title" className="text-xl font-semibold text-gray-900 mb-1">
//                   {viewItem.title}
//                   {isExpired(viewItem) && (
//                     <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Expired</span>
//                   )}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   Published: {formatDateTime(viewItem.publish_date || viewItem.created_at)}
//                   {viewItem.expiry_date && (
//                     <span className="ml-2">
//                       • Expires: {formatDateTime(viewItem.expiry_date)}
//                     </span>
//                   )}
//                 </p>
//               </div>
//               <button
//                 onClick={closeView}
//                 aria-label="Close"
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
//               {/* Badges */}
//               <div className="flex flex-wrap gap-2 text-xs">
//                 <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium capitalize">
//                   {viewItem.campus_name || 'All'}
//                 </span>
//                 <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
//                   {viewItem.category_name || `Category ${viewItem.category_id}`}
//                 </span>
//                 <span className={`px-2 py-1 rounded-full font-medium ${getPriorityStyle(viewItem.priority)}`}>
//                   {viewItem.priority || 'Normal'}
//                 </span>
//                 {!viewItem.is_visible && (
//                   <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 font-medium">Hidden</span>
//                 )}
//                 {viewItem.is_urgent && (
//                   <span className="px-2 py-1 rounded-full bg-red-600 text-white font-medium">Urgent</span>
//                 )}
//               </div>

//               {/* Summary */}
//               {viewItem.summary && viewItem.summary !== viewItem.content && (
//                 <div>
//                   <h4 className="text-sm font-semibold text-gray-700 mb-1">Summary</h4>
//                   <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
//                     {viewItem.summary}
//                   </p>
//                 </div>
//               )}

//               {/* Content */}
//               <div>
//                 <h4 className="text-sm font-semibold text-gray-700 mb-1">Content</h4>
//                 <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
//                   {viewItem.content || viewItem.summary}
//                 </p>
//               </div>

//               {/* Attachment */}
//               {viewItem.attachment_url && (
//                 <div>
//                   <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachment</h4>
//                   <button
//                     onClick={() => handleDownload(viewItem)}
//                     className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
//                   >
//                     <Download className="w-4 h-4" />
//                     <span className="text-sm">
//                       {viewItem.attachment_filename || 'Download File'}
//                     </span>
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
//               <button
//                 onClick={closeView}
//                 className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-sm font-medium"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => {
//                   closeView();
//                   handleEdit(viewItem);
//                 }}
//                 className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
//               >
//                 Edit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Updated News Form Modal with Dropdowns */}
//       {showForm && (
//         <NewsForm
//           item={editingItem}
//           campuses={campuses}
//           categories={categories}
//           onSubmit={handleFormSubmit}
//           onCancel={handleFormCancel}
//         />
//       )}
//     </div>
//   );
// };

// // Updated News Form Component with Dropdowns
// const NewsForm = ({ item, campuses = [], categories = [], onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     title: item?.title || '',
//     summary: item?.summary || '',
//     content: item?.content || '',
//     category_id: item?.category_id || '',
//     campus_id: item?.campus_id || '',
//     priority: item?.priority || 'normal',
//     is_urgent: item?.is_urgent || false,
//     is_visible: item?.is_visible || true,
//     publish_date: item?.publish_date || new Date().toISOString().split('T')[0],
//     expiry_date: item?.expiry_date || '',
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
//       <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <h3 className="text-lg font-semibold text-gray-900">
//             {item ? 'Edit News' : 'Add New News'}
//           </h3>
//           <button
//             onClick={onCancel}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             ✕
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Title *
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             {/* Updated: Campus Dropdown */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Campus
//               </label>
//               <select
//                 name="campus_id"
//                 value={formData.campus_id}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select Campus (Optional)</option>
//                 {campuses.map((campus) => (
//                   <option key={campus.campus_id} value={campus.campus_id}>
//                     {campus.campus_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Updated: Category Dropdown */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category
//               </label>
//               <select
//                 name="category_id"
//                 value={formData.category_id}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select Category (Optional)</option>
//                 {categories.map((category) => (
//                   <option key={category.category_id} value={category.category_id}>
//                     {category.category_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Priority
//               </label>
//               <select
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="low">Low</option>
//                 <option value="normal">Normal</option>
//                 <option value="high">High</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Publish Date
//               </label>
//               <input
//                 type="date"
//                 name="publish_date"
//                 value={formData.publish_date}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Expiry Date
//               </label>
//               <input
//                 type="date"
//                 name="expiry_date"
//                 value={formData.expiry_date}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Summary
//             </label>
//             <textarea
//               name="summary"
//               value={formData.summary}
//               onChange={handleChange}
//               rows="2"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Brief summary of the news..."
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Content *
//             </label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               rows="4"
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Full news content..."
//             />
//           </div>

//           <div className="flex items-center gap-4">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="is_urgent"
//                 checked={formData.is_urgent}
//                 onChange={handleChange}
//                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               />
//               <span className="ml-2 text-sm text-gray-700">Urgent</span>
//             </label>

//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="is_visible"
//                 checked={formData.is_visible}
//                 onChange={handleChange}
//                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               />
//               <span className="ml-2 text-sm text-gray-700">Visible</span>
//             </label>
//           </div>

//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//             >
//               {item ? 'Update' : 'Create'} News
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewsManagementSection;


import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Download } from 'lucide-react';

const NewsManagementSection = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [campusFilter, setCampusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewItem, setViewItem] = useState(null);
  const [viewCampuses, setViewCampuses] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [categories, setCategories] = useState([]);

  const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000';

  console.log(API_URL, "----------------")

  // Fetch news items
  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL + '/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNewsItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch campuses for dropdown
  const fetchCampuses = async () => {
    try {
      const response = await fetch(API_URL + '/api/news/campuses/list');
      if (!response.ok) throw new Error('Failed to fetch campuses');
      const data = await response.json();
      setCampuses(data);
    } catch (err) {
      console.error('Error fetching campuses:', err);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch(API_URL + '/api/news/categories/list');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchCampuses();
    fetchCategories();
  }, []);

  // Create news item
  const createNews = async (newsData) => {
    try {
      const response = await fetch(API_URL + '/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) throw new Error('Failed to create news');

      const result = await response.json();
      fetchNews(); // Refresh the list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update news item
  const updateNews = async (id, newsData) => {
    try {
      const response = await fetch(API_URL + `/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) throw new Error('Failed to update news');

      const result = await response.json();
      fetchNews(); // Refresh the list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete news item
  const deleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) {
      return;
    }

    try {
      const response = await fetch(API_URL + `/api/news/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete news');

      fetchNews(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle visibility
  const toggleVisibility = async (id, currentVisibility) => {
    try {
      const item = newsItems.find(item => item.news_id === id);
      if (!item) return;

      await updateNews(id, {
        ...item,
        is_visible: !currentVisibility
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle download
  const handleDownload = (item) => {
    if (item.attachment_url) {
      window.open(item.attachment_url, '_blank');
    }
  };

  // Form handlers
  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updateNews(editingItem.news_id, formData);
      } else {
        await createNews(formData);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      // Error is already set in the CRUD functions
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // FIXED: Filter and pagination logic - Proper campus filtering
  const filteredItems = useMemo(() => {
    return newsItems.filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.summary?.toLowerCase().includes(search.toLowerCase());
      
      // Fixed campus filtering logic
      if (campusFilter === 'all') {
        // Show all items when "All Campuses" is selected
        return matchesSearch;
      } else {
        // For specific campus filter, show items that match campus_name OR have null campus_id (All Campuses news)
        const matchesCampus = item.campus_name === campusFilter || 
                             !item.campus_id; // Show "All Campuses" news for any campus filter
        
        return matchesSearch && matchesCampus;
      }
    });
  }, [newsItems, search, campusFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isExpired = (item) => {
    if (!item.expiry_date) return false;
    return new Date(item.expiry_date) < new Date();
  };

  const openView = (item, campuses = null) => {
    setViewItem(item);
    setViewCampuses(campuses);
  };

  const closeView = () => {
    setViewItem(null);
    setViewCampuses(null);
  };

  // Get unique campus names from news items for filter dropdown
  const availableCampuses = useMemo(() => {
    const campusNames = newsItems
      .map(item => item.campus_name)
      .filter(name => name) // Remove null/undefined
      .filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates
    
    return campusNames.sort();
  }, [newsItems]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">News Management</h2>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title..."
                  className="pl-3 pr-10 py-2 w-48 md:w-60 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* FIXED: Campus Filter Dropdown - Using actual campus names from database */}
              <select
                value={campusFilter}
                onChange={(e) => {
                  setCampusFilter(e.target.value);
                  setPage(1); // Reset to first page when filter changes
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Campuses</option>
                {campuses.map((campus) => (
                  <option key={campus.campus_id} value={campus.campus_name}>
                    {campus.campus_name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleAdd}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add News</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 text-xs border border-red-200">
                {error}
              </div>
            )}

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 px-2 font-semibold text-gray-700">Title</th>
                  <th className="py-3 px-2 font-semibold text-gray-700">Campus</th>
                  <th className="py-3 px-2 font-semibold text-gray-700">Category</th>
                  <th className="py-3 px-2 font-semibold text-gray-700">Priority</th>
                  <th className="py-3 px-2 font-semibold text-gray-700">Status</th>
                  <th className="py-3 px-2 font-semibold text-gray-700">Publish Date</th>
                  <th className="py-3 px-2 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && newsItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                      Loading news...
                    </td>
                  </tr>
                )}

                {!loading && paginatedItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-500 text-sm">
                      {newsItems.length === 0 ? 'No news items found.' : 'No news items match your filters.'}
                    </td>
                  </tr>
                )}

                {paginatedItems.map((item) => (
                  <tr
                    key={item.news_id}
                    onClick={() => openView(item)}
                    className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-2 max-w-xs">
                      <p className="font-medium text-gray-900 line-clamp-1" title={item.title}>
                        {item.title}
                        {isExpired(item) && (
                          <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">Expired</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1" title={item.summary}>
                        {item.summary}
                      </p>
                    </td>

                    <td className="py-3 px-2">
                      <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium capitalize">
                        {item.campus_name || 'All Campuses'}
                      </span>
                    </td>

                    <td className="py-3 px-2">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {item.category_name || `Category ${item.category_id}`}
                      </span>
                    </td>

                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyle(item.priority)}`}>
                        {item.priority || 'Normal'}
                      </span>
                    </td>

                    <td className="py-3 px-2">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                          }`}>
                          {item.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                        {item.is_urgent && (
                          <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                            Urgent
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-2 whitespace-nowrap">
                      {formatDate(item.publish_date || item.created_at)}
                    </td>

                    <td className="py-3 px-2">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Toggle Visibility */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVisibility(item.news_id, item.is_visible);
                          }}
                          aria-label={item.is_visible ? 'Hide news item' : 'Show news item'}
                          className={`p-2 rounded-full transition-colors ${item.is_visible
                            ? 'text-green-600 hover:bg-green-100'
                            : 'text-gray-400 hover:bg-gray-100'
                            }`}
                        >
                          {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* Attachment Download */}
                        {item.attachment_url && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(item);
                            }}
                            aria-label="Download attachment"
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          aria-label="Edit news"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNews(item.news_id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="Delete news"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {newsItems.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-xs text-gray-600">
              <div>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="px-2.5 py-1.5 rounded-md border text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Prev
                </button>
                <span className="min-w-[90px] text-center">Page {page} of {totalPages}</span>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="px-2.5 py-1.5 rounded-md border text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* News Detail Modal */}
      {viewItem && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-view-title"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeView(); }}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 animate-in fade-in zoom-in-95"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
              <div>
                <h3 id="news-view-title" className="text-xl font-semibold text-gray-900 mb-1">
                  {viewItem.title}
                  {isExpired(viewItem) && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Expired</span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">
                  Published: {formatDateTime(viewItem.publish_date || viewItem.created_at)}
                  {viewItem.expiry_date && (
                    <span className="ml-2">
                      • Expires: {formatDateTime(viewItem.expiry_date)}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={closeView}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium capitalize">
                  {viewItem.campus_name || 'All Campuses'}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                  {viewItem.category_name || `Category ${viewItem.category_id}`}
                </span>
                <span className={`px-2 py-1 rounded-full font-medium ${getPriorityStyle(viewItem.priority)}`}>
                  {viewItem.priority || 'Normal'}
                </span>
                {!viewItem.is_visible && (
                  <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 font-medium">Hidden</span>
                )}
                {viewItem.is_urgent && (
                  <span className="px-2 py-1 rounded-full bg-red-600 text-white font-medium">Urgent</span>
                )}
              </div>

              {/* Summary */}
              {viewItem.summary && viewItem.summary !== viewItem.content && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Summary</h4>
                  <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                    {viewItem.summary}
                  </p>
                </div>
              )}

              {/* Content */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Content</h4>
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {viewItem.content || viewItem.summary}
                </p>
              </div>

              {/* Attachment */}
              {viewItem.attachment_url && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachment</h4>
                  <button
                    onClick={() => handleDownload(viewItem)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">
                      {viewItem.attachment_filename || 'Download File'}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeView}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeView();
                  handleEdit(viewItem);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Updated News Form Modal with Dropdowns */}
      {showForm && (
        <NewsForm
          item={editingItem}
          campuses={campuses}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

// Updated News Form Component with Dropdowns
const NewsForm = ({ item, campuses = [], categories = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    summary: item?.summary || '',
    content: item?.content || '',
    category_id: item?.category_id || '',
    campus_id: item?.campus_id || '',
    priority: item?.priority || 'normal',
    is_urgent: item?.is_urgent || false,
    is_visible: item?.is_visible || true,
    publish_date: item?.publish_date || new Date().toISOString().split('T')[0],
    expiry_date: item?.expiry_date || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {item ? 'Edit News' : 'Add New News'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Updated: Campus Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campus
              </label>
              <select
                name="campus_id"
                value={formData.campus_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Campus (Optional - for All Campuses)</option>
                {campuses.map((campus) => (
                  <option key={campus.campus_id} value={campus.campus_id}>
                    {campus.campus_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Updated: Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category (Optional)</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date
              </label>
              <input
                type="date"
                name="publish_date"
                value={formData.publish_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief summary of the news..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="4"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Full news content..."
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_urgent"
                checked={formData.is_urgent}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Urgent</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_visible"
                checked={formData.is_visible}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Visible</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {item ? 'Update' : 'Create'} News
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsManagementSection;