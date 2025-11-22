(async () => {
  const base = 'http://localhost:4000';
  const adminEmail = process.env.DEV_ADMIN_EMAIL || 'admin@local';
  const adminPw = process.env.DEV_ADMIN_PW || 'Admin123!';

  async function post(path, body, token) {
    const res = await fetch(base + path, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
      body: JSON.stringify(body || {})
    });
    return { status: res.status, body: await res.json() };
  }

  console.log('Logging in as admin:', adminEmail);
  const login = await post('/api/admin/login', { email: adminEmail, password: adminPw });
  console.log('login:', login.status, login.body);
  if (!login.body || !login.body.token) {
    console.error('Admin login failed, aborting tests');
    process.exit(1);
  }
  const token = login.body.token;

  console.log('\nAttempting to create 8 staff accounts (to test tier limits)');
  for (let i = 1; i <= 8; i++) {
    const sid = `staff${i}@example.com`;
    const r = await post('/api/staff/create', { staffId: sid, email: sid, firstName: 'Test', lastName: String(i) }, token);
    console.log(`create ${sid} ->`, r.status, r.body);
  }

  console.log('\nUpgrading subscription to pro');
  const up = await post('/api/admin/subscription', { newTier: 'pro' }, token);
  console.log('upgrade ->', up.status, up.body);

  console.log('\nAttempting to create staff9 after upgrade');
  const r2 = await post('/api/staff/create', { staffId: 'staff9@example.com', email: 'staff9@example.com', firstName: 'X' }, token);
  console.log('create after upgrade ->', r2.status, r2.body);

  console.log('\nFinished test script');
})();
