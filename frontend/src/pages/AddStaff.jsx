import React, { useState } from 'react';

export default function AddStaff(){
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!fullName || !email) {
      setError('Please enter name and email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/staff/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, role })
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json().catch(() => ({}));
      setMessage(data.message || 'Staff member added (mock).');
      setFullName(''); setEmail(''); setRole('Staff');
        } catch {
          setError('Failed to add staff.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="panel-bg rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Add Staff</h2>
        {message && <div className="mb-3 p-3 rounded bg-[rgba(16,185,129,0.12)] text-[var(--primary-200)]">{message}</div>}
        {error && <div className="mb-3 p-3 rounded bg-[rgba(225,29,72,0.08)] text-rose-300">{error}</div>}
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={fullName} onChange={e=>setFullName(e.target.value)} className="p-3 rounded bg-white/6 border border-white/10 text-white" placeholder="Full name" />
          <input value={email} onChange={e=>setEmail(e.target.value)} className="p-3 rounded bg-white/6 border border-white/10 text-white" placeholder="Email" />
          <select value={role} onChange={e=>setRole(e.target.value)} className="p-3 rounded bg-white/6 border border-white/10 text-white">
            <option>Staff</option>
            <option>Supervisor</option>
            <option>Manager</option>
            <option>Administrator</option>
          </select>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[var(--primary-500)] rounded text-white">
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button type="button" onClick={()=>{ setFullName(''); setEmail(''); setRole('Staff'); setError(null); setMessage(null); }} className="px-4 py-2 border rounded text-white">Reset</button>
          </div>
        </form>
        <div className="mt-6 text-sm text-muted">This is a frontend placeholder. Replace /api/staff/add with your backend endpoint when ready.</div>
      </div>
    </div>
  );
}
