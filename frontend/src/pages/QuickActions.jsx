import React from 'react';

export default function QuickActions() {
  return (
    <div className='min-h-screen p-6'>
      <h1 className='text-2xl font-semibold mb-4'>Quick Actions</h1>
      <p className='text-sm text-slate-600'>Quick action buttons and shortcuts.</p>
      <div className='mt-4 space-y-2'>
        <button className='px-4 py-2 bg-red-600 text-white rounded'>Emergency Alert</button>
        <button className='px-4 py-2 bg-blue-600 text-white rounded'>Generate Report</button>
      </div>
    </div>
  );
}
