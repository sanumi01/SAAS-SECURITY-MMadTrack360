import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminSignup from './pages/AdminSignup'
import AdminAccess from './pages/AdminAccess'
import StaffDashboard from './pages/StaffDashboard'
import StaffLocation from './pages/StaffLocation'
import StaffCheckin from './pages/StaffCheckin'
import StaffScan from './pages/StaffScan'
import StaffAlert from './pages/StaffAlert'

function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-slate-950">
      <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl w-full max-w-xl text-center">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-4">MMadTrack360 Security</h1>
        <p className="text-white/75 mb-8">Enterprise SaaS for staff management, location tracking, and security alerts.</p>
        <div className="flex flex-col gap-4">
          <a href="/login" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition">Staff/Admin Login</a>
          <a href="/admin-signup" className="w-full bg-slate-800 hover:bg-slate-700 text-blue-300 py-4 rounded-lg font-bold text-lg transition">Admin Signup</a>
        </div>
      </div>
      <div className="mt-8 text-white/70 text-sm text-center max-w-lg">
        <span>Competitive features: PWA, real-time updates, analytics, mobile support, and more.</span>
      </div>
    </div>
  )
}
export default function App() {
  const [user, setUser] = useState<{ id: string, role: 'admin' | 'staff' } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <span className="text-slate-200 text-xl">Loading app...</span>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin-signup" element={<AdminSignup onSignup={admin => setUser({ id: admin.username, role: 'admin' })} />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Landing />} />
        <Route path="/admin" element={
          user && user.role === 'admin' ? <AdminAccess /> : <Navigate to="/" />
        } />
        <Route path="/dashboard" element={
          user && user.role === 'staff' ? <StaffDashboard /> : <Navigate to="/" />
        } />
        <Route path="/location" element={
          user && user.role === 'staff' ? <StaffLocation /> : <Navigate to="/" />
        } />
        <Route path="/checkin" element={
          user && user.role === 'staff' ? <StaffCheckin /> : <Navigate to="/" />
        } />
        <Route path="/scan" element={
          user && user.role === 'staff' ? <StaffScan /> : <Navigate to="/" />
        } />
        <Route path="/alert" element={
          user && user.role === 'staff' ? <StaffAlert /> : <Navigate to="/" />
        } />
        {/* <Route path="/analytics" element={
          user ? <AnalyticsDashboard /> : <Navigate to="/" />
        } /> */}
      </Routes>
    </BrowserRouter>
  )
}
