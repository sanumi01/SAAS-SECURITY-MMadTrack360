import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useState as useToastState } from 'react'

export default function AdminSignup({ onSignup }: { onSignup: (admin: { username: string, password: string }) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useToastState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Username and password required')
      return
    }
    try {
      const res = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Signup failed')
        return
      }
  setToast('Signup successful!')
  setTimeout(() => setToast(''), 2000)
  onSignup({ username, password })
    } catch (err) {
  setError('Network error')
  setToast('Network error!')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-200 mb-6 text-center">Admin Signup</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => { setUsername(e.target.value); setError('') }}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 mb-4"
        />
        {error && <div className="text-rose-600 mb-4 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">Sign Up</button>
      </form>
  {toast && <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">{toast}</div>}
  <div className="mt-8 text-slate-400 text-sm text-center">
        Already have an account? <Link to="/login" className="text-blue-400 underline">Go to Login</Link>.
      </div>
    </div>
  )
}
