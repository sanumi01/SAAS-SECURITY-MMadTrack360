import { BellIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { useAnalytics } from '../hooks/useAnalytics'

export default function StaffAlert() {
  const [alertSent, setAlertSent] = useState(false)
  const [alertData, setAlertData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  useAnalytics('alert_viewed', { time: Date.now() })

  useEffect(() => {
    setLoading(true)
    fetch('/api/alert/live')
      .then(res => res.json())
      .then(data => {
        setAlertData(data.alertData)
        setLoading(false)
        useAnalytics('alert_updated', { staffId: data.staffId, timestamp: Date.now() })
      })
      .catch(() => setLoading(false))
  }, [filter])

  // Example alert type data for chart
  const alertTypesRaw = [
    { type: 'Fire', count: 2, severity: 5 },
    { type: 'Medical', count: 3, severity: 3 },
    { type: 'Security', count: 1, severity: 4 },
    { type: 'Other', count: 2, severity: 2 },
  ]
  const alertTypes = filter ? alertTypesRaw.filter(a => a.type === filter) : alertTypesRaw

  // Stat cards mockup
  const statCards = [
    { label: 'Total Alerts', value: alertTypesRaw.reduce((a, b) => a + b.count, 0), icon: <BellIcon className="h-7 w-7 text-blue-400" /> },
    { label: 'Most Severe', value: alertTypesRaw.reduce((max, cur) => cur.severity > max.severity ? cur : max, alertTypesRaw[0]).type, icon: <MapPinIcon className="h-7 w-7 text-rose-400" /> },
    { label: 'Last Alert', value: alertTypesRaw[alertTypesRaw.length - 1].type, icon: <UserGroupIcon className="h-7 w-7 text-indigo-400" /> },
  ];

  const registerPush = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('MMadTrack360: Alert notifications enabled!', {
            body: 'You will receive staff alert notifications.',
            icon: '/icon-192.png',
            tag: 'mmadtrack360-alert',
          })
        })
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
      {/* Animated gradient border */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 opacity-30 blur-3xl animate-pulse" />
      </div>
      <div className="relative z-10 w-full max-w-2xl p-10 bg-white/10 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl flex flex-col gap-8 animate-fade-in">
        <nav className="flex items-center justify-between mb-6 px-2 py-3 bg-slate-900 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <BellIcon className="h-7 w-7 text-blue-400" aria-hidden="true" />
            <span className="text-xl font-bold text-blue-400">Staff Alert</span>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-1 text-slate-300 hover:text-blue-400 transition-colors">
              <UserGroupIcon className="h-5 w-5" aria-hidden="true" /> Staff
            </button>
            <button className="flex items-center gap-1 text-slate-300 hover:text-blue-400 transition-colors">
              <MapPinIcon className="h-5 w-5" aria-hidden="true" /> Location
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
          <p>Alert status and updates will appear here.</p>
          <div className="mt-4 bg-slate-800 p-4 rounded text-slate-300 text-sm min-h-[60px] flex items-center justify-center">
            {loading ? (
              <span className="animate-spin mr-2">🔄</span>
            ) : alertData ? (
              <pre>{JSON.stringify(alertData, null, 2)}</pre>
            ) : (
              'No live alert data available.'
            )}
          </div>
          <div className="bg-slate-800 p-4 rounded mt-6">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Alert Types & Severity</h2>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={alertTypes} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" stroke="#60A5FA" />
                <YAxis stroke="#60A5FA" />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', color: '#EF4444', borderRadius: '8px', border: 'none' }} />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Count" onClick={data => setFilter(data.type)} isAnimationActive={true} />
                <Line type="monotone" dataKey="severity" stroke="#EF4444" name="Severity" />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-2 flex gap-2 flex-wrap">
              <span className="text-xs text-slate-400">Filter by type:</span>
              {alertTypesRaw.map(a => (
                <button
                  key={a.type}
                  className={`px-2 py-1 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === a.type ? 'bg-blue-600 text-white' : 'bg-slate-700 text-blue-300 hover:bg-blue-500 hover:text-white'}`}
                  onClick={() => setFilter(a.type)}
                  aria-pressed={filter === a.type ? true : false}
                >
                  {a.type}
                </button>
              ))}
              {filter && (
                <button className="px-2 py-1 rounded bg-rose-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-400" onClick={() => setFilter('')}>Clear</button>
              )}
            </div>
            <div className="mt-4 text-xs text-blue-400 animate-fade-in">Tip: Click on a type in the chart or use the filter buttons to view specific alert types. Live data is fetched from the backend API.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
