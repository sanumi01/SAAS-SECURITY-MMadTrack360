import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StaffLogin() {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/staff/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ staffId, password }) });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        return setError(j.message || 'Login failed');
      }
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'staff');
      navigate('/staff/dashboard');
  } catch { setError('Network error'); }
  }

  async function handleForgot() {
    const id = prompt('Enter your Staff ID to reset password');
    if (!id) return;
    try {
      const res = await fetch('/api/staff/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ staffId: id }) });
      if (!res.ok) return setError('Unable to send reset');
      alert('Password reset sent if the staff id exists');
  } catch { setError('Network error'); }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">Staff Sign in</div>
          <div className="auth-subtitle">Sign in with your Staff ID.</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input className="auth-input" placeholder="Staff ID" value={staffId} onChange={(e) => setStaffId(e.target.value)} required />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="auth-actions">
            <button className="auth-btn" type="submit">Sign In</button>
            <button type="button" className="auth-btn secondary" onClick={handleForgot}>Forgot Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}
