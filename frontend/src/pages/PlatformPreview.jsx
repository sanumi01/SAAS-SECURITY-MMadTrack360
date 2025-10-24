import React from "react";
import MMadTrack360Logo from "../components/MMadTrack360Logo";

const PlatformPreview = () => (
  <div style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    color: "#fff",
    fontFamily: "Segoe UI, sans-serif"
  }}>
    <MMadTrack360Logo style={{ width: 120, marginTop: 32, marginBottom: 16 }} />
    <h2 style={{ fontWeight: 700, fontSize: 28 }}>MMadTrack360 Platform Preview</h2>
    <div style={{ marginTop: 32, fontSize: 20 }}>
      <ul style={{ textAlign: "left", maxWidth: 600 }}>
        <li>Admin Dashboard: Full access to analytics, staff management, settings, and communication tools.</li>
        <li>Staff Dashboard: Check-in, location tracking, scheduling, alerts, and more.</li>
        <li>Authentication: Secure login and signup for both admin and staff roles.</li>
        <li>API Integrations: All backend Lambda functions connected and ready.</li>
        <li>JWT Authorization: Role-based access control for all endpoints.</li>
        <li>Modern UI/UX: Professional branding and responsive design.</li>
      </ul>
      <div style={{ marginTop: 32, fontWeight: 600, fontSize: 22 }}>
        All platform features are loaded and ready for preview.
      </div>
    </div>
  </div>
);

export default PlatformPreview;
