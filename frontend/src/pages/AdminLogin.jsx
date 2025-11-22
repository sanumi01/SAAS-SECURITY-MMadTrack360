import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) return setError(j.message || 'Login failed');
      // example token handling
      if (j && j.role === 'admin') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('role', 'admin');
        navigate('/admin');
      } else {
        setError('Unauthorized');
      }
  } catch { setError('Network error'); }
    finally { setLoading(false); }
  }

  async function handleForgot() {
    const emailPrompt = prompt('Enter your admin email to reset password');
    if (!emailPrompt) return;
    try {
      const res = await fetch('/api/admin/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: emailPrompt }) });
      if (!res.ok) return setError('Unable to send reset email');
      setResetSent('Password reset sent if the email is registered');
  } catch { setError('Network error'); }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" role="region" aria-labelledby="admin-signin">
        <div className="auth-header">
          <div id="admin-signin" className="auth-title">Admin Sign in</div>
          <div className="auth-subtitle">Use your admin credentials to sign in.</div>
        </div>
        <form onSubmit={handleSubmit} aria-live="polite">
          <div className="form-row">
            <label className="sr-only" htmlFor="admin-email">Email address</label>
            <input id="admin-email" className="auth-input" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="form-row">
            <label className="sr-only" htmlFor="admin-password">Password</label>
            <input id="admin-password" className="auth-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          {resetSent && <div className="text-[var(--primary-300)] mb-2">{resetSent}</div>}
          <div className="auth-actions">
            <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
            <button type="button" className="auth-btn secondary" onClick={handleForgot} disabled={loading}>Forgot Password</button>
          </div>
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <button className="small-link" type="button" onClick={() => navigate('/admin/signup')}>Create admin account</button>
          </div>
        </form>
      </div>
    </div>
  );
}
