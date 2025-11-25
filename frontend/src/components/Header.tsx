import React from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Header({ sidebarOpen, setSidebarOpen, notificationsCount = 0, user = { name: 'Admin', email: '' } }: any) {
  const navigate = useNavigate();
  const toggleTheme = () => {
    const doc = document.documentElement;
    if (doc.classList.contains('dark')) {
      doc.classList.remove('dark');
      localStorage.setItem('theme','light');
    } else {
      doc.classList.add('dark');
      localStorage.setItem('theme','dark');
    }
  };

  const logoSrc = typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '/MMAD_App_logo_dark.png' : '/MMAD_App_logo_light.png';

  return (
    <header className='bg-transparent px-6 py-4 z-40'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' onClick={() => setSidebarOpen(!sidebarOpen)} className='hover:bg-white/3' aria-label='Toggle sidebar'>
            <Menu className='h-5 w-5 text-white' />
          </Button>
          <div className='flex items-center gap-3'>
            <img src={logoSrc} alt='MMadTrack360 logo' className='h-9 w-auto object-contain' onError={(e)=>{ (e.target as HTMLImageElement).style.display='none'; }} />
            <div className='text-white'>
              <div className='text-sm font-semibold'>MMadTrack360</div>
              <div className='text-xs opacity-80'>Security Operations</div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <Button variant='ghost' size='icon' className='relative hover:bg-white/3' onClick={() => navigate('/admin/notifications')} aria-label='Notifications'>
            <Bell className='h-5 w-5 text-white' />
            {notificationsCount > 0 && <span className='absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white bg-red-500 rounded-full z-50' aria-hidden>{notificationsCount}</span>}
          </Button>
          <Button variant='ghost' size='icon' onClick={toggleTheme} className='hover:bg-white/3' aria-label='Toggle theme'>
            <svg className='h-5 w-5 text-white' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/><circle cx='12' cy='12' r='3' stroke='currentColor' strokeWidth='1.5'/></svg>
          </Button>
          <div className='relative'>
              <button className='flex items-center gap-2 pl-3 border-l border-white/10 pr-2 py-1 hover:bg-white/3 rounded text-white' aria-haspopup='true' aria-label='User menu'>
              <div className='h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold avatar-gradient'>{user.initials || (user.name ? user.name.split(' ').map(n=>n[0]).slice(0,2).join('') : 'AD')}</div>
              <div className='hidden md:block text-left'>
                <p className='text-sm font-medium'>{user.name}</p>
                <p className='text-xs opacity-80'>{user.email}</p>
              </div>
              <ChevronDown className='h-4 w-4 text-white/80' />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
