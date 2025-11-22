import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPreferences() {
  return (
    <div className='min-h-screen p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-semibold mb-4'>Preferences</h1>
        <p className='mb-6 text-slate-600 dark:text-slate-300'>Customize your UI and notification preferences.</p>

        <section className='bg-white dark:bg-slate-800 p-6 rounded shadow-sm'>
          <h2 className='text-lg font-medium mb-3'>Notifications</h2>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium'>Email notifications</div>
                <div className='text-sm text-slate-500 dark:text-slate-400'>Receive email updates for important alerts.</div>
              </div>
              <div>
                <input type='checkbox' defaultChecked />
              </div>
            </div>
          </div>
        </section>

        <div className='mt-6'>
          <Link to='/admin' className='inline-block bg-blue-600 text-white px-4 py-2 rounded'>Back to Admin</Link>
        </div>
      </div>
    </div>
  );
}
