import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery();
  const q = query.get('q') || '';

  // Mock results — in a real app these would be fetched from an API
  const mock = [
    { id: 1, type: 'User', title: 'John Smith', desc: 'Staff check-in' },
    { id: 2, type: 'Report', title: 'Weekly Performance', desc: 'Generated report' },
    { id: 3, type: 'Alert', title: 'Emergency Drill', desc: 'System drill completed' },
  ];

  const results = mock.filter(r => (r.title + r.desc + r.type).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className='min-h-screen'>
      <div className='panel-bg p-6 rounded-md'>
        <h1 className='text-2xl font-semibold mb-2'>Search results for "{q}"</h1>
        <p className='text-sm text-muted mb-4'>Showing {results.length} result(s)</p>

        <div className='space-y-3'>
          {results.map(r => (
            <Link key={r.id} to='#' className='block p-3 bg-white/5 rounded hover:bg-white/6'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='font-medium'>{r.title}</div>
                  <div className='text-xs text-muted'>{r.type} — {r.desc}</div>
                </div>
                <div className='text-xs text-slate-300'>View</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
