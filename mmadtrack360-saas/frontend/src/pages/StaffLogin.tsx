import React, { useState } from 'react'

interface StaffLoginProps {
  onLogin: (staffId: string) => void
}

export default function StaffLogin({ onLogin }: StaffLoginProps) {
  const [staffId, setStaffId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffId) {
      setError('Staff ID is required')
      return
    }
    // TODO: Validate staffId with backend/API
    onLogin(staffId)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-200 mb-6 text-center">Staff Login</h1>
        <input
          type="text"
          placeholder="Enter Staff ID"
          value={staffId}
          onChange={e => { setStaffId(e.target.value); setError('') }}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 mb-4"
        />
        {error && <div className="text-rose-600 mb-4 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">Login</button>
      </form>
      <div className="mt-8 text-slate-400 text-sm text-center">
        Access restricted to authorized staff only. Please contact your admin for access.
      </div>
    </div>
  )
}
