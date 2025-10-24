import React from 'react'
import { useRealtime } from '../hooks/useRealtime'
import { useAnalytics } from '../hooks/useAnalytics'
import { useMobileMenu } from '../hooks/useMobileMenu'

export default function StaffDashboard() {
  // Real-time data (replace with your WebSocket URL)
  const data = useRealtime('wss://echo.websocket.org')
  useAnalytics('dashboard_viewed', { time: Date.now() })
  if (data) {
    useAnalytics('dashboard_realtime_update', { data, timestamp: Date.now() })
  }
  const { open, toggle, close } = useMobileMenu()

  // Push notification registration
  const registerPush = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('MMadTrack360: You are now subscribed to alerts!', {
            body: 'You will receive staff security notifications.',
            icon: '/icon-192.png',
            tag: 'mmadtrack360-alert',
          })
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile menu */}
      <nav className="md:hidden bg-blue-900 p-4 flex justify-between items-center">
        <span className="text-white font-bold text-lg">MMadTrack360</span>
        <button onClick={toggle} className="text-white">☰</button>
      </nav>
      {open && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <button onClick={close} className="absolute top-4 right-4 text-white text-2xl">×</button>
          <a href="/location" className="text-blue-400 text-xl mb-4">Location</a>
          <a href="/checkin" className="text-blue-400 text-xl mb-4">Check-In</a>
          <a href="/scan" className="text-blue-400 text-xl mb-4">Scan</a>
          <a href="/alert" className="text-blue-400 text-xl mb-4">Alert</a>
        </div>
      )}
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">Staff Dashboard</h1>
        <div className="bg-slate-900 p-6 rounded-xl shadow-xl">
          <ul className="space-y-4">
            <li><a href="/location" className="text-blue-300 hover:underline">Location Tracking</a></li>
            <li><a href="/checkin" className="text-blue-300 hover:underline">Check-In</a></li>
            <li><a href="/scan" className="text-blue-300 hover:underline">Scan & Send Info</a></li>
            <li><a href="/alert" className="text-blue-300 hover:underline">Send Alert</a></li>
          </ul>
          <div className="mt-8">
            <h2 className="text-lg text-slate-200 mb-2">Real-Time Updates</h2>
            <div className="bg-slate-800 p-4 rounded text-slate-300 text-sm">
              {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Waiting for real-time data...'}
              <div className="mt-2 text-xs text-slate-400">Tip: Real-time data is updated automatically. Check for new alerts and status changes here.</div>
            </div>
            <button
              onClick={() => {
                registerPush()
                useAnalytics('push_subscribed', { time: Date.now() })
              }}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Enable Push Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
