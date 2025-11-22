import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateStaff() {
  const [staffId, setStaffId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Guard');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      setError('Access denied: Admins only');
      const t = setTimeout(() => navigate('/admin/login'), 1400);
      return () => clearTimeout(t);
    }
  }, [navigate]);

  async function handleCreate(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      let id = staffId && staffId.trim();
      if (!id) id = 'STF' + Date.now().toString().slice(-6);
      if (id.length < 3) return setError('Staff ID too short');
      if (password.length < 8) return setError('Password too short (min 8)');
      const payload = { staffId: id, firstName, lastName, email, phone, role, password };
      const res = await fetch('/api/staff/create', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Auth-Role': 'admin' }, body: JSON.stringify(payload) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) return setError(j.message || 'Unable to create staff');
      setSuccess('Staff account created');
      setStaffId(''); setPassword(''); setFirstName(''); setLastName(''); setEmail(''); setPhone('');
      if (j.tempPassword) {
        setTempPassword(j.tempPassword);
      }
      // show temp password and then redirect to staff list
      setTimeout(() => navigate('/admin/staff/list'), 1800);
  } catch { setError('Network error'); }
  finally { setLoading(false); }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">Create Staff Account</div>
          <div className="auth-subtitle">Admins may create staff accounts (ID + password)</div>
        </div>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <input className="auth-input" placeholder="Staff ID (leave blank to auto-generate)" value={staffId} onChange={(e) => setStaffId(e.target.value)} />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-row">
            <select className="auth-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Guard</option>
              <option>Supervisor</option>
              <option>Manager</option>
            </select>
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required type="password" />
          </div>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="text-[var(--success-500)] mb-2">{success}</div>}
          <div className="auth-actions">
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Staff'}</button>
            <button type="button" className="auth-btn secondary" onClick={() => navigate('/admin')} disabled={loading}>Back</button>
          </div>
          {tempPassword && (
                <div style={{ marginTop: 12 }}>
                  <div className="text-sm">Temporary password: <code aria-live='polite'>{tempPassword}</code></div>
                  <div className='mt-2 flex items-center gap-2'>
                    <button className="auth-btn" type="button" onClick={async () => { try { await navigator.clipboard.writeText(tempPassword); setCopied(true); setTimeout(()=>setCopied(false),2000); } catch { setCopied(false);} }} aria-label='Copy temporary password'>Copy</button>
                    <span aria-live='polite' className='text-sm text-white/80'>{copied ? 'Copied' : ''}</span>
                  </div>
                </div>
              )}
        </form>
      </div>
    </div>
  );
}
