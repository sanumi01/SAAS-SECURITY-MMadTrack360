import React, { useEffect, useState } from 'react';

// Simple CSS-grid heatmap component with remote fetch fallback
export default function Heatmap({ api = '/api/analytics/heatmap' }){
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load(){
      try{
        const res = await fetch(api);
        if(!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        if(mounted) setGrid(data);
      } catch {
        // fallback mock data: 7x24 values (days x hours)
        const mock = Array.from({length:7}).map(() => Array.from({length:24}).map(() => Math.round(Math.random()*100)));
        if(mounted) setGrid(mock);
      }
    }
    load();
    return () => { mounted = false; }
  },[api]);

  if(!grid) return <div className="w-full h-full flex items-center justify-center text-white text-sm">Loading heatmap…</div>;

  // compute min/max
  let min = Infinity, max = -Infinity;
  grid.forEach(row => row.forEach(v => { if(v<min) min=v; if(v>max) max=v; }));

  const colorFor = (v)=>{
    const t = (v - min) / (max - min || 1);
    // blue -> green gradient
    const r = Math.round(30 + (90 * (1 - t)));
    const g = Math.round(60 + (170 * t));
    const b = Math.round(114 + (40 * (1 - t)));
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="grid" style={{gridTemplateColumns: `repeat(${grid[0].length}, minmax(0,1fr))`, gap:4}}>
        {grid.map((row,ri) => (
          <div key={ri} className="flex w-full" style={{gap:4}}>
            {row.map((v,ci)=> (
              <div key={ci} title={`${v}`} style={{flex:1, height:12, background: colorFor(v), borderRadius:4}} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-muted">Heatmap: activity intensity (dark = low, bright = high)</div>
    </div>
  );
}
