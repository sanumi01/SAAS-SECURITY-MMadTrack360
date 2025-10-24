import React from 'react'
import { Link } from 'react-router-dom'
import { useStaffStore } from '../store/staffStore'

export default function StaffList() {
  const { staff, deleteStaff } = useStaffStore()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Staff Management</h1>
        <Link to="/staff/add" className="bg-blue-600 text-white px-6 py-3 rounded-xl">Add Staff</Link>
      </div>
      <div className="bg-neutral-800 rounded-xl p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="text-left py-3 text-blue-500">Name</th>
              <th className="text-left py-3 text-blue-500">Email</th>
              <th className="text-left py-3 text-blue-500">Role</th>
              <th className="text-left py-3 text-blue-500">Status</th>
              <th className="text-left py-3 text-blue-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(member => (
              <tr key={member.id} className="border-b border-neutral-700">
                <td className="py-3">{member.name}</td>
                <td className="py-3 text-gray-400">{member.email}</td>
                <td className="py-3">{member.role}</td>
                <td className="py-3">{member.status}</td>
                <td className="py-3">
                  <button onClick={() => deleteStaff(member.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
