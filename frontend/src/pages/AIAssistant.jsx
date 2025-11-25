import React, { useState } from 'react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hello! I\'m your AI Security Assistant. How can I help optimize your operations today?' }
  ]);
  const [input, setInput] = useState('');

  function sendMessage() {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: 'user', text: input }]);
    // mock AI reply
    setTimeout(() => setMessages((m) => [...m, { from: 'ai', text: 'Thanks — I recommend adding 1 staff during 02:00-06:00 to cover a detected 23% gap.' }]), 800);
    setInput('');
  }

  return (
    <div className='min-h-screen p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-semibold text-white'>AI Security Assistant</h1>
        <p className='text-sm text-slate-200'>AI Online • Smart Recommendations</p>
      </div>

      <div className='grid lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 panel-bg rounded-2xl p-6 shadow-lg'>
          <div className='space-y-4'>
            {messages.map((m, i) => (
              <div key={i} className={`p-3 rounded ${m.from === 'ai' ? 'bg-white/10 text-slate-200' : 'bg-white/6 text-white'}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className='mt-4 flex gap-2'>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder='Ask about schedules, predictions, or optimizations...' className='flex-1 px-3 py-2 rounded bg-white/6 text-white border border-white/10' />
            <button onClick={sendMessage} className='px-3 py-2 rounded bg-white/10 text-white'>Send</button>
          </div>
        </div>

        <div className='panel-bg rounded-2xl p-6 shadow-lg'>
          <h3 className='text-sm text-slate-500'>Smart Recommendations</h3>
          <div className='mt-3 space-y-3'>
            <div className='p-3 bg-white/6 rounded'>
              <div className='font-medium text-white/90'>Optimize Night Shift Coverage</div>
              <div className='text-xs text-white/75'>AI detected 23% coverage gap during 2-6 AM. Recommend adding 1 additional staff member.</div>
              <div className='text-xs mt-1 text-white/70'>Confidence: 94% • Impact: High</div>
            </div>
            <div className='p-3 bg-white/6 rounded'>
              <div className='font-medium text-white/90'>Peak Activity Forecast</div>
              <div className='text-xs text-white/75'>Historical data suggests 40% increase in incidents on Friday evenings.</div>
              <div className='text-xs mt-1 text-white/70'>Confidence: 87% • Impact: Medium</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
