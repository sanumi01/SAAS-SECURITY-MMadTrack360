import React from 'react';
import { BellIcon } from '@heroicons/react/24/solid';

export default function Notifications() {
  const notifications = [
    { id: 1, title: 'New incident reported', time: '2m ago', severity: 'high' },
    { id: 2, title: 'QR Scan completed by Mike Davis', time: '8m ago', severity: 'info' },
    { id: 3, title: 'Emergency drill completed', time: '12m ago', severity: 'info' },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BellIcon className="w-7 h-7 text-slate-700" />
          <h1 className="text-2xl font-semibold">Notifications</h1>
        </div>
        <div>
          <button className="px-3 py-2 bg-white rounded shadow text-sm">Mark all read</button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className="p-3 bg-white rounded shadow-sm flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold">{n.title.charAt(0)}</div>
            <div>
              <div className="font-medium">{n.title}</div>
              <div className="text-xs text-slate-500">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
