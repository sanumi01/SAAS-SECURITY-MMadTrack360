// Simple CLI test for RBAC flow
// Steps:
// 1) admin login
// 2) admin creates staff guard1 -> receives tempPassword
// 3) staff logs in with tempPassword
// 4) staff (without Supervisor role) attempts to create guard2 -> expect 403
// 5) admin assigns Supervisor role to guard1
// 6) staff retries create guard2 -> expect success

const fetch = globalThis.fetch || require('node-fetch');

// NOTE: test runner controls DEV flags; do not modify server globals here

// Try to start the server in-process (when `index.js` exports the Express app).
// This avoids external process management and makes the test more reliable locally.
let _inProcServer = null;
try {
  const app = require('../index');
  if (app && typeof app.listen === 'function') {
    // start on ephemeral port
    _inProcServer = app.listen(0);
    const p = _inProcServer.address().port;
    process.env.BASE_URL = `http://localhost:${p}`;
    console.log('[TEST] started in-process server on port', p);
  }
} catch (e) {
  // ignore - server may already be running externally
}

const BASE = process.env.BASE_URL || 'http://localhost:4000';
async function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function retry(fn, attempts = 30, delay = 200) {
  for (let i = 0; i < attempts; ++i) {
    try { return await fn(); } catch (e) { if (i === attempts - 1) throw e; await wait(delay); }
  }
}

async function post(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const r = await fetch(BASE + path, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { json = { _raw: text }; }
  return { status: r.status, body: json };
}

async function get(path, token) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const r = await fetch(BASE + path, { method: 'GET', headers });
  const json = await r.json().catch(()=>null);
  return { status: r.status, body: json };
}

async function main(){
  console.log('RBAC CLI test starting, base=', BASE);
  const RUN_ID = Date.now();
  const STAFF_A = `guardA.${RUN_ID}@example.com`;
  const STAFF_B = `guardB.${RUN_ID}@example.com`;

  // Wait for server to be responsive by retrying admin login
  const adminLogin = await retry(async ()=>{
    const r = await post('/api/admin/login', { email: 'admin@local', password: 'Admin123!' });
    if (r.status !== 200) throw new Error('admin login not ready: ' + r.status + ' ' + JSON.stringify(r.body));
    return r.body;
  }, 60, 500);

  const adminToken = adminLogin.token;
  console.log('Admin logged in, token=', adminToken && adminToken.slice(0,8) + '...');

  // 2) create guard1
  const create1 = await post('/api/staff/create', { staffId: STAFF_A, firstName: 'Guard', lastName: 'One', email: STAFF_A }, adminToken);
  console.log('Create guard1 status=', create1.status, create1.body);
  let tempPassword = null;
  if (create1.status === 200 || create1.status === 201) {
    tempPassword = create1.body && create1.body.tempPassword;
    if (!tempPassword) { console.error('No tempPassword returned'); if (_inProcServer) _inProcServer.close(); process.exit(1); }
  } else if (create1.status === 409) {
    // staff already exists; trigger a reset to set a known password (dev-only: token returned)
    console.log('Staff exists; requesting reset token for', STAFF_A);
    const resetResp = await post('/api/admin/staff-reset', { staffId: STAFF_A }, adminToken);
    console.log('Reset response', resetResp.status, resetResp.body);
    if (resetResp.status !== 200 || !resetResp.body || !resetResp.body.token) { console.error('Failed to obtain reset token for existing staff'); if (_inProcServer) _inProcServer.close(); process.exit(1); }
    const token = resetResp.body.token;
    // complete reset with a known password
    const newPw = 'TempPass123!';
    const complete = await post('/api/reset/complete', { token, password: newPw });
    console.log('Reset complete', complete.status, complete.body);
    if (complete.status !== 200) { console.error('Failed to complete reset for existing staff'); if (_inProcServer) _inProcServer.close(); process.exit(1); }
    tempPassword = newPw;
  } else {
    console.error('Failed to create guard1'); if (_inProcServer) _inProcServer.close(); process.exit(1);
  }
  console.log('guard1 tempPassword=', tempPassword);

  // 3) staff logs in
  const staffLogin = await post('/api/staff/login', { staffId: STAFF_A, password: tempPassword });
  console.log('Staff login status=', staffLogin.status, staffLogin.body);
  if (staffLogin.status !== 200) { console.error('Staff login failed'); if (_inProcServer) _inProcServer.close(); process.exit(1); }
  const staffToken = staffLogin.body.token;

  // 4) staff attempts to create guard2 -> expect 403
  const create2_by_staff = await post('/api/staff/create', { staffId: STAFF_B, firstName: 'Guard', lastName: 'Two', email: STAFF_B }, staffToken);
  console.log('Staff create guard2 (should be 403) status=', create2_by_staff.status, create2_by_staff.body);
  if (create2_by_staff.status !== 403) { console.error('Expected 403 when staff creates user, got', create2_by_staff.status); if (_inProcServer) _inProcServer.close(); process.exit(1); }

  // 5) admin assigns Supervisor role to guard1
  const assign = await post('/api/admin/assign-role', { userType: 'staff', userId: STAFF_A, roleName: 'Supervisor' }, adminToken);
  console.log('Assign role status=', assign.status, assign.body);
  if (assign.status !== 200) { console.error('Assign role failed'); if (_inProcServer) _inProcServer.close(); process.exit(1); }

  // 6) staff retries creating guard2 -> expect allowed
  const create2_after = await post('/api/staff/create', { staffId: STAFF_B, firstName: 'Guard', lastName: 'Two', email: STAFF_B }, staffToken);
  console.log('Staff create guard2 after role assign status=', create2_after.status, create2_after.body);
  if (create2_after.status !== 200) { console.error('Expected success after role assign, got', create2_after.status); if (_inProcServer) _inProcServer.close(); process.exit(1); }

  console.log('RBAC CLI test completed successfully');
  if (_inProcServer) _inProcServer.close();
  process.exit(0);
}

main().catch(err => { console.error('Test error', err); if (_inProcServer) _inProcServer.close(); process.exit(1); });
