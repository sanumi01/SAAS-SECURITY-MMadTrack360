
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { ChartBarIcon, KeyIcon, MapIcon, CheckCircleIcon, QrCodeIcon, BellIcon } from '@heroicons/react/24/solid';
import AnalyticsDashboard from "../features/AnalyticsDashboard";
import AdminAccess from "../features/AdminAccess";
import StaffLocation from "../features/StaffLocation";
import StaffCheckin from "../features/StaffCheckin";
import StaffScan from "../features/StaffScan";
import StaffAlert from "../features/StaffAlert";

// Chart.js imports
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Temporary stub for missing MMadTrack360Logo
const MMadTrack360Logo = (props) => (
  <img src="/MMAD_App_logo.jpeg" alt="MMadTrack360 Logo" {...props} />
);

// feature tiles are available in separate feature components; the local `features` list was unused and removed to satisfy lint rules

const AdminDashboard = () => {

  return (
    <div className="app-main-bg min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="flex-1 main-content p-8">
        {/* Top header/logo block removed here — header at the top of the app is authoritative */}
        <div className="flex items-center justify-between mb-6">
          <div />
          <div className="flex items-center gap-3" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <div className="panel-bg rounded-2xl p-5 shadow-md">
            <div className="text-sm text-muted">Total Staff</div>
            <div className="text-3xl font-bold text-white mt-2">2</div>
            <div className="text-xs text-muted mt-1">↑ 5% from last month</div>
          </div>
          <div className="panel-bg rounded-2xl p-5 shadow-md">
            <div className="text-sm text-muted">On Duty Now</div>
            <div className="text-3xl font-bold text-white mt-2">2</div>
            <div className="text-xs text-muted mt-1">100.0% coverage</div>
          </div>
          <div className="panel-bg rounded-2xl p-5 shadow-md">
            <div className="text-sm text-muted">Active Alerts</div>
            <div className="text-3xl font-bold text-red-400 mt-2">0</div>
            <div className="text-xs text-muted mt-1">Requires attention</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="panel-bg rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-3">Performance Analytics</h2>
            <div className="h-48 panel-muted rounded p-2">
              <Line
                data={{
                  labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
                  datasets: [
                    {
                      label: 'Performance %',
                      data: [92,93,95,94,96,97,96],
                      borderColor: 'var(--primary-700)',
                      backgroundColor: 'var(--chart-bg)',
                      tension: 0.25,
                      pointRadius: 3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: false, suggestedMin: 80, suggestedMax: 100 } }
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 panel-muted rounded">
                <div className="text-sm text-muted">Avg Performance</div>
                <div className="text-2xl font-bold text-white">96.0%</div>
                <div className="text-xs text-muted">↑ 3% improvement</div>
              </div>
              <div className="p-3 panel-muted rounded">
                <div className="text-sm text-muted">Live Activity</div>
                <div className="text-2xl font-bold text-white">Streaming</div>
                <div className="text-xs text-muted">Real-time events</div>
              </div>
            </div>
          </section>

          <section className="panel-bg rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-3">Recent Activity</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center">JS</div>
                <div>
                  <div className="text-sm font-medium">John Smith <span className="text-xs text-slate-400">• 2 min ago</span></div>
                  <div className="text-sm text-slate-500">Staff check-in</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center">SJ</div>
                <div>
                  <div className="text-sm font-medium">Sarah Johnson <span className="text-xs text-slate-400">• 5 min ago</span></div>
                  <div className="text-sm text-slate-500">Alert resolved</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center">MD</div>
                <div>
                  <div className="text-sm font-medium">Mike Davis <span className="text-xs text-slate-400">• 8 min ago</span></div>
                  <div className="text-sm text-slate-500">QR scan completed</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center">SY</div>
                <div>
                  <div className="text-sm font-medium">System <span className="text-xs text-slate-400">• 12 min ago</span></div>
                  <div className="text-sm text-slate-500">Emergency drill</div>
                </div>
              </li>
            </ul>
          </section>
        </div>

        {/* Staff Status Overview */}
        <div className="mt-6">
          <div className="panel-bg rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">👥 Staff Status Overview</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card */}
              <div className="panel-muted rounded p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">J</div>
                <div>
                  <div className="text-sm font-semibold">John Smith</div>
                  <div className="text-xs text-muted">Security</div>
                  <div className="text-xs text-green-400 font-semibold mt-1">ON DUTY</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm text-muted">Performance</div>
                  <div className="text-lg font-bold text-white">94%</div>
                </div>
              </div>

              <div className="panel-muted rounded p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">S</div>
                <div>
                  <div className="text-sm font-semibold">Sarah Johnson</div>
                  <div className="text-xs text-muted">Security</div>
                  <div className="text-xs text-green-400 font-semibold mt-1">ON DUTY</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm text-muted">Performance</div>
                  <div className="text-lg font-bold text-white">98%</div>
                </div>
              </div>

              <div className="panel-muted rounded p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">M</div>
                <div>
                  <div className="text-sm font-semibold">Mike Davis</div>
                  <div className="text-xs text-muted">Security</div>
                  <div className="text-xs text-yellow-400 font-semibold mt-1">OFF DUTY</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm text-muted">Performance</div>
                  <div className="text-lg font-bold text-white">88%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

          <style>{`
            @media (min-width: 768px) {
              .main-content { padding-left: 48px; }
            }
            @media (max-width: 767px) {
              .main-content { padding-left: 16px !important; }
            }
          `}</style>
        </div>
      </div>
    );
  }

export default AdminDashboard;
