import { Routes, Route, Navigate } from "react-router-dom";
import LoginButton from "./components/LoginButton";
import Login from "./pages/Login";
import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
import StaffLogin from './pages/StaffLogin';
import CreateStaff from './pages/CreateStaff';
import StaffList from './pages/StaffList';
import AdminForgot from './pages/AdminForgot';
import StaffForgot from './pages/StaffForgot';
import ResetPassword from './pages/ResetPassword';
import Callback from "./pages/Callback";
import MMadTrack360Logo from "./components/MMadTrack360Logo";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import SearchResults from "./pages/SearchResults";
import AdminProfileSettings from './pages/AdminProfileSettings';
import AdminPreferences from './pages/AdminPreferences';
import AnalyticsReports from './pages/AnalyticsReports';
import LiveTracking from './pages/LiveTracking';
import AIAssistant from './pages/AIAssistant';
import QRScanner from './pages/QRScanner';
import AuditConsole from './pages/AuditConsole';
import Subscription from './pages/Subscription';
import AdminTools from './pages/AdminTools';
import QuickActions from './pages/QuickActions';
import EmergencyAlert from './pages/EmergencyAlert';
import Notifications from './pages/Notifications';
import PlatformPreview from "./pages/PlatformPreview";
import CommunicationHub from './pages/CommunicationHub';
import AddStaff from './pages/AddStaff';
import MessageStaff from './pages/MessageStaff';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthWrapper from './components/AuthWrapper';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/login" element={<Login onLogin={() => {}} />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/callback" element={<Callback />} />
  <Route path="/admin/forgot-password" element={<AdminForgot />} />
  <Route path="/staff/forgot-password" element={<StaffForgot />} />
  <Route path="/reset" element={<ResetPassword />} />
      <Route path="/dashboard" element={<div className="p-6 text-2xl font-semibold">Dashboard Preview: All features loaded!</div>} />
      <Route path="/preview" element={<PlatformPreview />} />

  {/* Admin area uses DashboardLayout so sidebar + header persist. Wrap with AuthWrapper for protected dev routes */}
  <Route path="/admin" element={<AuthWrapper><DashboardLayout /></AuthWrapper>}>
  <Route index element={<AdminDashboard />} />
  <Route path="search" element={<SearchResults />} />
        <Route path="profile-settings" element={<AdminProfileSettings />} />
        <Route path="preferences" element={<AdminPreferences />} />
        <Route path="analytics">
          <Route index element={<AnalyticsReports />} />
          <Route path="reports" element={<AnalyticsReports />} />
          <Route path="live" element={<AnalyticsReports />} />
        </Route>
        <Route path="live-tracking" element={<LiveTracking />} />
  <Route path="communication" element={<CommunicationHub />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="qr-scanner" element={<QRScanner />} />
        <Route path="audit-console" element={<AuditConsole />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="admin-tools">
          <Route index element={<AdminTools />} />
          <Route path="settings" element={<AdminTools />} />
          <Route path="integrations" element={<AdminTools />} />
        </Route>
        <Route path="quick-actions" element={<QuickActions />} />
        <Route path="emergency-alert" element={<EmergencyAlert />} />
        <Route path="notifications" element={<Notifications />} />
  <Route path="staff" element={<StaffDashboard />} />
  <Route path="staff/add" element={<AddStaff />} />
  <Route path="staff/messages" element={<MessageStaff />} />
  <Route path="staff/create" element={<CreateStaff />} />
  <Route path="staff/list" element={<StaffList />} />
      </Route>
  <Route path="/admin-signup" element={<AdminSignup />} />
    </Routes>
  );
}

export default App;
