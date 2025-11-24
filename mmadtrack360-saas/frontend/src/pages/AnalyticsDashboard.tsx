import { ChartBarIcon, UserGroupIcon, BellIcon, MapPinIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsDashboard() {
  // Mock data for preview
  const stats = [
    { name: 'Total Staff', value: 24, label: 'Active members', icon: <UserGroupIcon className="h-8 w-8 text-blue-400" /> },
    { name: 'On Duty', value: 18, label: 'Currently working', icon: <ChartBarIcon className="h-8 w-8 text-blue-400" /> },
    { name: 'Scheduled Today', value: 22, label: 'Shifts assigned', icon: <MapPinIcon className="h-8 w-8 text-blue-400" /> },
    { name: 'Alerts', value: 3, label: 'Pending notifications', icon: <BellIcon className="h-8 w-8 text-blue-400" /> },
  ];
  const activityData = [
    { day: 'Mon', staff: 20, alerts: 2 },
    { day: 'Tue', staff: 22, alerts: 1 },
    { day: 'Wed', staff: 19, alerts: 3 },
    { day: 'Thu', staff: 21, alerts: 2 },
    { day: 'Fri', staff: 23, alerts: 1 },
    { day: 'Sat', staff: 18, alerts: 0 },
    { day: 'Sun', staff: 17, alerts: 0 },
  ];
  const roleData = [
    { name: 'Security Guard', value: 12 },
    { name: 'Supervisor', value: 5 },
    { name: 'Manager', value: 3 },
    { name: 'Team Lead', value: 4 },
  ];
  const ROLE_COLORS = ['var(--primary-500)', 'var(--success-500)', 'var(--warning-500)', 'var(--error-500)'];

  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 min-h-screen flex">
      <Sidebar />
      <main className="main-content flex-1 ml-[280px] px-8 py-8">
        <div className="page-header mb-8">
          <h1 className="page-title text-3xl font-bold text-cyan-400 mb-2">Dashboard Overview</h1>
          <p className="page-subtitle text-slate-400 text-base">Welcome to your security management platform</p>
        </div>
        <div className="analytics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(stat => (
            <div key={stat.name} className="stat-card bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col items-center">
              <div className="mb-2">{stat.icon}</div>
              <div className="stat-label text-white/85 text-sm">{stat.name}</div>
              <div className="stat-value text-3xl font-bold text-cyan-400 my-2">{stat.value}</div>
              <div className="stat-label text-white/75 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="content-card bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8">
          <h3 className="text-cyan-400 text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="flex gap-4 flex-wrap">
            <button className="btn btn-primary bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-5 py-3 rounded-lg font-semibold shadow hover:-translate-y-1 hover:shadow-lg transition flex items-center gap-2">
              <UserGroupIcon className="h-5 w-5" /> Add Staff Member
            </button>
            <button className="btn btn-primary bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-5 py-3 rounded-lg font-semibold shadow hover:-translate-y-1 hover:shadow-lg transition flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5" /> View Schedule
            </button>
            <button className="btn btn-primary bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-5 py-3 rounded-lg font-semibold shadow hover:-translate-y-1 hover:shadow-lg transition flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" /> Track Locations
            </button>
            <button className="btn btn-secondary bg-slate-700 text-cyan-400 px-5 py-3 rounded-lg font-semibold shadow hover:bg-slate-600 transition flex items-center gap-2">
              <BellIcon className="h-5 w-5" /> View Reports
            </button>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl mt-8">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Weekly Staff Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', color: '#ffffff', borderRadius: '8px', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="staff" stroke="var(--primary-500)" name="Staff" strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="alerts" stroke="var(--error-500)" name="Alerts" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-blue-400 mb-2">Staff Role Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label isAnimationActive={true}>
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', color: '#ffffff', borderRadius: '8px', border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
