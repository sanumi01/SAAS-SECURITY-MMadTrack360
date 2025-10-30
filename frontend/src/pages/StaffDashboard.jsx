
import Sidebar from "../components/Sidebar";
import { MapIcon, CheckCircleIcon, QrCodeIcon, BellIcon } from '@heroicons/react/24/solid';
import StaffLocation from "../features/StaffLocation";
import StaffCheckin from "../features/StaffCheckin";
import StaffScan from "../features/StaffScan";
import StaffAlert from "../features/StaffAlert";

// Temporary stub for missing MMadTrack360Logo
const MMadTrack360Logo = (props) => (
  <img src="/MMAD_App_logo.jpeg" alt="MMadTrack360 Logo" {...props} />
);

const cardStyle = {
  background: "#fff",
  color: "#1e3c72",
  borderRadius: 16,
  boxShadow: "0 4px 24px rgba(30,60,114,0.10)",
  padding: 24,
  margin: 12,
  minWidth: 320,
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start"
};

const features = [
  { title: "Live Location Tracking", icon: <MapIcon style={{width:32,height:32,color:'#2563eb'}} />, component: <StaffLocation /> },
  { title: "Staff Check-In", icon: <CheckCircleIcon style={{width:32,height:32,color:'#10b981'}} />, component: <StaffCheckin /> },
  { title: "Staff Scan", icon: <QrCodeIcon style={{width:32,height:32,color:'#f59e42'}} />, component: <StaffScan /> },
  { title: "Staff Alerts", icon: <BellIcon style={{width:32,height:32,color:'#f59e42'}} />, component: <StaffAlert /> },
];

const StaffDashboard = () => (
  <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", display: "flex", flexDirection: "row-reverse", fontFamily: "Segoe UI, sans-serif" }}>
    <Sidebar />
    <div style={{ flex: 1, marginRight: 280, padding: 40 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24, animation: 'fadeInDown 0.8s' }}>
        <img src="/MMAD_App_logo.jpeg" alt="MMadTrack360 Logo" style={{ width: 80, marginRight: 16, filter: 'drop-shadow(0 2px 8px #2563eb)' }} />
        <h1 style={{ fontWeight: 700, fontSize: 36, color: "#fff", letterSpacing: 1, textShadow: '0 2px 8px #1e3c72' }}>MMadTrack360 Staff Dashboard</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 32, animation: 'fadeInUp 1s' }}>
        {features.map((f, idx) => (
          <div key={f.title} style={{ background: "#fff", color: "#1e3c72", borderRadius: 18, boxShadow: "0 4px 24px rgba(30,60,114,0.12)", padding: 28, minWidth: 320, display: "flex", flexDirection: "column", alignItems: "flex-start", animation: `fadeInUp 1.${idx+1}s` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              {f.icon}
              <h2 style={{ fontWeight: 600, fontSize: 22 }}>{f.title}</h2>
            </div>
            <div style={{ width: '100%' }}>{f.component}</div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .sidebar, .main-content, .feature-card, .page-header {
            min-width: 0 !important;
            max-width: 100vw !important;
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
  </div>
);

export default StaffDashboard;
