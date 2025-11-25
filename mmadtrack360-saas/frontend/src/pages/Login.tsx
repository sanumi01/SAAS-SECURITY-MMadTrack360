import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useState as useToastState } from 'react'

export default function Login({ onLogin }: { onLogin: (user: { id: string, role: 'admin' | 'staff' }) => void }) {
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState<'admin' | 'staff'>('staff')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useToastState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      setError('User ID is required')
      return
    }
    if (role === 'admin') {
      if (!password) {
        setError('Password is required for admin login')
        return
      }
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: userId, password })
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Login failed. Please check your credentials and try again.')
          return
        }
  setToast('Login successful!')
  setTimeout(() => setToast(''), 2000)
  onLogin({ id: userId, role })
    } catch {
  setError('Network error. Please try again later.')
  setToast('Network error!')
    }
    } else {
      // Staff login: just pass to parent (replace with real API in production)
  setToast('Login successful!')
  setTimeout(() => setToast(''), 2000)
  onLogin({ id: userId, role })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
      {/* Animated gradient border */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 opacity-30 blur-3xl animate-pulse" />
      </div>
      <form onSubmit={handleSubmit} className="relative z-10 bg-white/6 backdrop-blur-sm border border-slate-700 shadow-2xl rounded-2xl w-full max-w-md p-10 flex flex-col gap-4 animate-fade-in">
        <div className="flex flex-col items-center mb-4">
          <span className="flex items-center gap-2 text-cyan-400 font-bold text-2xl mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5A2.25 2.25 0 005.25 6.75h13.5A2.25 2.25 0 0021 4.5V3M3 3h18M3 3v18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 21V3" />
            </svg>
            MMadTrack360
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-cyan-300 mb-4 text-center drop-shadow-lg tracking-tight">Login</h1>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={e => { setUserId(e.target.value); setError('') }}
          className="w-full px-4 py-3 rounded-lg bg-slate-900/80 text-slate-100 border border-slate-700 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition mb-2 placeholder:text-slate-500"
        />
        <label htmlFor="role" className="text-slate-300 mb-1 block font-medium">Role</label>
        <select
          id="role"
          value={role}
          onChange={e => setRole(e.target.value as 'admin' | 'staff')}
          className="w-full px-4 py-3 rounded-lg bg-slate-900/80 text-slate-100 border border-slate-700 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition mb-2"
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        {role === 'admin' && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/80 text-slate-100 border border-slate-700 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition mb-2 placeholder:text-slate-500"
          />
        )}
        {error && <div className="text-rose-500 mb-2 text-sm font-medium text-center animate-shake">{error}</div>}
        <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-700 text-white py-3 rounded-lg font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2">Login</button>
      </form>
      {toast && <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">{toast}</div>}
      <div className="mt-8 text-slate-200 text-sm text-center drop-shadow-lg">
        Access restricted to authorized users only. Please contact your admin for access.<br />
        <Link to="/admin-signup" className="text-cyan-300 underline hover:text-cyan-200 transition">Admin? Create an account</Link>
      </div>
    </div>
  )
}
