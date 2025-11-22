import React, { useState } from 'react';

export default function CreateStaffAccount(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Staff');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null); setMessage(null);
    if (!username || !email || !password) { setError('Please fill all fields.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/staff/create', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username, email, password, role }) });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json().catch(()=>({}));
      setMessage(data.message || 'Staff account created (mock).');
      setUsername(''); setEmail(''); setPassword(''); setRole('Staff');
    } catch { setError('Failed to create account.'); } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen">
      <div className="panel-bg rounded-2xl p-6 shadow-lg max-w-3xl">
        <h2 className="text-xl font-semibold text-white mb-3">Create Staff Account</h2>
        {message && <div className="mb-3 p-3 rounded bg-[rgba(16,185,129,0.12)] text-[var(--primary-200)]">{message}</div>}
        {error && <div className="mb-3 p-3 rounded bg-[rgba(225,29,72,0.08)] text-rose-300">{error}</div>}
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={username} onChange={e=>setUsername(e.target.value)} className="p-3 rounded bg-white/6 border border-white/10 text-white" placeholder="Username" />
          <input value={email} onChange={e=>setEmail(e.target.value)} className="p-3 rounded bg-white/6 border border-white/10 text-white" placeholder="Email" />
          <input value={password} onChange={e=>setPassword(e.target.value)} className="p-3 rounded bg-white/6 border border-white/10 text-white" placeholder="Temporary password" />
          <select value={role} onChange={e=>setRole(e.target.value)} className="p-3 rounded bg-white/6 border border-white/10 text-white">
            <option>Staff</option>
            <option>Supervisor</option>
            <option>Manager</option>
          </select>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[var(--primary-500)] rounded text-white">{loading ? 'Creating...' : 'Create'}</button>
            <button type="button" onClick={()=>{ setUsername(''); setEmail(''); setPassword(''); setRole('Staff'); setError(null); setMessage(null); }} className="px-4 py-2 border rounded text-white">Reset</button>
          </div>
        </form>
        <div className="mt-6 text-sm text-muted">This will create a staff account and return a confirmation. Hook to /api/staff/create for real behavior.</div>
      </div>
    </div>
  );
}
