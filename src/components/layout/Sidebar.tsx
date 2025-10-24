import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/' },
    { icon: '👥', label: 'Staff Management', path: '/staff' },
    { icon: '📅', label: 'Scheduling', path: '/scheduling' },
    { icon: '🗺️', label: 'Live Tracking', path: '/tracking' },
    { icon: '💬', label: 'Communication', path: '/communication' },
    { icon: '📈', label: 'Analytics', path: '/analytics' },
    { icon: '💳', label: 'Subscription', path: '/subscription' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ]

  return (
    <aside className="fixed left-0 top-[70px] w-[280px] h-[calc(100vh-70px)] bg-neutral-800 border-r border-neutral-700 overflow-y-auto">
      <div className="py-6">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => 
              'flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ' + 
              (isActive ? 'text-blue-500 bg-blue-500/10 border-l-3 border-blue-500' : 'text-gray-400 hover:text-blue-500')
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
