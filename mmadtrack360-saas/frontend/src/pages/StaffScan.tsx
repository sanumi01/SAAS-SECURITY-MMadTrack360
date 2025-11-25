import { QrCodeIcon, UserGroupIcon, MapPinIcon, BellIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import { useAnalytics } from '../hooks/useAnalytics'

export default function StaffScan() {
  const [scanResult, setScanResult] = useState('')
  const [scanData, setScanData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  useAnalytics('scan_viewed', { time: Date.now() })

  useEffect(() => {
    setLoading(true)
    fetch('/api/scan/live')
      .then(res => res.json())
      .then(data => {
        setScanData(data.scanData)
        setLoading(false)
        useAnalytics('scan_updated', { staffId: data.staffId, timestamp: Date.now() })
      })
      .catch(() => setLoading(false))
  }, [filter])

  // Example scan volume data for chart
  const scanVolumeRaw = [
    { hour: '08:00', scans: 2 },
    { hour: '09:00', scans: 5 },
    { hour: '10:00', scans: 8 },
    { hour: '11:00', scans: 4 },
    { hour: '12:00', scans: 7 },
    { hour: '13:00', scans: 3 },
    { hour: '14:00', scans: 6 },
  ]
  const scanVolume = filter ? scanVolumeRaw.filter(s => s.hour === filter) : scanVolumeRaw

  // Stat cards mockup
  const statCards = [
    { label: 'Total Scans', value: scanVolumeRaw.reduce((a, b) => a + b.scans, 0), icon: <QrCodeIcon className="h-7 w-7 text-blue-400" /> },
    { label: 'Peak Hour', value: scanVolumeRaw.reduce((max, cur) => cur.scans > max.scans ? cur : max, scanVolumeRaw[0]).hour, icon: <MapPinIcon className="h-7 w-7 text-cyan-400" /> },
    { label: 'Last Scan', value: scanVolumeRaw[scanVolumeRaw.length - 1].hour, icon: <BellIcon className="h-7 w-7 text-indigo-400" /> },
  ];

  const registerPush = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('MMadTrack360: Scan alerts enabled!', {
            body: 'You will receive scan notifications.',
            icon: '/icon-192.png',
            tag: 'mmadtrack360-scan',
          })
        })
      }
    }
  }

  // TODO: Integrate with QR/barcode scanner
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
      {/* Animated gradient border */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 opacity-30 blur-3xl animate-pulse" />
      </div>
          <div className="relative z-10 w-full max-w-2xl p-10 bg-white/10 backdrop-blur-sm border border-slate-700 shadow-2xl rounded-2xl flex flex-col gap-8 animate-fade-in">
        <nav className="flex items-center justify-between mb-6 px-2 py-3 bg-slate-900 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <QrCodeIcon className="h-7 w-7 text-blue-400" aria-hidden="true" />
            <span className="text-xl font-bold text-blue-400">Staff Scan</span>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-1 text-white/75 hover:text-blue-400 transition-colors">
              <UserGroupIcon className="h-5 w-5" aria-hidden="true" /> Staff
            </button>
            <button className="flex items-center gap-1 text-white/75 hover:text-blue-400 transition-colors">
              <MapPinIcon className="h-5 w-5" aria-hidden="true" /> Location
            </button>
            <button className="flex items-center gap-1 text-white/75 hover:text-blue-400 transition-colors">
              <BellIcon className="h-5 w-5" aria-hidden="true" /> Alerts
            </button>
          </div>
        </nav>
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {statCards.map(card => (
            <div key={card.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center shadow">
              {card.icon}
              <div className="text-white/70 text-xs mt-2">{card.label}</div>
              <div className="text-2xl font-bold text-cyan-400 my-1">{card.value}</div>
            </div>
          ))}
        </div>
        <div className="bg-slate-900 p-6 rounded-xl">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            onClick={() => setScanResult('Sample scan data sent!')}
          >
            Scan & Send
          </button>
          {scanResult && <div className="mt-4 text-blue-500">{scanResult}</div>}
          <p>Scan results and updates will appear here.</p>
          <div className="mt-4 bg-slate-800 p-4 rounded text-white/75 text-sm min-h-[60px] flex items-center justify-center">
            {loading ? (
              <span className="animate-spin mr-2">🔄</span>
            ) : scanData ? (
              <pre>{JSON.stringify(scanData, null, 2)}</pre>
            ) : (
              'No live scan data available.'
            )}
          </div>
          <div className="bg-slate-800 p-4 rounded mt-6">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Scan Volume by Hour</h2>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={scanVolume} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" stroke="var(--primary-200)" />
                <YAxis stroke="var(--primary-200)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--panel-dark)', color: 'var(--primary-500)', borderRadius: '8px', border: 'none' }} />
                <Legend />
                 <Area
                   type="monotone"
                   dataKey="scans"
                   stroke="var(--primary-500)"
                   fill="var(--primary-200)"
                   name="Scans"
                   isAnimationActive={true}
                   activeDot={{ r: 8, fill: 'var(--primary-500)', stroke: '#fff', strokeWidth: 2 }}
                 />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-2 flex gap-2 flex-wrap">
              <span className="text-xs text-white/70">Filter by hour:</span>
              {scanVolumeRaw.map(s => (
                <button
                  key={s.hour}
                  className={`px-2 py-1 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${filter === s.hour ? 'bg-blue-600 text-white' : 'bg-slate-700 text-blue-300 hover:bg-blue-500 hover:text-white'}`}
                  onClick={() => setFilter(s.hour)}
                  aria-pressed={filter === s.hour}
                >
                  {s.hour}
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
