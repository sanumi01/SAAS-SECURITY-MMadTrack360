import React from 'react';

export default function LiveTracking() {
  return (
    <div className='min-h-screen p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold text-white'>Live Tracking</h1>
          <p className='text-sm text-slate-200'>Real-time location and movement of staff and assets</p>
        </div>
      </div>

      <div className='grid lg:grid-cols-2 gap-6'>
        <div className='panel-bg rounded-2xl p-6 shadow-lg'>
          <div className='text-sm text-white/75'>Map View</div>
          <div className='mt-4 h-72 bg-white/30 rounded flex items-center justify-center text-slate-200'>Map placeholder</div>
        </div>

        <div className='panel-bg rounded-2xl p-6 shadow-lg'>
          <h3 className='text-sm text-white/75'>Live Staff Status</h3>
          <ul className='mt-4 space-y-3 text-slate-800'>
            <li className='flex items-center justify-between'>
              <div>
                <div className='font-medium'>John Smith</div>
                <div className='text-xs text-white/75'>Security • ON DUTY</div>
              </div>
              <div className='text-sm font-semibold text-[var(--primary-700)]'>94%</div>
            </li>
            <li className='flex items-center justify-between'>
              <div>
                <div className='font-medium'>Sarah Johnson</div>
                <div className='text-xs text-white/75'>Security • ON DUTY</div>
              </div>
              <div className='text-sm font-semibold text-[var(--primary-700)]'>98%</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
