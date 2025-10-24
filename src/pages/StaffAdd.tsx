import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStaffStore } from '../store/staffStore'

export default function StaffAdd() {
  const navigate = useNavigate()
  const { addStaff } = useStaffStore()
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', role: '', department: '', status: 'Off Duty' as const
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addStaff(formData)
    alert('Staff added!')
    navigate('/staff')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Add Staff Member</h1>
      <form onSubmit={handleSubmit} className="bg-neutral-800 rounded-xl p-8 max-w-2xl">
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Name" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 rounded-xl"
            required
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 rounded-xl"
            required
          />
          <input 
            type="tel" 
            placeholder="Phone" 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 rounded-xl"
            required
          />
          <input 
            type="text" 
            placeholder="Role" 
            value={formData.role}
            onChange={e => setFormData({...formData, role: e.target.value})}
            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 rounded-xl"
          />
          <input 
            type="text" 
            placeholder="Department" 
            value={formData.department}
            onChange={e => setFormData({...formData, department: e.target.value})}
            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 rounded-xl"
          />
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl">Save Staff</button>
        </div>
      </form>
    </div>
  )
}
