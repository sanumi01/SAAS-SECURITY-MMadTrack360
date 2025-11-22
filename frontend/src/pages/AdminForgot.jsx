import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminForgot() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(''); setLoading(true);
    try {
      const res = await fetch('/api/admin/forgot', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
      if (!res.ok) return setStatus('Unable to submit request');
      setStatus('If the email exists, a reset link has been sent.');
  } catch { setStatus('Network error'); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Admin password reset</h2>
        <p className="auth-subtitle">Enter your admin email to receive a password reset link.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input className="auth-input" placeholder="Email address" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
          </div>
          <div className="auth-actions">
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
            <button type="button" className="auth-btn secondary" onClick={()=>navigate('/admin/login')}>Back to login</button>
          </div>
          {status && <div className="form-error" role="status">{status}</div>}
        </form>
      </div>
    </div>
  );
}
