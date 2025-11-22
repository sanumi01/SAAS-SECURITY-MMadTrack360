import React from 'react';
import { MapIcon, CheckCircleIcon, QrCodeIcon, BellIcon } from '@heroicons/react/24/solid';
import StaffLocation from "../features/StaffLocation";
import StaffCheckin from "../features/StaffCheckin";
import StaffScan from "../features/StaffScan";
import StaffAlert from "../features/StaffAlert";

export default function StaffDashboard() {
  const features = [
    { title: "Live Location Tracking", icon: <MapIcon className="w-8 h-8 text-sky-600" />, component: <StaffLocation /> },
    { title: "Staff Check-In", icon: <CheckCircleIcon className="w-8 h-8 text-emerald-500" />, component: <StaffCheckin /> },
    { title: "Staff Scan", icon: <QrCodeIcon className="w-8 h-8 text-orange-500" />, component: <StaffScan /> },
    { title: "Staff Alerts", icon: <BellIcon className="w-8 h-8 text-red-500" />, component: <StaffAlert /> },
  ];

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Staff Management</h1>
        <p className="text-sm text-slate-200">Advanced staff management features coming soon.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {features.map((f) => (
          <div key={f.title} className="panel-bg rounded-2xl p-6 shadow-lg text-slate-800">
            <div className="flex items-center gap-3 mb-3">
              {f.icon}
              <h3 className="text-lg font-medium">{f.title}</h3>
            </div>
            <div>{f.component}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
