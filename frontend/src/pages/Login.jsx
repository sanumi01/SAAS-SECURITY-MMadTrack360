
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, ShieldCheckIcon, UserPlusIcon } from '@heroicons/react/24/solid';

function Login({ onLogin }) {
  const [darkMode, setDarkMode] = React.useState(true);
  const navigate = useNavigate();
    const [showSignup, setShowSignup] = React.useState(false);
    const [signupSuccess, setSignupSuccess] = React.useState(false);
    const [signupForm, setSignupForm] = React.useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = React.useState(false);

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
    <div style={{
      minHeight: '100vh',
      background: darkMode
        ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
        : 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ef 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: darkMode ? '#fff' : '#222',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '0 16px',
      transition: 'background 0.5s',
    }}>
      {/* MMadTrack360 Logo */}
      {/* Theme Toggle */}
      <button
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          position: 'absolute',
          top: 24,
          right: 32,
          background: darkMode ? '#fff' : '#2563eb',
          color: darkMode ? '#2563eb' : '#fff',
          border: 'none',
          borderRadius: 20,
          padding: '8px 18px',
          fontWeight: 600,
          fontSize: 15,
          boxShadow: '0 2px 8px #1e3c72',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'background 0.2s, color 0.2s',
        }}
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div style={{ marginBottom: 24, animation: 'fadeInDown 0.8s' }}>
        <img src="/MMAD_App_logo.jpeg" alt="MMadTrack360 Logo" style={{ width: 120, marginBottom: 8, filter: 'drop-shadow(0 2px 8px #2563eb)' }} />
        <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 8, letterSpacing: 1, textShadow: '0 2px 8px #1e3c72' }}>MMadTrack360 SaaS Platform</h1>
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.10)',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(30,60,114,0.18)',
        padding: '32px 24px',
        minWidth: 320,
        maxWidth: 400,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeInUp 1s',
      }}>
        <h2 style={{ fontWeight: 600, fontSize: 24, marginBottom: 24 }}>Login</h2>
        <button className="login-btn admin" onClick={() => navigate('/admin-dashboard')}>
          <ShieldCheckIcon style={{ width: 24, height: 24 }} /> Admin Login
        </button>
        <button className="login-btn staff" onClick={() => navigate('/staff-dashboard')}>
          <UserIcon style={{ width: 24, height: 24 }} /> Staff Login
        </button>
        <button className="login-btn signup" onClick={() => setShowSignup(true)}>
          <UserPlusIcon style={{ width: 24, height: 24 }} /> Admin Signup
        </button>
          {/* Social Login Buttons - Accessibility Enhanced */}
          <div style={{ marginTop: 18, width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="login-btn social google" aria-label="Login with Google" onClick={() => alert('Google login coming soon!')}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" style={{ width: 22, height: 22, marginRight: 8 }} aria-hidden="true" />
              <span aria-label="Login with Google">Login with Google</span>
            </button>
            <button className="login-btn social microsoft" aria-label="Login with Microsoft" onClick={() => alert('Microsoft login coming soon!')}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" style={{ width: 22, height: 22, marginRight: 8 }} aria-hidden="true" />
              <span aria-label="Login with Microsoft">Login with Microsoft</span>
            </button>
          </div>
      </div>
      <div style={{ marginTop: 32, color: '#cbd5e1', fontSize: 16, textAlign: 'center', maxWidth: 400, animation: 'fadeIn 1.2s' }}>
        <p>Login as <b>Admin</b> or <b>Staff</b> to access your full-featured dashboard.<br />Signup to create a new admin account.</p>
      </div>
      {/* Admin Signup Modal */}
      {showSignup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,60,114,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, animation: 'fadeIn 0.5s' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(30,60,114,0.25)', padding: '40px 32px', minWidth: 340, maxWidth: 400, width: '100%', color: '#222', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', animation: 'fadeInUp 0.8s' }}>
            <button style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#1e3c72', cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setShowSignup(false)}>&times;</button>
            <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 18, color: '#1e3c72' }}>Admin Signup</h2>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0' }}>
                <div className="spinner" style={{ width: 48, height: 48, border: '6px solid #2563eb', borderTop: '6px solid #f59e42', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 16 }}></div>
                <span style={{ color: '#2563eb', fontWeight: 600, fontSize: 18 }}>Processing...</span>
              </div>
            ) : signupSuccess ? (
              <div style={{ color: '#10b981', fontWeight: 600, fontSize: 18, margin: '32px 0', animation: 'fadeIn 0.5s' }}>
                Signup successful! Welcome, {signupForm.name || 'Admin'}.
              </div>
            ) : (
              <form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleSignupSubmit}>
                <input type="text" name="name" placeholder="Full Name" value={signupForm.name} onChange={handleSignupChange} style={{ padding: '12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, marginBottom: 8, transition: 'border 0.2s' }} required />
                <input type="email" name="email" placeholder="Email Address" value={signupForm.email} onChange={handleSignupChange} style={{ padding: '12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, marginBottom: 8, transition: 'border 0.2s' }} required />
                <input type="password" name="password" placeholder="Password" value={signupForm.password} onChange={handleSignupChange} style={{ padding: '12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, marginBottom: 8, transition: 'border 0.2s' }} required />
                <button type="submit" className="login-btn admin" style={{ marginTop: 8 }}>Signup</button>
                {/* Error message for demo purposes */}
                {signupForm.email && !signupForm.email.includes('@') && (
                  <div style={{ color: '#f59e42', fontWeight: 500, fontSize: 15, marginTop: 8 }}>
                    Please enter a valid email address.
                  </div>
                )}
              </form>
            )}
            <div style={{ marginTop: 18, color: '#1e3c72', fontSize: 15, textAlign: 'center', animation: 'fadeIn 0.5s' }}>
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
          box-shadow: 0 2px 8px #1e3c72;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s, transform 0.2s;
        }
        .login-btn.admin { background: #2563eb; color: #fff; }
        .login-btn.staff { background: #10b981; color: #fff; }
        .login-btn.signup { background: #f59e42; color: #fff; }
        .login-btn:hover {
          transform: scale(1.04);
          filter: brightness(1.1);
        }
          .spinner {
            border: 6px solid #2563eb;
            border-top: 6px solid #f59e42;
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
      <div style={{ marginTop: 24, color: '#f59e42', fontSize: 15, textAlign: 'center', maxWidth: 400 }}>
        <b>Browser Debugging:</b> If you see a blank page, open your browser's DevTools (press <kbd>F12</kbd> or <kbd>Ctrl+Shift+I</kbd>) and check the Console for errors. <br />
        <a href="#" style={{ color: '#2563eb', textDecoration: 'underline' }} onClick={() => { window.open('about:blank', '_blank'); alert('Press F12 or Ctrl+Shift+I in the new tab to open DevTools.'); }}>Open DevTools Help</a>
      </div>
    </div>
  );
}

export default Login;
