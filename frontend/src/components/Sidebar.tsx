import { ChartBarIcon, UsersIcon, MapIcon, ChatBubbleLeftRightIcon, ArrowTrendingUpIcon, QrCodeIcon, KeyIcon, BellIcon, DocumentTextIcon, CreditCardIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { NavLink } from 'react-router-dom';

const menu = [
  { name: 'Dashboard', icon: <ChartBarIcon className="w-5 h-5" />, to: '/admin' },
  { name: 'Analytics & Reports', icon: <ArrowTrendingUpIcon className="w-5 h-5" />, to: '/admin/analytics', children: [
    { name: 'Reports', to: '/admin/analytics/reports' },
    { name: 'Live Reports', to: '/admin/analytics/live' }
  ] },
  { name: 'Staff Management', icon: <UsersIcon className="w-5 h-5" />, to: '/admin/staff', children: [
    { name: 'Add Staff', to: '/admin/staff/add' },
    { name: 'Message Staff', to: '/admin/staff/messages' },
    { name: 'Create Account', to: '/admin/staff/create' },
  ] },
  { name: 'Live Tracking', icon: <MapIcon className="w-5 h-5" />, to: '/admin/live-tracking' },
  { name: 'Communication Hub', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />, to: '/admin/communication' },
  { name: 'AI Assistant', icon: <ChartBarIcon className="w-5 h-5" />, to: '/admin/ai-assistant' },
  { name: 'QR Scanner', icon: <QrCodeIcon className="w-5 h-5" />, to: '/admin/qr-scanner' },
  { name: 'Audit Console', icon: <DocumentTextIcon className="w-5 h-5" />, to: '/admin/audit-console' },
  { name: 'Subscription', icon: <CreditCardIcon className="w-5 h-5" />, to: '/admin/subscription' },
  { name: 'Admin Tools', icon: <KeyIcon className="w-5 h-5" />, to: '/admin/admin-tools', children: [
    { name: 'Settings', to: '/admin/admin-tools/settings' },
    { name: 'Integrations', to: '/admin/admin-tools/integrations' }
  ] },
  { name: 'Quick Actions', icon: <BellIcon className="w-5 h-5" />, to: '/admin/quick-actions' },
  { name: 'Emergency Alert', icon: <ExclamationTriangleIcon className="w-5 h-5" />, to: '/admin/emergency-alert' }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((s) => ({ ...s, [name]: !s[name] }));
  };
  // mobile: translate-x-0 when open, -translate-x-full when closed
  return (
    <aside
      className={`sidebar fixed left-0 top-0 h-screen z-20 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full md:w-20'}` + ' sidebar-bg'}
    >
  <div className="sidebar-header px-6 py-4 border-b sidebar-header-border">
            <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src='/MMAD_App_logo_light.png' alt='MMadTrack360' className='w-8 h-8 object-contain rounded' onError={(e)=>{ (e.target as HTMLImageElement).style.display='none'; }} />
            <div>
              <div className="text-white font-bold">MMadTrack360</div>
              <div className="text-xs text-white/80">Enterprise Security</div>
            </div>
          </div>
          <button className="md:hidden p-2 text-white" onClick={onClose} aria-label="Close sidebar">✕</button>
        </div>

        {isOpen && (
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-white/85 font-medium">ENTERPRISE PLAN</div>
            <div className="text-xs text-white font-semibold">📋</div>
          </div>
        )}
      </div>
  {/* Make the menu area scrollable when it overflows the viewport */}
  <nav className="sidebar-menu py-4 flex-1 flex flex-col gap-1 px-1 overflow-y-auto sidebar-scroll">
        {menu.map(item => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button onClick={() => toggleMenu(item.name)} className={`w-full flex items-center gap-3 px-5 py-3 text-white text-sm font-medium transition-all duration-200 cursor-pointer sidebar-item-hover` }>
                      <span className="menu-item-icon">{item.icon}</span>
                  <span className={`${isOpen ? 'inline' : 'hidden'}`}>{item.name}</span>
                  <span className={`${isOpen ? 'ml-auto' : 'hidden'}`}>▸</span>
                </button>
                {openMenus[item.name] && (
                  <div className="ml-8 mt-1 mb-2 sidebar-children">
                    {item.children.map((c: any) => (
                      <NavLink key={c.name} to={c.to} className={({ isActive }) => `block px-4 py-2 text-sm rounded text-white/92 ${isActive ? 'sidebar-item-active' : 'sidebar-item-hover hover:text-[var(--primary-500)]'}`} onClick={() => { if (onClose) onClose(); }}>
                        {c.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `menu-item flex items-center gap-3 px-5 py-3 text-white text-sm font-medium transition-all duration-200 cursor-pointer ${isActive ? 'sidebar-item-active' : 'sidebar-item-hover hover:text-[var(--primary-500)]'}`
                }
                onClick={() => { if (onClose) onClose(); }}
              >
                <span className="menu-item-icon">{item.icon}</span>
                <span className={`${isOpen ? 'inline' : 'hidden'}`}>{item.name}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

  <div className="px-4 py-3 border-t sidebar-bottom-border">
        <button onClick={() => window.location.href = '/admin/analytics'} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-white/10 text-white text-sm">📋 Generate Report</button>
      </div>
    </aside>
  );
}
