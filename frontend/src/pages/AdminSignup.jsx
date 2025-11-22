import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateE164(phone) {
  return /^\+?[1-9]\d{1,14}$/.test(phone || '');
}

function checkPasswordStrength(pw) {
  const minLength = pw.length >= 12;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return { ok: minLength && hasUpper && hasLower && hasNumber && hasSpecial, details: { minLength, hasUpper, hasLower, hasNumber, hasSpecial } };
}

export default function AdminSignup() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', address: '', city: '', region: '', postcode: '', country: '', role: 'Administrator', password: '', confirm: '', acceptTerms: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.firstName || !form.lastName) return setError('Name is required');
    if (!validateEmail(form.email)) return setError('Invalid email format');
    if (!validateE164(form.phone)) return setError('Phone must be E.164 format, e.g. +15551234567');
    if (!form.acceptTerms) return setError('You must accept terms and privacy');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    const strength = checkPasswordStrength(form.password);
    if (!strength.ok) return setError('Password does not meet strength requirements (min 12 chars, upper/lower/number/symbol)');

    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        company: form.company,
        address: { street: form.address, city: form.city, region: form.region, postcode: form.postcode, country: form.country },
        role: form.role,
        password: form.password,
        acceptTerms: form.acceptTerms,
      };
      const res = await fetch('/api/admin/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) return setError(j.message || 'Signup failed');
      setSuccess('Account created. Please sign in.');
      setTimeout(() => navigate('/admin/login'), 1200);
    } catch { setError('Network error'); } finally { setLoading(false); }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" role="region" aria-labelledby="admin-signup-heading">
        <div className="auth-header">
          <div id="admin-signup-heading" className="auth-title">Admin Signup</div>
          <div className="auth-subtitle">Create an administrator account. Admins can create and manage staff accounts.</div>
        </div>
        <form onSubmit={handleSubmit} aria-live="polite">
          <h3 className="text-sm font-semibold mb-2">Personal</h3>
          <div className="form-row">
            <input className="auth-input" placeholder="First name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="Last name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
          </div>

          <h3 className="text-sm font-semibold mb-2">Contact</h3>
          <div className="form-row">
            <input className="auth-input" placeholder="Email address" value={form.email} onChange={(e) => update('email', e.target.value)} type="email" required />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="Phone (E.164) e.g. +15551234567" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
          </div>

          <h3 className="text-sm font-semibold mb-2">Company</h3>
          <div className="form-row">
            <input className="auth-input" placeholder="Company name" value={form.company} onChange={(e) => update('company', e.target.value)} />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="Street address" value={form.address} onChange={(e) => update('address', e.target.value)} />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="State / Region" value={form.region} onChange={(e) => update('region', e.target.value)} />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="Postcode" value={form.postcode} onChange={(e) => update('postcode', e.target.value)} />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="Country" value={form.country} onChange={(e) => update('country', e.target.value)} />
          </div>

          <h3 className="text-sm font-semibold mb-2">Security</h3>
          <div className="form-row">
            <input className="auth-input" placeholder="Password" value={form.password} onChange={(e) => update('password', e.target.value)} type="password" required />
          </div>
          <div className="form-row">
            <input className="auth-input" placeholder="Confirm password" value={form.confirm} onChange={(e) => update('confirm', e.target.value)} type="password" required />
          </div>

          <div className="form-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input id="acceptTerms" type="checkbox" checked={form.acceptTerms} onChange={(e) => update('acceptTerms', e.target.checked)} />
            <label htmlFor="acceptTerms" className="text-sm">I agree to the Terms & Privacy</label>
          </div>

          {error && <div className="form-error" role="alert">{error}</div>}
          {success && <div className="text-[var(--success-500)] mb-2">{success}</div>}

          <div className="auth-actions">
            <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
            <button type="button" className="auth-btn secondary" onClick={() => navigate('/admin/login')}>Have an account?</button>
          </div>
        </form>
      </div>
    </div>
  );
}
