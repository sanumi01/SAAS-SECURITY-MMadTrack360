import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminProfileSettings() {
  return (
    <div className='min-h-screen p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-semibold mb-4'>Profile Settings</h1>
        <p className='mb-6 text-white/85 dark:text-white/65'>Update your account details, profile information and contact preferences.</p>

        <section className='bg-white dark:bg-slate-800 p-6 rounded shadow-sm'>
          <h2 className='text-lg font-medium mb-3'>Basic Information</h2>
          <div className='space-y-3'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
              <label className='w-28 text-sm text-white/85 dark:text-white/65'>Full name</label>
              <div className='flex-1'>John Admin</div>
            </div>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
              <label className='w-28 text-sm text-white/85 dark:text-white/65'>Email</label>
              <div className='flex-1'>admin@mmadtrack360.com</div>
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
