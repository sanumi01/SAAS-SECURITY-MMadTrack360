(async () => {
  // Simple RBAC flow test script using global fetch (Node 18+)
  const base = process.env.BASE || 'http://localhost:4000';
  function out(step, obj) { console.log('STEP:', step); if (obj !== undefined) console.log(JSON.stringify(obj, null, 2)); }
  try {
    // Wait for server to be ready
    let ready = false;
    for (let i=0;i<20;i++){
      try { const r = await fetch(base+'/'); if (r.status===404 || r.status===200) { ready=true; break; } } catch (e) { /* sleep */ }
      await new Promise(r=>setTimeout(r,500));
    }
    if (!ready) { console.error('Server not responding on', base); process.exit(1); }

    // 1) Login as seeded admin
    out('login-admin:request');
    let r = await fetch(base + '/api/admin/login', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ email:'admin@local', password: 'Admin123!' }) });
    const j = await r.json().catch(()=>null);
    out('login-admin:response', j);
    if (!j || !j.token) { console.error('Admin login failed'); process.exit(1); }
    const adminToken = j.token;

    // 2) Create staff guard1
    out('create-staff-as-admin:request');
    r = await fetch(base + '/api/staff/create', { method:'POST', headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + adminToken }, body: JSON.stringify({ staffId:'guard1@example.com', firstName:'Guard', lastName:'One', email:'guard1@example.com' }) });
    const createResp = await r.json().catch(()=>null);
    out('create-staff-as-admin:response', { status: r.status, body: createResp });
    if (!createResp || !createResp.ok) { console.error('Admin create staff failed'); process.exit(1); }
    const tempPassword = createResp.tempPassword || 'A1!';

    // 3) Login as staff guard1
    out('login-staff:request');
    r = await fetch(base + '/api/staff/login', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ staffId:'guard1@example.com', password: tempPassword }) });
    const staffLogin = await r.json().catch(()=>null);
    out('login-staff:response', staffLogin);
    if (!staffLogin || !staffLogin.token) { console.error('Staff login failed'); process.exit(1); }
    const staffToken = staffLogin.token;

    // 4) Attempt to create guard2 with staff token (expect 403)
    out('staff-create-guard2-as-staff:request');
    r = await fetch(base + '/api/staff/create', { method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization': 'Bearer ' + staffToken }, body: JSON.stringify({ staffId:'guard2@example.com' }) });
    let staffCreateResp = null;
    try { staffCreateResp = await r.json(); } catch (e) { staffCreateResp = null; }
    out('staff-create-guard2-as-staff:response', { status: r.status, body: staffCreateResp });
    if (r.status !== 403) { console.error('Expected 403 when staff tries to create staff, got', r.status); process.exit(1); }

    // 5) Assign Supervisor role to guard1 using admin token
    out('assign-role-to-guard1:request');
    r = await fetch(base + '/api/admin/assign-role', { method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization': 'Bearer ' + adminToken }, body: JSON.stringify({ userType:'staff', userId:'guard1@example.com', roleName:'Supervisor' }) });
    const assignResp = await r.json().catch(()=>null);
    out('assign-role-to-guard1:response', { status: r.status, body: assignResp });
    if (!assignResp || !assignResp.ok) { console.error('Assign role failed'); process.exit(1); }

    // 6) Attempt to create guard3 with staff token (should now be allowed because Supervisor has staff.create)
    out('staff-create-guard3-as-staff:request');
    r = await fetch(base + '/api/staff/create', { method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization': 'Bearer ' + staffToken }, body: JSON.stringify({ staffId:'guard3@example.com', firstName:'Guard', lastName:'Three', email:'guard3@example.com' }) });
    const staffCreateResp2 = await r.json().catch(()=>null);
    out('staff-create-guard3-as-staff:response', { status: r.status, body: staffCreateResp2 });
    if (!staffCreateResp2 || !staffCreateResp2.ok) { console.error('Staff should be able to create after role assignment, but failed'); process.exit(1); }

    console.log('RBAC flow test: SUCCESS');
    process.exit(0);
  } catch (e) {
    console.error('Test script error', e);
    process.exit(1);
  }
})();
