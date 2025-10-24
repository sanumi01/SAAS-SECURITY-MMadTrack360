import React from 'react'
import { Link } from 'react-router-dom'
import { useStaffStore } from '../store/staffStore'

export default function Dashboard() {
  const { staff } = useStaffStore()
  const onDutyCount = staff.filter(s => s.status === 'On Duty').length

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-2">Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-neutral-800 p-6 rounded-xl">
          <div className="text-4xl font-bold">{staff.length}</div>
          <div className="text-gray-400">Total Staff</div>
        </div>
        <div className="bg-neutral-800 p-6 rounded-xl">
          <div className="text-4xl font-bold">{onDutyCount}</div>
          <div className="text-gray-400">On Duty</div>
        </div>
      </div>
      <div className="mt-8">
        <Link to="/staff" className="bg-blue-600 text-white px-6 py-3 rounded-xl">View Staff</Link>
      </div>
    </div>
  )
}
