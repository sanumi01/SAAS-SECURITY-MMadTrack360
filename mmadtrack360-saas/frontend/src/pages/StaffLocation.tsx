import { MapPinIcon, UserGroupIcon, BellIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function StaffLocation() {
  // Mock data for preview
  const [selectedArea, setSelectedArea] = useState('');
  const locationEvents = [
    { area: 'Lobby', events: 7 },
    { area: 'Office', events: 12 },
    { area: 'Warehouse', events: 5 },
    { area: 'Parking', events: 3 },
    { area: 'Conference', events: 9 },
    { area: 'Cafeteria', events: 4 },
    { area: 'Reception', events: 6 },
  ];
  const filteredEvents = selectedArea ? locationEvents.filter(e => e.area === selectedArea) : locationEvents;

  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 min-h-screen flex">
      <Sidebar />
      <main className="main-content flex-1 ml-[280px] px-8 py-8">
        <div className="page-header mb-8">
          <h1 className="page-title text-3xl font-bold text-cyan-400 mb-2">Live Location Tracking</h1>
          <p className="page-subtitle text-white/70 text-base">Real-time staff location monitoring</p>
        </div>
        <div className="analytics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="stat-card bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col items-center">
            <MapPinIcon className="h-8 w-8 text-blue-400 mb-2" />
            <div className="stat-label text-white/70 text-sm">Online Staff</div>
            <div className="stat-value text-3xl font-bold text-cyan-400 my-2">18</div>
            <div className="stat-label text-white/70 text-xs">Currently tracking</div>
          </div>
          <div className="stat-card bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-400 mb-2" />
            <div className="stat-label text-white/70 text-sm">Geofences</div>
            <div className="stat-value text-3xl font-bold text-cyan-400 my-2">5</div>
            <div className="stat-label text-white/70 text-xs">Active zones</div>
          </div>
        </div>
        <div className="content-card bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8">
          <h3 className="text-cyan-400 text-xl font-semibold mb-4">Location Events by Area</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={filteredEvents} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" stroke="var(--primary-200)" />
              <YAxis stroke="var(--primary-200)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--panel-dark)', color: 'var(--primary-200)', borderRadius: '8px', border: 'none' }} />
              <Legend />
              <Bar dataKey="events" fill="var(--primary-500)" name="Events" isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-2 flex-wrap">
            <span className="text-xs text-white/70">Filter by area:</span>
            {locationEvents.map(e => (
              <button
                key={e.area}
                className={`px-2 py-1 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${selectedArea === e.area ? 'bg-blue-600 text-white' : 'bg-slate-700 text-blue-300 hover:bg-blue-500 hover:text-white'}`}
                onClick={() => setSelectedArea(e.area)}
                aria-pressed={selectedArea === e.area}
              >
                {e.area}
              </button>
            ))}
            {selectedArea && (
              <button className="px-2 py-1 rounded bg-rose-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-400" onClick={() => setSelectedArea('')}>Clear</button>
            )}
          </div>
          <div className="mt-4 text-xs text-blue-400 animate-fade-in">Tip: Click on an area in the chart or use the filter buttons to view specific location events.</div>
        </div>
      </main>
    </div>
  );
}

