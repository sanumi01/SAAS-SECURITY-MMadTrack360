import React, { useEffect, useState } from 'react';

export default function MessageStaff(){
  const [recipients, setRecipients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=>{
    // Try to fetch staff list from backend; fall back to mock
    let cancelled = false;
    (async ()=>{
      try {
        const res = await fetch('/api/staff/list');
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        if (!cancelled) setRecipients(data || []);
      } catch {
        if (!cancelled) setRecipients([{ id:1, name: 'John Smith', email: 'john@example.com'}, { id:2, name: 'Sarah Johnson', email: 'sarah@example.com'}]);
      }
    })();
    return ()=>{ cancelled = true };
  }, []);

  const toggle = (id)=>{
    setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  }

  const submit = async (e)=>{
    e.preventDefault();
    setError(null); setMessage(null);
    if (!text) { setError('Please enter a message.'); return; }
    if (selected.length === 0) { setError('Please select at least one recipient.'); return; }
    setLoading(true);
    try{
      const res = await fetch('/api/staff/message', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ recipients: selected, text }) });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json().catch(()=>({}));
      setMessage(data.message || 'Message queued (mock).');
      setText(''); setSelected([]);
  } catch { setError('Failed to send.'); }
    finally{ setLoading(false); }
  }

  return (
    <div className="min-h-screen">
      <div className="panel-bg rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Message Staff</h2>
        {message && <div className="mb-3 p-3 rounded bg-[rgba(16,185,129,0.12)] text-[var(--primary-200)]">{message}</div>}
        {error && <div className="mb-3 p-3 rounded bg-[rgba(225,29,72,0.08)] text-rose-300">{error}</div>}
        <div className="panel-muted p-4 rounded">
          <div className="text-sm text-muted">Select recipients</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {recipients.map(r => (
              <label key={r.id} className={`p-2 rounded cursor-pointer flex items-center gap-2 ${selected.includes(r.id) ? 'bg-[rgba(37,99,235,0.12)]' : 'bg-white/6'}`}>
                <input type="checkbox" checked={selected.includes(r.id)} onChange={()=>toggle(r.id)} />
                <div className="text-white">{r.name} <div className="text-xs text-muted">{r.email}</div></div>
              </label>
            ))}
          </div>
          <form onSubmit={submit}>
            <textarea value={text} onChange={e=>setText(e.target.value)} className="mt-3 w-full p-3 rounded bg-white/6 border border-white/10 text-white" rows={5} placeholder="Your message" />
            <div className="mt-3 text-right">
              <button type="submit" disabled={loading} className="px-4 py-2 bg-[var(--primary-500)] rounded text-white">{loading ? 'Sending...' : 'Send'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
