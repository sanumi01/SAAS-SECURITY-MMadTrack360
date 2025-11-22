import React from 'react';
const Heatmap = React.lazy(() => import('../components/Heatmap'));

const mockPerformance = [
  { label: 'Performance', value: '94.2%', delta: '+2.4%', trend: 'up' },
  { label: 'Incidents', value: '23', delta: '-18%', trend: 'down' },
  { label: 'Response Time', value: '2.1m', delta: '-25%', trend: 'down' },
  { label: 'Efficiency', value: '98.5%', delta: '+5%', trend: 'up' },
];

function downloadCSV(rows, filename = 'report.csv') {
  const header = Object.keys(rows[0]).join(',') + '\n';
  const body = rows.map(r => Object.values(r).join(',')).join('\n');
  const blob = new Blob([header + body], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsReports() {
  return (
    <div className='min-h-screen p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold text-white'>Advanced Analytics</h1>
          <p className='text-sm text-muted'>Performance overview and exportable reports</p>
        </div>
        <div className='flex items-center gap-2'>
          <button onClick={() => window.print()} className='export-btn'>📄 Export PDF</button>
          <button onClick={() => downloadCSV(mockPerformance, 'analytics-report.csv')} className='export-btn'>📊 Export CSV</button>
        </div>
      </div>

      <div className='grid lg:grid-cols-2 gap-6'>
        <div className='panel-bg rounded-2xl p-6 shadow-lg'>
          <div className='grid grid-cols-2 gap-4 text-white'>
            {mockPerformance.slice(0,2).map((m) => (
              <div key={m.label}>
                <div className='text-sm text-muted'>{m.label}</div>
                <div className='text-2xl font-bold mt-1'>{m.value}</div>
                <div className={`text-xs mt-1 ${m.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>{m.delta}</div>
              </div>
            ))}
          </div>
          <div className='mt-6 h-56 panel-muted rounded flex items-center justify-center text-white'>
            {/* Heatmap component renders here */}
            <div className='w-full h-full'>
              <div className='w-full h-full'>
                {/* Lazy-load Heatmap to keep bundle size small */}
                <React.Suspense fallback={<div className='w-full h-full flex items-center justify-center text-white text-sm'>Loading…</div>}>
                    <Heatmap />
                </React.Suspense>
              </div>
            </div>
          </div>
        </div>

        <div className='panel-bg rounded-2xl p-6 shadow-lg text-white'>
          <h3 className='text-sm text-muted'>Response Time</h3>
          <div className='text-2xl font-bold mt-1'>2.1m</div>
          <div className='text-xs text-red-400 mt-1'>↘ -25%</div>

          <div className='mt-6'>
            <h4 className='text-sm text-muted'>Efficiency</h4>
            <div className='text-2xl font-bold mt-1'>98.5%</div>
            <div className='text-xs text-green-400 mt-1'>↗ +5%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
