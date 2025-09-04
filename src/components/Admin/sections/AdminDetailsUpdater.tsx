import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Display-only card with modal edit
const AdminDetailsUpdater: React.FC = () => {
  const [initials, setInitials] = useState('');
  const [surname, setSurname] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<'idle'|'saving'|'success'|'error'>('idle');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState<{initials:boolean; surname:boolean}>({initials:false, surname:false});

  useEffect(()=>{ try { const raw=sessionStorage.getItem('currentAdmin'); if(raw){ const obj=JSON.parse(raw); setInitials(obj.initials||obj.Initials||obj.name||''); setSurname(obj.surname||obj.Surname||''); } } catch{} },[]);

  const validInitials = initials.trim().length>0 && initials.trim().length<=10;
  const validSurname = surname.trim().length>1;
  const disabled = !validInitials || !validSurname || status==='saving';

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault(); if(disabled) return; setStatus('saving'); setMessage('');
    try {
      let adminId: number | undefined; const stored=sessionStorage.getItem('adminNumericId'); if(stored){ const n=Number(stored); if(!Number.isNaN(n)) adminId=n; }
      if(!adminId){ const raw=sessionStorage.getItem('currentAdmin'); if(raw){ try { const obj=JSON.parse(raw); const poss=[obj.adminId,obj.AdminId,obj.id,obj.Id]; for(const v of poss){ const n=Number(v); if(!Number.isNaN(n)){ adminId=n; break; } } } catch{} } }
      if(!adminId) throw new Error('Missing adminId');
      await axios.post('/api/Admin/updateDetails', { adminId, initials: initials.trim(), surname: surname.trim() });
      try { const raw=sessionStorage.getItem('currentAdmin'); if(raw){ const obj=JSON.parse(raw); obj.initials=initials.trim(); obj.surname=surname.trim(); sessionStorage.setItem('currentAdmin', JSON.stringify(obj)); } } catch{}
      setStatus('success'); setMessage('Details updated');
      setTimeout(()=>{ setStatus('idle'); setShowModal(false); }, 1000);
    } catch(err:any){ setStatus('error'); setMessage(err?.response?.data?.message || err?.message || 'Update failed'); }
  };

  return (
    <>
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Admin Profile Details</h3>
          <button onClick={()=>setShowModal(true)} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit</button>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500 font-medium mb-1">Initials</p>
            <p className="font-semibold text-gray-900 break-all">{initials || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Surname</p>
            <p className="font-semibold text-gray-900 break-all">{surname || '—'}</p>
          </div>
        </div>
        {status==='error' && <p className="mt-3 text-xs text-red-600">{message}</p>}
        {status==='success' && <p className="mt-3 text-xs text-green-600">{message}</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Edit Profile Details</h4>
              <button onClick={()=>setShowModal(false)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">✕</button>
            </div>
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
                <button type="button" onClick={()=>setShowModal(false)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={disabled} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                  {status==='saving' && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{status==='saving' ? 'Saving...' : 'Save Changes'}</span>
                </button>
                {status==='error' && <span className="text-xs text-red-600 font-medium">{message}</span>}
                {status==='success' && <span className="text-xs text-green-600 font-medium">{message}</span>}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default AdminDetailsUpdater;
