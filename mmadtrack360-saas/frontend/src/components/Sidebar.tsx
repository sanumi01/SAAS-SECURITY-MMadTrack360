import { ChartBarIcon, UsersIcon, CalendarDaysIcon, MapIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { NavLink } from 'react-router-dom';

const menu = [
  { name: 'Dashboard', icon: <ChartBarIcon className="w-5 h-5" />, to: '/dashboard' },
  { name: 'Staff Management', icon: <UsersIcon className="w-5 h-5" />, to: '/staff' },
  { name: 'Staff Scheduling', icon: <CalendarDaysIcon className="w-5 h-5" />, to: '/scheduling' },
  { name: 'Live Location Tracking', icon: <MapIcon className="w-5 h-5" />, to: '/location' },
  { name: 'Communication Hub', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />, to: '/communication' },
  { name: 'Advanced Analytics', icon: <ArrowTrendingUpIcon className="w-5 h-5" />, to: '/analytics' },
  { name: 'Settings', icon: <Cog6ToothIcon className="w-5 h-5" />, to: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar fixed left-0 top-0 h-screen w-[280px] bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 z-50">
      <div className="sidebar-header px-6 py-6 border-b border-slate-700">
        <div className="sidebar-logo flex items-center gap-2 text-cyan-400 font-bold text-xl">
          <ChartBarIcon className="w-6 h-6" />
          MMadTrack360
        </div>
      </div>
      <nav className="sidebar-menu py-4 flex flex-col gap-1">
        {menu.map(item => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `menu-item flex items-center gap-3 px-5 py-3 text-slate-400 text-sm transition-all duration-200 cursor-pointer ${isActive ? 'active bg-slate-800 text-cyan-400 border-l-4 border-cyan-400 font-semibold' : 'hover:bg-slate-800 hover:text-cyan-400 hover:border-l-4 hover:border-cyan-400'}`
            }
          >
            <span className="menu-item-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
