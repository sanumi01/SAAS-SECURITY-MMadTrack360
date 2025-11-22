import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StaffForgot() {
  const [identifier, setIdentifier] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(''); setLoading(true);
    try {
      const res = await fetch('/api/staff/forgot', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ staffId: identifier, email: identifier }) });
      if (!res.ok) return setStatus('Unable to submit request');
      setStatus('If the account exists, a reset link has been sent.');
  } catch { setStatus('Network error'); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Staff password reset</h2>
        <p className="auth-subtitle">Enter your Staff ID or email to receive a password reset link.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input className="auth-input" placeholder="Staff ID or Email" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} required />
          </div>
          <div className="auth-actions">
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
            <button type="button" className="auth-btn secondary" onClick={()=>navigate('/staff/login')}>Back to login</button>
          </div>
          {status && <div className="form-error" role="status">{status}</div>}
        </form>
      </div>
    </div>
  );
}
