import React from 'react';

export default function CommunicationHub(){
  return (
    <div className="min-h-screen">
      <div className="panel-bg rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Communication Hub</h2>
          <div className="text-sm text-muted">Real-time messages and notifications</div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="panel-muted p-4 rounded">
            <div className="text-sm text-muted">Channels</div>
            <ul className="mt-3 space-y-2 text-white">
              <li>#general</li>
              <li>#alerts</li>
              <li>#operations</li>
            </ul>
          </div>

          <div className="panel-muted p-4 rounded md:col-span-2">
            <div className="text-sm text-muted">Message Stream</div>
            <div className="mt-3 h-48 overflow-auto bg-black/10 rounded p-3 text-white">
              <div className="text-sm"><span className="font-semibold">System</span> • 1m ago — Daily health check OK</div>
              <div className="text-sm mt-2"><span className="font-semibold">John Smith</span> • 5m ago — Checked in</div>
              <div className="text-sm mt-2"><span className="font-semibold">Sarah Johnson</span> • 8m ago — Resolved alert</div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input className="flex-1 px-3 py-2 rounded bg-white/6 border border-white/10 text-white" placeholder="Type a message..." />
              <button className="px-3 py-2 bg-[var(--primary-500)] rounded text-white">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
