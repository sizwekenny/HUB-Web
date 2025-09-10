import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { NewsItem } from '../../../types';

interface Props {
  newsItems: NewsItem[];
  paginatedNews: NewsItem[];
  newsLoading: boolean;
  newsError: string;
  newsCampusFilter: string;
  // Title-only search term (already applied in parent filtering logic)
  search?: string;
  onSearchChange?: (v:string)=>void;
  newsFrom: number; newsTo: number; total: number; page: number; totalPages: number;
  onCampusFilterChange: (v:string)=>void;
  onAdd: ()=>void;
  onPrev: ()=>void; onNext: ()=>void;
  onToggleVisibility: (id:string)=>void;
  onEdit: (item:NewsItem)=>void;
  onDelete: (item:NewsItem)=>void;
}

const NewsManagementSection: React.FC<Props> = ({ newsItems, paginatedNews, newsLoading, newsError, newsCampusFilter, search='', onSearchChange, newsFrom, newsTo, total, page, totalPages, onCampusFilterChange, onAdd, onPrev, onNext, onToggleVisibility, onEdit, onDelete }) => {
  const [viewItem, setViewItem] = useState<NewsItem | null>(null);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setViewItem(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const openView = (item: NewsItem) => setViewItem(item);
  const closeView = () => setViewItem(null);
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
                  onChange={e=>onSearchChange?.(e.target.value)}
                  placeholder="Search title..."
                  className="pl-3 pr-10 py-2 w-48 md:w-60 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {search && (
                  <button type="button" onClick={()=>onSearchChange?.('')} aria-label="Clear search" className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600">✕</button>
                )}
              </div>
              <select value={newsCampusFilter} onChange={e => onCampusFilterChange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                <option value="all">All Campuses</option>
                <option value="south">South</option>
                <option value="emalahleni">eMalahleni</option>
                <option value="polokwane">Polokwane</option>
              </select>
              <button onClick={onAdd} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"><Plus className="w-4 h-4" /><span>Add News</span></button>
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
                {newsLoading && newsItems.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-gray-500 text-sm">Loading news...</td></tr>}
                {paginatedNews.map(item => (
                  <tr key={item.id} onClick={() => openView(item)} className="cursor-pointer border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 max-w-xs">
                      <p className="font-medium text-gray-900 line-clamp-1" title={item.title}>{item.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1" title={item.summary}>{item.summary}</p>
                    </td>
                    <td className="py-3 px-2"><span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium capitalize">{item.campus || 'All'}</span></td>
                    <td className="py-3 px-2"><span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">{item.category}</span></td>
                    <td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-medium ${item.priority==='high'?'bg-red-100 text-red-700':item.priority==='medium'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>{item.priority}</span></td>
                    <td className="py-3 px-2"><span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isVisible===false ? 'bg-gray-200 text-gray-700':'bg-green-100 text-green-700'}`}>{item.isVisible===false?'Hidden':'Visible'}</span></td>
                    <td className="py-3 px-2 whitespace-nowrap">{new Date(item.date).toLocaleDateString('en-ZA',{year:'numeric',month:'short',day:'numeric'})}</td>
                    <td className="py-3 px-2"><div className="flex items-center justify-end space-x-2">
                      <button onClick={(e)=>{e.stopPropagation(); onToggleVisibility(item.id);}} aria-label={item.isVisible===false?'Enable news item':'Disable news item'} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${item.isVisible===false?'bg-gray-300':'bg-green-500'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${item.isVisible===false?'translate-x-1':'translate-x-6'}`}></span></button>
                      <button onClick={(e)=>{e.stopPropagation(); onEdit(item);}} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Edit news"><Edit className="w-4 h-4" /></button>
                      <button onClick={(e)=>{e.stopPropagation(); onDelete(item);}} className="p-2 text-gray-400 hover:text-red-600 transition-colors" aria-label="Delete news"><Trash2 className="w-4 h-4" /></button>
                    </div></td>
                  </tr>
                ))}
                {newsItems.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-gray-500 text-sm">No news found for current filters.</td></tr>}
              </tbody>
            </table>
          </div>
          {newsItems.length>0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-xs text-gray-600">
              <div>Showing {newsFrom}-{newsTo} of {total}</div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={onPrev} disabled={page===1} className="px-2.5 py-1.5 rounded-md border text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100">Prev</button>
                <span className="min-w-[90px] text-center">Page {page} of {totalPages}</span>
                <button type="button" onClick={onNext} disabled={page===totalPages} className="px-2.5 py-1.5 rounded-md border text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    {viewItem && (
      <div
        className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-view-title"
        onMouseDown={(e)=>{ if(e.target === e.currentTarget) closeView(); }}
      >
        <div
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 animate-in fade-in zoom-in-95"
          onMouseDown={(e)=>e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
            <div>
              <h3 id="news-view-title" className="text-xl font-semibold text-gray-900 mb-1">{viewItem.title}</h3>
              <p className="text-sm text-gray-500">{new Date(viewItem.date).toLocaleString('en-GB',{year:'numeric',month:'short',day:'2-digit', hour:'2-digit', minute:'2-digit'})}</p>
            </div>
            <button onClick={closeView} aria-label="Close" className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
          </div>
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium capitalize">{viewItem.campus || 'All'}</span>
              <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">{viewItem.category}</span>
              <span className={`px-2 py-1 rounded-full font-medium ${viewItem.priority==='high'?'bg-red-100 text-red-700':viewItem.priority==='medium'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>{viewItem.priority}</span>
              {viewItem.isVisible===false && <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 font-medium">Hidden</span>}
              {viewItem.isUrgent && <span className="px-2 py-1 rounded-full bg-red-600 text-white font-medium">Urgent</span>}
              {viewItem.department && <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">{viewItem.department}</span>}
            </div>
            {viewItem.summary && viewItem.summary !== viewItem.content && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Summary</h4>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">{viewItem.summary}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Details</h4>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{viewItem.content || viewItem.summary}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <button onClick={closeView} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-sm font-medium">Close</button>
            <button onClick={()=>{closeView(); onEdit(viewItem);}} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium">Edit</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};
export default NewsManagementSection;
