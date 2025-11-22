
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

function Login() {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = React.useState(false);
  const [signupSuccess, setSignupSuccess] = React.useState(false);
  const [signupForm, setSignupForm] = React.useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = React.useState(false);
  // New login form state
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('admin'); // default selection

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
      setLoading(true);
    // Simulate signup success (replace with real API call if available)
      setTimeout(() => {
        setSignupSuccess(true);
        setLoading(false);
        setTimeout(() => {
          setShowSignup(false);
          setSignupSuccess(false);
          setSignupForm({ name: '', email: '', password: '' });
        }, 2000);
      }, 1800);
  };

  return (
  <div className="app-main-bg min-h-screen flex items-center justify-center text-white px-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
      {/* MMadTrack360 Logo */}
      {/* Theme Toggle */}
      {/* Theme toggle removed for single-color brand */}
      <div style={{ marginBottom: 18, animation: 'fadeInDown 0.8s', textAlign: 'center' }}>
        <img src="/MMAD_App_logo.jpeg" alt="MMadTrack360 Logo" className="w-28 mx-auto mb-2" />
        <h1 className="font-extrabold text-2xl mb-1" style={{ letterSpacing: 0.6, textShadow: '0 2px 6px var(--primary-700)' }}>MMadTrack360</h1>
        <div className="text-sm text-[var(--primary-200)]">SaaS Security Platform</div>
      </div>

      <div className="panel-bg rounded-2xl p-6 shadow-lg w-full max-w-[420px] animate-fadeInUp">
        <h2 className="text-lg font-semibold mb-2">Sign in</h2>
        <p className="text-muted mb-4 text-sm" style={{ textAlign: 'center' }}>Sign in to continue to your MMadTrack360 dashboard.</p>

        <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={(e) => {
          e.preventDefault();
          // demo auth flow
          localStorage.setItem('isAuthenticated', 'true');
          if (role === 'admin') navigate('/admin'); else navigate('/admin/staff');
        }}>
          <label className="sr-only">Role</label>
          <div style={{ position: 'relative' }}>
            <select aria-label="Select role" value={role} onChange={(e) => setRole(e.target.value)} className="p-3 rounded bg-white/6 border border-white/10 text-white w-full role-select">
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
            {/* arrow */}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary-200)' }} xmlns="http://www.w3.org/2000/svg"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>

          <input type="email" name="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 rounded bg-white/6 border border-white/10 text-white" required />
          <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-3 rounded bg-white/6 border border-white/10 text-white" required />

          <button type="submit" className="login-btn admin justify-center">
            <ShieldCheckIcon style={{ width: 18, height: 18 }} />
            <span>{role === 'admin' ? 'Sign in as Admin' : 'Sign in as Staff'}</span>
          </button>
        </form>

        <div className="flex items-center justify-between mt-3">
          <a href="#" className="text-[var(--primary-200)] text-sm">Forgot password?</a>
          <button className="text-sm text-[var(--primary-200)] bg-transparent border-none" onClick={() => setShowSignup(true)}>Create account</button>
        </div>

        {/* Social Login - optional, kept minimal */}
        <div style={{ marginTop: 14 }}>
          <button className="login-btn social google w-full" aria-label="Login with Google" onClick={() => alert('Google login coming soon!')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" style={{ width: 18, height: 18, marginRight: 8 }} aria-hidden="true" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
      <div className="mt-6 text-center text-muted max-w-md" style={{ animation: 'fadeIn 1.2s' }}>
        <p className="text-sm">Login as <b>Admin</b> or <b>Staff</b> to access your dashboard. Need an account? <button className="text-[var(--primary-200)] underline" onClick={() => setShowSignup(true)}>Create one</button>.</p>
      </div>
      {/* Admin Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="panel-bg rounded-2xl p-6 shadow-lg w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setShowSignup(false)} aria-label="Close">&times;</button>
            <h2 className="text-xl font-bold mb-4 text-white">Create account</h2>
            {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0' }}>
                          <div className="spinner" style={{ width: 48, height: 48, border: '6px solid var(--primary-200)', borderTop: '6px solid var(--primary-500)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 16 }}></div>
                          <span className="text-white font-semibold">Processing...</span>
                        </div>
                ) : signupSuccess ? (
                  <div className="mb-8 text-[var(--success)] font-semibold text-lg animate-fadeIn">Signup successful! Welcome, {signupForm.name || 'User'}.</div>
                ) : (
                  <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={handleSignupSubmit}>
                <input type="text" name="name" placeholder="Full Name" value={signupForm.name} onChange={handleSignupChange} className="p-3 rounded bg-white/6 border border-white/10 text-white" required />
                <input type="email" name="email" placeholder="Email Address" value={signupForm.email} onChange={handleSignupChange} className="p-3 rounded bg-white/6 border border-white/10 text-white" required />
                <input type="password" name="password" placeholder="Password" value={signupForm.password} onChange={handleSignupChange} className="p-3 rounded bg-white/6 border border-white/10 text-white" required />
                <button type="submit" className="login-btn admin mt-2">Create account</button>
                {/* Error message for demo purposes */}
                {signupForm.email && !signupForm.email.includes('@') && (
                  <div className="mt-2 text-[var(--warning)] font-medium">Please enter a valid email address.</div>
                )}
              </form>
            )}
            <div className="mt-4 text-center text-muted" style={{ animation: 'fadeIn 0.5s' }}>
              {signupSuccess ? 'Redirecting to dashboard...' : 'All admin features will be available after signup.'}
            </div>
          </div>
        </div>
      )}
      {/* Animations & Enhanced Button Styles */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .login-btn {
          margin: 10px;
          padding: 14px 32px;
          font-size: 18px;
          font-weight: 500;
          border-radius: 8px;
          border: none;
          box-shadow: 0 6px 28px var(--accent-glow);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s, transform 0.2s;
        }
  .login-btn.admin { background: var(--primary-500); color: #fff; }
  .login-btn.staff { background: var(--primary-500); color: #fff; }
  .login-btn.signup { background: var(--primary-500); color: #fff; }
        .login-btn:hover {
          transform: scale(1.04);
          filter: brightness(1.1);
        }
          .spinner {
            border: 6px solid var(--primary-200);
            border-top: 6px solid var(--primary-500);
            border-radius: 50%;
            width: 48px;
            height: 48px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        @media (max-width: 600px) {
          .sidebar, .main-content, .feature-card, .page-header, .login-modal {
            min-width: 0 !important;
            max-width: 100vw !important;
            padding: 12px !important;
          }
        }
      `}</style>
      {/* Browser Debugging Tips */}
      <div className="mt-6 text-center text-yellow-400 max-w-md">
        <b>Browser Debugging:</b> If you see a blank page, open your browser's DevTools (press <kbd>F12</kbd> or <kbd>Ctrl+Shift+I</kbd>) and check the Console for errors. <br />
        <a href="#" className="text-[var(--primary-200)] underline" onClick={() => { window.open('about:blank', '_blank'); alert('Press F12 or Ctrl+Shift+I in the new tab to open DevTools.'); }}>Open DevTools Help</a>
      </div>
    </div>
  );
}

export default Login;
