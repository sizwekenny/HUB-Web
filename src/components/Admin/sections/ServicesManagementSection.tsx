import React from 'react';
import { Plus, Edit, Trash2, Search, ListOrdered, EyeOff } from 'lucide-react';
import { Service } from '../../../types';

interface Props {
  services: Service[]; serviceSearch: string; serviceCategoryFilter: string;
  onSearchChange: (v:string)=>void; onCategoryChange:(v:string)=>void;
  onAdd: ()=>void; onEdit:(s:Service)=>void; onDelete:(id:string)=>void;
  showForm: boolean; editingService: Service | null; serviceForm: Omit<Service,'id'>;
  setServiceForm: (f:Omit<Service,'id'>)=>void; onCloseForm:()=>void; onSave:()=>void;
  newStep: string; setNewStep:(v:string)=>void; addStep:()=>void; removeStep:(i:number)=>void; moveStep:(i:number,d:-1|1)=>void;
}

const ServicesManagementSection: React.FC<Props> = ({ services, serviceSearch, serviceCategoryFilter, onSearchChange, onCategoryChange, onAdd, onEdit, onDelete, showForm, editingService, serviceForm, setServiceForm, onCloseForm, onSave, newStep, setNewStep, addStep, removeStep, moveStep }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Services Management</h2>
            <div className="flex flex-wrap gap-3 items-center">
              <select value={serviceCategoryFilter} onChange={e=>onCategoryChange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"><option value="All">All Categories</option><option value="Senior Students">Senior Students</option><option value="Newcomer Students">Newcomer Students</option><option value="All Students">All Students</option></select>
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input value={serviceSearch} onChange={e=>onSearchChange(e.target.value)} placeholder="Search services..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" /></div>
              <button onClick={onAdd} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"><Plus className="w-4 h-4" /><span>Add Service</span></button>
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
                    <td className="py-3 px-2"><div className="flex items-center justify-end space-x-2"><button onClick={()=>onEdit(s)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button><button onClick={()=>onDelete(s.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button></div></td>
                  </tr>
                ))}
                {services.length===0 && <tr><td colSpan={5} className="py-10 text-center text-gray-500 text-sm">No services found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between"><h3 className="text-xl font-semibold text-gray-900">{editingService ? 'Edit Service' : 'Create Service'}</h3><button onClick={onCloseForm} className="p-2 rounded-full hover:bg-gray-100"><EyeOff className="w-5 h-5 text-gray-500" /></button></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium text-gray-700">Title *</label><input value={serviceForm.title} onChange={e=>setServiceForm({ ...serviceForm, title:e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter title" /></div>
                <div className="space-y-2"><label className="text-sm font-medium text-gray-700">Category</label><select value={serviceForm.category} onChange={e=>setServiceForm({ ...serviceForm, category:e.target.value as any })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option value="Senior Students">Senior Students</option><option value="Newcomer Students">Newcomer Students</option><option value="All Students">All Students</option></select></div>
                <div className="space-y-2 md:col-span-2"><label className="text-sm font-medium text-gray-700">Short Description *</label><textarea value={serviceForm.description} onChange={e=>setServiceForm({ ...serviceForm, description:e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /></div>
                <div className="space-y-2 md:col-span-2"><label className="text-sm font-medium text-gray-700">Details *</label><textarea value={serviceForm.details} onChange={e=>setServiceForm({ ...serviceForm, details:e.target.value })} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /></div>
                <div className="space-y-2 md:col-span-2"><label className="text-sm font-medium text-gray-700">Quick Link (optional)</label><input value={serviceForm.statusLink || ''} onChange={e=>setServiceForm({ ...serviceForm, statusLink:e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://" /></div>
                <div className="space-y-2 md:col-span-2"><label className="text-sm font-medium text-gray-700 flex items-center gap-2">Steps <ListOrdered className="w-4 h-4 text-gray-500" /></label><div className="space-y-3"><div className="flex gap-2"><input value={newStep} onChange={e=>setNewStep(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Add a step and press +" /><button type="button" onClick={addStep} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" /></button></div><ol className="space-y-2 list-decimal ml-5">{(serviceForm.steps || []).map((s, idx) => (<li key={idx} className="bg-gray-50 rounded-lg p-3 flex justify-between items-start gap-3"><span className="text-sm text-gray-800 flex-1 whitespace-pre-wrap">{s}</span><div className="flex gap-1"><button type="button" onClick={()=>moveStep(idx,-1)} disabled={idx===0} className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-40">↑</button><button type="button" onClick={()=>moveStep(idx,1)} disabled={idx===(serviceForm.steps!.length-1)} className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-40">↓</button><button type="button" onClick={()=>removeStep(idx)} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">✕</button></div></li>))}{(serviceForm.steps || []).length===0 && <p className="text-xs text-gray-500">No steps added yet.</p>}</ol></div></div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t"><button onClick={onCloseForm} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button><button onClick={onSave} disabled={!serviceForm.title || !serviceForm.description || !serviceForm.details} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{editingService ? 'Update' : 'Create'} Service</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ServicesManagementSection;
