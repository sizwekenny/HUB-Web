import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
export default AdminEmailUpdater;
