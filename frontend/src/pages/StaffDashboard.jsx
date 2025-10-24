import React from "react";
import MMadTrack360Logo from "../components/MMadTrack360Logo";

const StaffDashboard = () => (
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
    <h2 style={{ fontWeight: 700, fontSize: 28 }}>Staff Dashboard</h2>
    <div style={{ marginTop: 32, fontSize: 20 }}>
      {/* Staff dashboard content goes here */}
      Welcome, Staff! Your tools and features are here.
    </div>
  </div>
);

export default StaffDashboard;
