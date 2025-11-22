import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const navigate = useNavigate();

  async function fetchList() {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/staff-list', { headers: { 'X-Auth-Role': 'admin' } });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) return setError(j.message || 'Unable to fetch staff');
      setStaff(j.list || []);
  } catch { setError('Network error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchList(); }, []);

  return (
    <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2>Staff</h2>
          <input aria-label='Search staff' placeholder='Search staff by id, name, email' value={query} onChange={(e) => setQuery(e.target.value)} className='auth-input' />
        </div>
        <div>
          <button className="auth-btn" onClick={() => navigate('/admin/staff/create')}>Create staff</button>
        </div>
      </div>
      {error && <div className="form-error" role='alert' aria-live='polite'>{error}</div>}
      {loading ? (
        <div role='status' aria-live='polite'>Loading…</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Phone</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Role</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.filter(s => {
              const q = query.trim().toLowerCase();
              if (!q) return true;
              return [s.staffId, (s.firstName||'') + ' ' + (s.lastName||''), s.email, s.phone, s.role].join(' ').toLowerCase().includes(q);
            }).map(s => (
              <tr key={s.staffId} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{s.staffId}</td>
                <td style={{ padding: 8 }}>
                  {editingId === s.staffId ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={editValues.firstName||s.firstName||''} onChange={(e)=>setEditValues(ev=>({...ev, firstName:e.target.value}))} className='auth-input' />
                      <input value={editValues.lastName||s.lastName||''} onChange={(e)=>setEditValues(ev=>({...ev, lastName:e.target.value}))} className='auth-input' />
                    </div>
                  ) : (`${s.firstName || ''} ${s.lastName || ''}`)}
                </td>
                <td style={{ padding: 8 }}>{editingId === s.staffId ? (<input value={editValues.email||s.email||''} onChange={(e)=>setEditValues(ev=>({...ev, email:e.target.value}))} className='auth-input' />) : (s.email)}</td>
                <td style={{ padding: 8 }}>{editingId === s.staffId ? (<input value={editValues.phone||s.phone||''} onChange={(e)=>setEditValues(ev=>({...ev, phone:e.target.value}))} className='auth-input' />) : (s.phone)}</td>
                <td style={{ padding: 8 }}>{editingId === s.staffId ? (<select value={editValues.role||s.role||'Guard'} onChange={(e)=>setEditValues(ev=>({...ev, role:e.target.value}))} className='auth-input'><option>Guard</option><option>Supervisor</option><option>Dispatcher</option><option>Manager</option></select>) : (s.role)}</td>
                <td style={{ padding: 8 }}>{s.status || 'Active'}</td>
                <td style={{ padding: 8 }}>
                  {editingId === s.staffId ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={async ()=>{
                        // save
                        try{ setLoading(true); setError('');
                          const res = await fetch('/api/staff/update', { method: 'POST', headers: {'Content-Type':'application/json','X-Auth-Role':'admin'}, body: JSON.stringify({ staffId: s.staffId, ...editValues })});
                          const j = await res.json().catch(()=>({}));
                          if (!res.ok) return setError(j.message||'Unable to save');
                          setEditingId(null); fetchList();
                        } catch { setError('Network error'); } finally{ setLoading(false); }
                      }} className='auth-btn'>Save</button>
                      <button onClick={()=>{ setEditingId(null); setEditValues({}); }} className='auth-btn secondary'>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={()=>{ setEditingId(s.staffId); setEditValues({ firstName: s.firstName, lastName: s.lastName, email: s.email, phone: s.phone, role: s.role }); }} className='auth-btn'>Edit</button>
                      <button onClick={async ()=>{ try{ setLoading(true); setError(''); const res = await fetch('/api/staff/suspend',{ method: 'POST', headers: {'Content-Type':'application/json','X-Auth-Role':'admin'}, body: JSON.stringify({ staffId: s.staffId, suspend: s.status !== 'Suspended' })}); const j = await res.json().catch(()=>({})); if(!res.ok) return setError(j.message||'Unable'); fetchList(); } catch { setError('Network error'); } finally{ setLoading(false); } }} className='auth-btn secondary'>{s.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}</button>
                      <button onClick={async ()=>{ try{ setLoading(true); setError(''); const res = await fetch('/api/admin/staff-reset',{ method: 'POST', headers: {'Content-Type':'application/json','X-Auth-Role':'admin'}, body: JSON.stringify({ staffId: s.staffId })}); const j = await res.json().catch(()=>({})); if(!res.ok) return setError(j.message||'Unable to reset'); alert('Reset email sent to staff if email exists'); } catch { setError('Network error'); } finally{ setLoading(false); } }} className='auth-btn'>Reset PW</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
