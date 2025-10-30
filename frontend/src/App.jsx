import { Routes, Route } from "react-router-dom";
import LoginButton from "./components/LoginButton";
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import MMadTrack360Logo from "./components/MMadTrack360Logo";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import PlatformPreview from "./pages/PlatformPreview";

function App() {
  return (
    <main style={{
      minHeight: '100vh',
      minWidth: '100vw',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#fff',
      position: 'relative',
      boxSizing: 'border-box',
      width: '100vw',
      height: '100vh',
      overflow: 'auto'
    }}>
      <MMadTrack360Logo style={{ width: 120, marginBottom: 32 }} />
      <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>MMadTrack360 SaaS Platform</h1>
      <Routes>
        <Route path="/" element={<LoginButton />} />
        <Route path="/login" element={<Login onLogin={() => {}} />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<div style={{fontSize:24, fontWeight:600}}>Dashboard Preview: All features loaded!</div>} />
        <Route path="/preview" element={<PlatformPreview />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/admin-signup" element={<div style={{background:'#fff',color:'#1e3c72',padding:32,borderRadius:16,maxWidth:500,margin:'40px auto'}}><h2 style={{fontWeight:700,fontSize:28,marginBottom:16}}>Admin Signup</h2><p style={{fontSize:18,marginBottom:24}}>Signup form coming soon. All admin features will be available after signup.</p></div>} />
      </Routes>
    </main>
  );
}

export default App;
