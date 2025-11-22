import React from "react";
import MMadTrack360Logo from "../components/MMadTrack360Logo";

const PlatformPreview = () => (
  <div className="app-main-bg min-h-screen flex flex-col items-center justify-start text-white" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
    <MMadTrack360Logo className="w-30 mt-8 mb-4" style={{ width: 120 }} />
    <h2 className="font-bold text-2xl">MMadTrack360 Platform Preview</h2>
    <div className="mt-8 text-lg">
      <ul className="text-left max-w-xl">
        <li>Admin Dashboard: Full access to analytics, staff management, settings, and communication tools.</li>
        <li>Staff Dashboard: Check-in, location tracking, scheduling, alerts, and more.</li>
        <li>Authentication: Secure login and signup for both admin and staff roles.</li>
        <li>API Integrations: All backend Lambda functions connected and ready.</li>
        <li>JWT Authorization: Role-based access control for all endpoints.</li>
        <li>Modern UI/UX: Professional branding and responsive design.</li>
      </ul>
      <div className="mt-8 font-semibold text-xl">All platform features are loaded and ready for preview.</div>
    </div>
  </div>
);

export default PlatformPreview;
