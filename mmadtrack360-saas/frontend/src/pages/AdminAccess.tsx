import React, { useState } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'
import { useRealtime } from '../hooks/useRealtime'

interface Staff {
  id: string
  name: string
  email: string
  role: string
  active: boolean
}

export default function AdminAccess() {
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [form, setForm] = useState({ name: '', email: '', role: '' })
  const [message, setMessage] = useState('')
  useAnalytics('admin_access_viewed', { time: Date.now() })
  const staffUpdates = useRealtime('wss://echo.websocket.org')

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.role) {
      setMessage('All fields required')
      return
    }
    const newStaff: Staff = {
      id: 'STAFF-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      name: form.name,
      email: form.email,
      role: form.role,
      active: true,
    }
    setStaffList([...staffList, newStaff])
    setForm({ name: '', email: '', role: '' })
    setMessage('Staff added and access granted!')
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-slate-200 mb-8">Admin: Staff Access Management</h1>
      <form onSubmit={handleAddStaff} className="bg-slate-900 p-6 rounded-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-4 py-3 rounded bg-slate-800 text-slate-200 border border-slate-700" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="px-4 py-3 rounded bg-slate-800 text-slate-200 border border-slate-700" />
          <input type="text" placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="px-4 py-3 rounded bg-slate-800 text-slate-200 border border-slate-700" />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">Grant Access</button>
        {message && <div className="mt-4 text-emerald-500">{message}</div>}
      </form>
      <div className="bg-slate-900 p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Staff List</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left py-2 text-blue-500">Staff ID</th>
              <th className="text-left py-2 text-blue-500">Name</th>
              <th className="text-left py-2 text-blue-500">Email</th>
              <th className="text-left py-2 text-blue-500">Role</th>
              <th className="text-left py-2 text-blue-500">Active</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map(staff => (
              <tr key={staff.id} className="border-b border-slate-800">
                <td className="py-2">{staff.id}</td>
                <td className="py-2">{staff.name}</td>
                <td className="py-2">{staff.email}</td>
                <td className="py-2">{staff.role}</td>
                <td className="py-2">{staff.active ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 bg-slate-800 p-4 rounded text-slate-300 text-sm">
        <strong>Real-Time Staff Updates:</strong>
        <div className="mt-2">
          {staffUpdates ? <pre>{JSON.stringify(staffUpdates, null, 2)}</pre> : 'Waiting for staff updates...'}
        </div>
      </div>
    </div>
  )
}
