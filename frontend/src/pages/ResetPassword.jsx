import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function checkPasswordStrength(pw) {
  const minLength = pw.length >= 12;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return { ok: minLength && hasUpper && hasLower && hasNumber && hasSpecial, details: { minLength, hasUpper, hasLower, hasNumber, hasSpecial } };
}

export default function ResetPassword(){
  const nav = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get('token');
  const [valid, setValid] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // removed unused copy state

  useEffect(() => {
    if (!token) return;
    fetch(`/api/reset/verify/${token}`).then(r => r.json().then(j => { if (r.ok) { setValid(true); } else { setError(j.message || 'Invalid token'); } })).catch(()=>setError('Network')) .finally(()=>setChecked(true));
  }, [token]);

  async function handleSubmit(e){
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match');
    const strength = checkPasswordStrength(password);
    if (!strength.ok) return setError('Password must be at least 12 chars and include upper/lower/number/symbol');
    setLoading(true);
    try{
      const res = await fetch('/api/reset/complete', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ token, password }) });
      const j = await res.json().catch(()=>({}));
      if (!res.ok) return setError(j.message || 'Unable to reset');
      // On success, force sign-out client-side and prompt re-login
      localStorage.removeItem('role');
      localStorage.removeItem('authToken');
      alert('Password reset. Please sign in with your new password.');
      nav('/admin/login');
  } catch { setError('Network error'); } finally { setLoading(false); }
  }

  if (!token) return (<div className='auth-container'><div className='auth-card'><div className='auth-title'>Invalid reset link</div></div></div>);

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h2 className='auth-title'>Reset password</h2>
        {!checked ? <div>Verifying…</div> : (!valid ? <div className='form-error' role='alert' aria-live='polite'>{error || 'Invalid or expired link'}</div> : (
          <form onSubmit={handleSubmit}>
            <div className='form-row'>
              <input className='auth-input' placeholder='New password' type='password' value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </div>
            <div className='text-xs mt-1 mb-2'>Password must be at least 12 characters and include uppercase, lowercase, number and symbol.</div>
            <div className='form-row'>
              <progress max='5' value={(password.length>=12?1:0) + (/[A-Z]/.test(password)?1:0) + (/[a-z]/.test(password)?1:0) + (/[0-9]/.test(password)?1:0) + (/[^A-Za-z0-9]/.test(password)?1:0)} className='w-full' aria-hidden />
            </div>
            <div className='form-row'>
              <input className='auth-input' placeholder='Confirm password' type='password' value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
            </div>
            {error && <div className='form-error'>{error}</div>}
            <div className='auth-actions'>
              <button className='auth-btn' type='submit' disabled={loading}>{loading ? 'Saving…' : 'Set new password'}</button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
