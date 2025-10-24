import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginButton from "./components/LoginButton";
import Callback from "./pages/Callback";
import MMadTrack360Logo from "./components/MMadTrack360Logo";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";

function App() {
  return (
    <Router>
      <main style={{
        height: '100vh',
        margin: 0,
        padding: 0,
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Segoe UI, sans-serif',
        color: '#fff',
        position: 'relative'
      }}>
        <MMadTrack360Logo style={{ width: 120, marginBottom: 32 }} />
        <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>MMadTrack360 SaaS Platform</h1>
        <Routes>
          <Route path="/" element={<LoginButton />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/dashboard" element={<div style={{fontSize:24, fontWeight:600}}>Dashboard Preview: All features loaded!</div>} />
          <Route path="/preview" element={<PlatformPreview />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/staff" element={<StaffDashboard />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
