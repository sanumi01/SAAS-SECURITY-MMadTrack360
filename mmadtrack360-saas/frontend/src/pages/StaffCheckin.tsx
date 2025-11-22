import React, { useState, useEffect } from 'react'
import { CheckCircleIcon, UserGroupIcon, MapPinIcon, BellIcon } from '@heroicons/react/24/solid';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAnalytics } from '../hooks/useAnalytics'

export default function StaffCheckin() {
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkinData, setCheckinData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  useAnalytics('checkin_viewed', { time: Date.now() })

  useEffect(() => {
    setLoading(true)
    fetch('/api/checkin/live')
      .then(res => res.json())
      .then(data => {
        setCheckinData(data)
        setLoading(false)
        useAnalytics('checkin_updated', { staffId: data.staffId, timestamp: Date.now() })
      })
      .catch(() => setLoading(false))
  }, [filter])
  const registerPush = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('MMadTrack360: Check-in alerts enabled!', {
            body: 'You will receive check-in notifications.',
            icon: '/icon-192.png',
            tag: 'mmadtrack360-checkin',
          })
        })
      }
    }
  }

  // Example check-in status data for chart
  const checkinStatusRaw = [
    { name: 'Checked In', value: checkedIn ? 1 : 0 },
    { name: 'Not Checked In', value: checkedIn ? 0 : 1 },
  ]
  const COLORS = ['var(--success)', 'var(--warning)']
  const checkinStatus = filter ? checkinStatusRaw.filter(s => s.name === filter) : checkinStatusRaw

  // Stat cards mockup
  const statCards = [
    { label: 'Total Staff', value: 24, icon: <UserGroupIcon className="h-7 w-7 text-blue-400" /> },
    { label: 'Checked In', value: checkedIn ? 1 : 0, icon: <CheckCircleIcon className="h-7 w-7 text-emerald-400" /> },
    { label: 'Not Checked In', value: checkedIn ? 0 : 1, icon: <MapPinIcon className="h-7 w-7 text-orange-400" /> },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
      {/* Animated gradient border */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 opacity-30 blur-3xl animate-pulse" />
      </div>
      <div className="relative z-10 w-full max-w-2xl p-10 bg-white/10 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl flex flex-col gap-8 animate-fade-in">
        <nav className="flex items-center justify-between mb-6 px-2 py-3 bg-slate-900 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-7 w-7 text-emerald-400" aria-hidden="true" />
            <span className="text-xl font-bold text-emerald-400">Staff Check-In</span>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors">
              <UserGroupIcon className="h-5 w-5" aria-hidden="true" /> Staff
            </button>
            <button className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors">
              <MapPinIcon className="h-5 w-5" aria-hidden="true" /> Location
            </button>
            <button className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors">
              <BellIcon className="h-5 w-5" aria-hidden="true" /> Alerts
            </button>
          </div>
        </nav>
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {statCards.map(card => (
            <div key={card.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center shadow">
              {card.icon}
              <div className="text-slate-400 text-xs mt-2">{card.label}</div>
              <div className="text-2xl font-bold text-cyan-400 my-1">{card.value}</div>
            </div>
          ))}
        </div>
        <div className="bg-slate-900 p-6 rounded-xl">
          <button
            className={`bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${checkedIn ? 'opacity-50' : ''}`}
            onClick={() => setCheckedIn(true)}
            disabled={checkedIn}
          >
            {checkedIn ? 'Checked In' : 'Check In Now'}
          </button>
          {checkedIn && <div className="mt-4 text-emerald-500">You are checked in!</div>}
          <p className="mt-4">Check-in status and updates will appear here.</p>
          <div className="mt-4 bg-slate-800 p-4 rounded text-slate-300 text-sm min-h-[60px] flex items-center justify-center">
            {loading ? (
              <span className="animate-spin mr-2">🔄</span>
            ) : checkinData ? (
              <pre>{JSON.stringify(checkinData, null, 2)}</pre>
            ) : (
              'No live check-in data available.'
            )}
          </div>
          <div className="bg-slate-800 p-4 rounded mt-6">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Check-In Status</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={checkinStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label isAnimationActive={true} onClick={data => setFilter(data.name)}>
                  {checkinStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--panel-dark)', color: 'var(--success)', borderRadius: '8px', border: 'none' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex gap-2 flex-wrap">
              <span className="text-xs text-slate-400">Filter by status:</span>
              {checkinStatusRaw.map(s => (
                <button
                  key={s.name}
                  className={`px-2 py-1 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${filter === s.name ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-emerald-300 hover:bg-emerald-500 hover:text-white'}`}
                  onClick={() => setFilter(s.name)}
                  aria-pressed={filter === s.name ? true : false}
                >
                  {s.name}
                </button>
              ))}
              {filter && (
                <button className="px-2 py-1 rounded bg-rose-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-400" onClick={() => setFilter('')}>Clear</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
