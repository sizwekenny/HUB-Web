import React, { useState } from 'react';
import axios from 'axios';

const AdminPasswordUpdater: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState<{current:boolean; next:boolean; confirm:boolean}>({current:false,next:false,confirm:false});
  const [status, setStatus] = useState<'idle'|'saving'|'success'|'error'>('idle');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const minLen = 8;
  const validNew = newPassword.length >= minLen && newPassword !== currentPassword;
  const match = newPassword === confirmPassword && confirmPassword.length>0;
  const disabled = !currentPassword || !validNew || !match || status==='saving';

  const strengthScore = (() => {
    if(!newPassword) return 0; let score=0; const pw=newPassword;
    if(pw.length>=8) score+=1; if(pw.length>=12) score+=1; if(/[a-z]/.test(pw)&&/[A-Z]/.test(pw)) score+=1; if(/[0-9]/.test(pw)) score+=1; if(/[^A-Za-z0-9]/.test(pw)) score+=1; return Math.min(score,5);
  })();
  const strengthLabel = ['','Weak','Fair','Good','Strong','Excellent'][strengthScore];
  const strengthColor = ['bg-gray-300','bg-red-500','bg-amber-500','bg-blue-500','bg-green-500','bg-emerald-600'][strengthScore];

  const submit = async (e:React.FormEvent) => {
    e.preventDefault(); if(disabled) return; setStatus('saving'); setMessage('');
    try {
      let adminId: number | undefined; const stored=sessionStorage.getItem('adminNumericId'); if(stored){ const n=Number(stored); if(!Number.isNaN(n)) adminId=n; }
      if(!adminId){ const raw=sessionStorage.getItem('currentAdmin'); if(raw){ try { const obj=JSON.parse(raw); const poss=[obj.adminId,obj.AdminId,obj.id,obj.Id]; for(const v of poss){ const n=Number(v); if(!Number.isNaN(n)){ adminId=n; break; } } } catch{} } }
      if(!adminId) throw new Error('Missing admin id');
      await axios.post('/api/Admin/updatePassword', { id: adminId, currentPassword, password: newPassword });
      setStatus('success'); setMessage('Password updated');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(()=>{ setStatus('idle'); setOpen(false); }, 1200);
    } catch(err:any){ setStatus('error'); setMessage(err?.response?.data?.message || err?.message || 'Update failed'); }
  };

  return (
    <>
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Password</h3>
          <p className="text-xs text-gray-500 mt-1">Secure your account with a strong password.</p>
        </div>
        <button onClick={()=>setOpen(true)} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Change</button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-semibold text-gray-900">Update Password</h3><button onClick={()=>setOpen(false)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">✕</button></div>
            <form onSubmit={submit} className="space-y-6">
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
                      {validNew && strengthScore<3 && <p className="text-[11px] text-amber-600">Add uppercase, numbers & symbols for a stronger password.</p>}
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
                <button type="button" onClick={()=>setOpen(false)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={disabled} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                  {status==='saving' && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
                  <span>{status==='saving' ? 'Updating...' : 'Save Password'}</span>
                </button>
                {status==='error' && <span className="text-xs text-red-600 font-medium">{message}</span>}
                {status==='success' && <span className="text-xs text-green-600 font-medium">{message}</span>}
              </div>
              <p className="text-[11px] text-gray-500">After changing, you remain logged in for this session. Use the new password next login.</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default AdminPasswordUpdater;
