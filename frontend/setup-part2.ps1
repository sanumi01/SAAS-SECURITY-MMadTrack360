# =============================================================================
# PART 2: PROFESSIONAL DASHBOARD UI COMPONENTS
# =============================================================================

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🎨 PART 2: Creating Professional Dashboard" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Make sure you're in frontend folder
$currentPath = Get-Location
if ($currentPath.Path -notlike "*frontend*") {
    Write-Host "❌ ERROR: Not in frontend folder!" -ForegroundColor Red
    exit
}

# =============================================================================
# PART 2A: CREATE DASHBOARD LAYOUT
# =============================================================================

Write-Host "📐 Creating Dashboard Layout..." -ForegroundColor Yellow
Write-Host ""

# Create DashboardLayout.tsx
@"
import { ReactNode, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  BarChart3, 
  Menu,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Shield,
  Activity,
  CreditCard,
  X
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null },
  { name: 'Security', href: '/security', icon: Shield, badge: '3' },
  { name: 'Users', href: '/users', icon: Users, badge: null },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: null },
  { name: 'Activity', href: '/activity', icon: Activity, badge: 'New' },
  { name: 'Reports', href: '/reports', icon: FileText, badge: null },
  { name: 'Billing', href: '/billing', icon: CreditCard, badge: null },
  { name: 'Settings', href: '/settings', icon: Settings, badge: null },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState('/dashboard');

  const handleNavClick = (href: string) => {
    setCurrentPath(href);
  };

  return (
    <div className='flex h-screen bg-slate-50 overflow-hidden'>
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col shadow-sm',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo Section */}
        <div className='p-4 border-b border-slate-200'>
          <div className='flex items-center justify-between'>
            {sidebarOpen && (
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                  <Shield className='h-6 w-6 text-white' />
                </div>
                <div>
                  <h1 className='text-sm font-bold text-slate-900'>MMA Track 360</h1>
                  <p className='text-xs text-slate-500'>Security Platform</p>
                </div>
              </div>
            )}
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className='hover:bg-slate-100'
            >
              {sidebarOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-3 space-y-1 overflow-y-auto'>
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all group relative',
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <div className='flex items-center gap-3'>
                  <item.icon 
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-slate-400 group-hover:text-slate-600'
                    )} 
                  />
                  {sidebarOpen && <span className='text-sm'>{item.name}</span>}
                </div>
                {sidebarOpen && item.badge && (
                  <Badge variant={isActive ? 'default' : 'secondary'} className='text-xs'>
                    {item.badge}
                  </Badge>
                )}
                {!sidebarOpen && isActive && (
                  <div className='absolute left-0 w-1 h-8 bg-blue-600 rounded-r' />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className='p-4 border-t border-slate-200 bg-slate-50'>
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            <div className='h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-blue-500/20'>
              AD
            </div>
            {sidebarOpen && (
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-slate-900 truncate'>Admin User</p>
                <p className='text-xs text-slate-500 truncate'>admin@mmatrack.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Header */}
        <header className='bg-white border-b border-slate-200 px-6 py-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            {/* Search Bar */}
            <div className='flex-1 max-w-md'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4' />
                <input
                  type='search'
                  placeholder='Search users, reports, activities...'
                  className='w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm'
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className='flex items-center gap-3'>
              <Button variant='ghost' size='icon' className='relative hover:bg-slate-100'>
                <Bell className='h-5 w-5 text-slate-600' />
                <span className='absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse' />
              </Button>

              <div className='flex items-center gap-2 pl-3 border-l border-slate-200'>
                <div className='h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
                  AD
                </div>
                <div className='hidden md:block'>
                  <p className='text-sm font-medium text-slate-700'>Admin</p>
                  <p className='text-xs text-slate-500'>Administrator</p>
                </div>
                <ChevronDown className='h-4 w-4 text-slate-500' />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto bg-slate-50'>
          <div className='p-6'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
"@ | Out-File -FilePath "src\components\layout\DashboardLayout.tsx" -Encoding utf8

Write-Host "✅ Dashboard Layout created!" -ForegroundColor Green

# =============================================================================
# PART 2B: CREATE DASHBOARD PAGE
# =============================================================================

Write-Host "`n📊 Creating Dashboard Page..." -ForegroundColor Yellow

# Create Dashboard.tsx
@"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  Eye,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';
import { formatRelativeTime } from '../lib/utils';

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
  bgColor: string;
}

interface Activity {
  id: number;
  user: string;
  action: string;
  time: Date;
  status: 'success' | 'pending' | 'failed';
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([
    {
      title: 'Total Users',
      value: '2,345',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Monthly Revenue',
      value: '$45,231',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Sessions',
      value: '573',
      change: '-3.1%',
      trend: 'down',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Security Score',
      value: '98.5%',
      change: '+2.4%',
      trend: 'up',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, user: 'John Doe', action: 'Created new security report', time: new Date(Date.now() - 120000), status: 'success' },
    { id: 2, user: 'Jane Smith', action: 'Updated user permissions', time: new Date(Date.now() - 900000), status: 'success' },
    { id: 3, user: 'Bob Johnson', action: 'Payment received - Premium Plan', time: new Date(Date.now() - 3600000), status: 'success' },
    { id: 4, user: 'Alice Brown', action: 'Failed login attempt detected', time: new Date(Date.now() - 7200000), status: 'failed' },
    { id: 5, user: 'Charlie Wilson', action: 'Account verification pending', time: new Date(Date.now() - 10800000), status: 'pending' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        if (response.data.success) {
          // Update stats with real data
          setStats(prev => prev.map((stat, idx) => {
            const keys = ['totalUsers', 'revenue', 'activeUsers', 'securityScore'];
            return {
              ...stat,
              value: response.data.data[keys[idx]]?.toString() || stat.value
            };
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className='h-4 w-4 text-green-600' />;
      case 'failed':
        return <AlertCircle className='h-4 w-4 text-red-600' />;
      case 'pending':
        return <Clock className='h-4 w-4 text-yellow-600' />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): 'default' | 'destructive' | 'secondary' => {
    switch (status) {
      case 'success':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Page Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900'>Dashboard</h1>
            <p className='text-slate-600 mt-1'>Welcome back! Here's your platform overview.</p>
          </div>
          <div className='flex gap-3'>
            <Button variant='outline' className='gap-2'>
              <Download className='h-4 w-4' />
              Export Data
            </Button>
            <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2'>
              <Shield className='h-4 w-4' />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {stats.map((stat, index) => (
            <Card key={index} className='hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-blue-300'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-slate-600'>{stat.title}</p>
                    <p className='text-3xl font-bold text-slate-900'>{stat.value}</p>
                    <div className='flex items-center gap-1'>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className='h-4 w-4 text-green-600' />
                      ) : (
                        <ArrowDownRight className='h-4 w-4 text-red-600' />
                      )}
                      <span className={\`text-sm font-semibold \${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}\`}>
                        {stat.change}
                      </span>
                      <span className='text-sm text-slate-500 ml-1'>vs last month</span>
                    </div>
                  </div>
                  <div className={\`h-14 w-14 \${stat.bgColor} rounded-xl flex items-center justify-center shadow-sm\`}>
                    <stat.icon className={\`h-7 w-7 \${stat.color}\`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Recent Activity */}
          <Card className='lg:col-span-2 border-slate-200'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions and events across your platform</CardDescription>
                </div>
                <Button variant='outline' size='sm' className='gap-2'>
                  <Eye className='h-4 w-4' />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className='flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100'
                  >
                    <div className='flex items-center gap-4 flex-1'>
                      <div className='h-10 w-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center'>
                        <span className='text-sm font-semibold text-blue-600'>
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-slate-900 text-sm'>{activity.user}</p>
                        <p className='text-sm text-slate-600 truncate'>{activity.action}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 ml-4'>
                      <span className='text-sm text-slate-500 whitespace-nowrap'>
                        {formatRelativeTime(activity.time)}
                      </span>
                      <Badge variant={getStatusVariant(activity.status)} className='gap-1 capitalize'>
                        {getStatusIcon(activity.status)}
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className='border-slate-200'>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button className='w-full justify-start' variant='outline'>
                <Users className='h-4 w-4 mr-2' />
                Add New User
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <Shield className='h-4 w-4 mr-2' />
                Run Security Scan
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <FileText className='h-4 w-4 mr-2' />
                Export Report
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <Activity className='h-4 w-4 mr-2' />
                View Analytics
              </Button>
              <Button className='w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'>
                <TrendingUp className='h-4 w-4 mr-2' />
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
"@ | Out-File -FilePath "src\pages\Dashboard.tsx" -Encoding utf8

Write-Host "✅ Dashboard page created!" -ForegroundColor Green

# =============================================================================
# PART 2C: UPDATE MAIN APP & ROUTING
# =============================================================================

Write-Host "`n🔧 Setting up App & Routing..." -ForegroundColor Yellow

# Update App.tsx
@"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/security' element={<Dashboard />} />
        <Route path='/users' element={<Dashboard />} />
        <Route path='/analytics' element={<Dashboard />} />
        <Route path='/activity' element={<Dashboard />} />
        <Route path='/reports' element={<Dashboard />} />
        <Route path='/billing' element={<Dashboard />} />
        <Route path='/settings' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
"@ | Out-File -FilePath "src\App.tsx" -Encoding utf8

# Update main.tsx
@"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
"@ | Out-File -FilePath "src\main.tsx" -Encoding utf8

# Update index.html
@"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MMA Track 360 Security - Professional SaaS Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"@ | Out-File -FilePath "index.html" -Encoding utf8

Write-Host "✅ App & Routing configured!" -ForegroundColor Green

# =============================================================================
# PART 2D: CREATE TSCONFIG PATHS
# =============================================================================

Write-Host "`n⚙️ Configuring TypeScript paths..." -ForegroundColor Yellow

# Check if tsconfig.json exists
if (Test-Path "tsconfig.json") {
    # Update tsconfig.json to add path aliases
    $tsconfig = Get-Content "tsconfig.json" -Raw | ConvertFrom-Json
    
    if (-not $tsconfig.compilerOptions.baseUrl) {
        $tsconfig.compilerOptions | Add-Member -MemberType NoteProperty -Name "baseUrl" -Value "." -Force
    }
    
    if (-not $tsconfig.compilerOptions.paths) {
        $tsconfig.compilerOptions | Add-Member -MemberType NoteProperty -Name "paths" -Value @{
            "@/*" = @("./src/*")
        } -Force
    } else {
        $tsconfig.compilerOptions.paths = @{
            "@/*" = @("./src/*")
        }
    }
    
    $tsconfig | ConvertTo-Json -Depth 10 | Set-Content "tsconfig.json"
    Write-Host "✅ TypeScript paths configured!" -ForegroundColor Green
}

# Update vite.config
if (Test-Path "vite.config.ts") {
    @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 4173,
  },
})
"@ | Out-File -FilePath "vite.config.ts" -Encoding utf8
    Write-Host "✅ Vite config updated!" -ForegroundColor Green
}

# =============================================================================
# FINAL SUMMARY
# =============================================================================

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✅ PART 2 COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Created:" -ForegroundColor Cyan
Write-Host "  ✅ Dashboard Layout (with sidebar, header)" -ForegroundColor Green
Write-Host "  ✅ Dashboard Page (with stats, activity feed)" -ForegroundColor Green
Write-Host "  ✅ App.tsx with routing" -ForegroundColor Green
Write-Host "  ✅ TypeScript path aliases" -ForegroundColor Green
Write-Host "  ✅ Vite configuration" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Stop current dev server (Ctrl+C)" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Start fresh:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "3️⃣  Open browser:" -ForegroundColor White
Write-Host "   http://localhost:4173" -ForegroundColor Cyan
Write-Host ""

Write-Host "💡 You should now see a professional dashboard!" -ForegroundColor Green
Write-Host ""

# Create quick reference
@"
PART 2 COMPLETED
================

Created Files:
- src/components/layout/DashboardLayout.tsx
- src/pages/Dashboard.tsx
- src/App.tsx (updated)
- src/main.tsx (updated)
- index.html (updated)
- vite.config.ts (updated)
- tsconfig.json (updated)

Features:
✅ Professional sidebar navigation
✅ Stats cards with icons
✅ Activity feed
✅ Quick actions panel
✅ Responsive design
✅ Modern UI with Tailwind

To Run:
1. npm run dev
2. Open: http://localhost:4173

To Deploy:
1. npm run build
2. Deploy 'dist' folder to AWS S3

"@ | Out-File -FilePath "PART2-COMPLETE.txt" -Encoding utf8

Write-Host "📄 Summary saved to PART2-COMPLETE.txt" -ForegroundColor Gray
Write-Host ""