import { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';

interface DashboardLayoutProps {
  children?: ReactNode;
}

/* Navigation moved into the Sidebar component to avoid duplicate menus */

export default function DashboardLayout(_: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mocked user info / notifications for layout — replace with real auth state when available
  const user = { name: 'System Administrator', email: 'admin@mmadtrack360.com', initials: 'AD' };
  const notificationsCount = 3;

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Use the single Sidebar component so there's only one menu rendered */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={(v:any)=>setSidebarOpen(v)} notificationsCount={notificationsCount} user={user} />

        <main className='flex-1 overflow-y-auto app-main-bg'>
          <div className='p-6'>
            {/* Render nested admin routes here so sidebar/header remain persistent */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
