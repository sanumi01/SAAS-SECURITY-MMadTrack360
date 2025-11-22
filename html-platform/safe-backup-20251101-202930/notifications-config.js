const API_BASE = 'http://localhost:4000';
async function sendEmail(to, templateName, data) {
try {
const res = await fetch(API_BASE + '/api/notifications/email', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ to, templateName, data }) });
if (!res.ok) throw new Error('Email send failed'); return await res.json();
} catch(e){ console.error('sendEmail error:', e); alert('Email send failed (check API)'); }
}
async function sendSMS(to, templateNameOrText, data) {
try {
const res = await fetch(API_BASE + '/api/notifications/sms', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ to, templateNameOrText, data }) });
if (!res.ok) throw new Error('SMS send failed'); return await res.json();
} catch(e){ console.error('sendSMS error:', e); alert('SMS send failed (check API)'); }
}
