// Load environment variables from .env when present (development convenience)
try { require('dotenv').config(); } catch (e) { /* dotenv may not be installed in some environments */ }
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
// Optional AWS SES
let SES;
let sesConfigured = false;
try {
  const AWS = require('aws-sdk');
  const region = process.env.AWS_REGION || process.env.SES_REGION;
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && region && process.env.SES_SENDER) {
    AWS.config.update({ region, accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });
    SES = new AWS.SES({ apiVersion: '2010-12-01' });
    sesConfigured = true;
    console.log('[SES] Configured for region', region);
  } else {
    console.log('[SES] Not configured - using SES stub');
  }
} catch (e) {
  console.log('[SES] aws-sdk not installed or failed to load, using stub');
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Persistent storage (SQLite)
const db = require('./db');
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
const crypto = require('crypto');

function createSession(id, role) {
  const token = crypto.randomBytes(16).toString('hex');
  const expires = Date.now() + SESSION_TTL;
  db.createSession({ token, ownerId: id, role, expires });
  return { token, expires };
}

function validateSessionToken(token) {
  if (!token) return null;
  const s = db.getSession(token);
  if (!s) return null;
  if (s.expires < Date.now()) { db.deleteSession(token); return null; }
  return { id: s.ownerId, role: s.role, expires: s.expires };
}

// RBAC middleware: require a named permission on the caller's assigned roles
function requirePermission(permission) {
  return async (req, res, next) => {
    const auth = req.headers['authorization'];
    const roleHeader = req.headers['x-auth-role'];
    if (!auth || !auth.toLowerCase().startsWith('bearer ')) return res.status(401).json({ message: 'Missing token' });
    const token = auth.slice(7).trim();
    const s = validateSessionToken(token);
    if (!s) return res.status(401).json({ message: 'Invalid token' });
    const userType = s.role === 'admin' ? 'admin' : 'staff';
    req.user = { id: s.id, role: s.role, userType };
    try {
      // If json/sqlite DB supports userHasPermission, use it
      if (typeof db.userHasPermission === 'function') {
        const ok = db.userHasPermission({ userType, userId: s.id, permission });
        if (!ok) return res.status(403).json({ message: 'Forbidden' });
        return next();
      }
      // fallback: deny
      return res.status(403).json({ message: 'Forbidden' });
    } catch (e) {
      console.error('permission check error', e);
      return res.status(500).json({ message: 'Server error' });
    }
  };
}

function invalidateSessionsForId(id) {
  return db.invalidateSessionsForOwner(id);
}

// Helpers
async function hashPassword(pw) {
  const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(pw, salt);
}
async function comparePassword(pw, hash) {
  return bcrypt.compare(pw, hash);
}

// Expanded admin/staff flows with tokens and audit logs (development-only)

function auditLog(action, details) {
  try { db.insertAudit(action, details); } catch (e) { console.log('[AUDIT-FALLBACK]', action, details); }
  console.log('[AUDIT]', { ts: new Date().toISOString(), action, details });
}

// Helper: find staff by email across sqlite or json fallback
function findStaffByEmail(email) {
  if (!email) return null;
  try {
    if (db.db) return db.db.prepare('SELECT * FROM staff WHERE email = ?').get(email);
  } catch (e) {
    // ignore
  }
  // JSON fallback
  if (db._json && Array.isArray(db._json.staff)) return db._json.staff.find(s => s.email === email);
  return null;
}

async function sendEmail(to, subject, html) {
  auditLog('email.enqueue', { to, subject });
  if (sesConfigured && SES) {
    const params = {
      Destination: { ToAddresses: [to] },
      Message: { Body: { Html: { Charset: 'UTF-8', Data: html } }, Subject: { Charset: 'UTF-8', Data: subject } },
      Source: process.env.SES_SENDER,
    };
    try {
      const r = await SES.sendEmail(params).promise();
      auditLog('email.sent', { to, messageId: r.MessageId, template: subject });
      return { ok: true, id: r.MessageId };
    } catch (err) {
      console.error('[SES] send error', err);
      auditLog('email.error', { to, error: String(err) });
      return { ok: false, error: String(err) };
    }
  } else {
    console.log(`[SES-STUB] sendEmail to=${to} subject=${subject}`);
    auditLog('email.stub', { to, subject });
    return { ok: true, stub: true };
  }
}

function adminWelcomeTemplate(admin) {
  return {
    subject: 'Welcome to MMadTrack360 - Admin account created',
    html: `<p>Hi ${admin.firstName || ''},</p><p>Your administrator account has been created. Please sign in to <a href="${process.env.APP_URL || 'http://localhost:4173'}">MMadTrack360</a>.</p>`
  };
}

function staffCreatedTemplate(staffId, password) {
  return {
    subject: 'Your MMadTrack360 account',
    html: `<p>Hello,</p><p>Your staff account <strong>${staffId}</strong> has been created.</p><p>Temporary password: <code>${password}</code></p><p>Please sign in and change your password.</p>`
  };
}

function resetTemplate(token, type) {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:4173'}/reset?token=${token}`;
  return { subject: 'MMadTrack360 password reset', html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>` };
}

// Admin signup - collects profile fields
app.post('/api/admin/signup', async (req, res) => {
  const { firstName, lastName, email, phone, company, address, role: r = 'Administrator', password, acceptTerms } = req.body || {};
  if (!email || !password || !firstName || !lastName) return res.status(400).json({ message: 'Missing required fields' });
  if (!acceptTerms) return res.status(400).json({ message: 'Terms must be accepted' });
  try {
    const existing = db.getAdminByEmail(email);
    if (existing) return res.status(409).json({ message: 'Admin already exists' });
    const ph = await hashPassword(password);
    const adm = db.createAdmin({ email, passwordHash: ph, firstName, lastName, phone, company, address, role: r });
    auditLog('admin.signup', { email });
    return res.json({ ok: true, admin: { id: adm.id, email: adm.email } });
  } catch (err) {
    console.error('signup error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin login with simple rate-limit counter per email (in-memory)
const loginAttempts = {}; // email -> { count, lastTs }
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  const attempts = loginAttempts[email] || { count: 0, lastTs: 0 };
  const now = Date.now();
  if (attempts.count >= 5 && now - attempts.lastTs < 15 * 60 * 1000) return res.status(429).json({ message: 'Too many attempts, try later' });
  const a = db.getAdminByEmail(email);
  if (!a) {
    loginAttempts[email] = { count: attempts.count + 1, lastTs: now };
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const ok = await comparePassword(password, a.passwordHash);
  if (!ok) {
    loginAttempts[email] = { count: attempts.count + 1, lastTs: now };
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // reset attempts
  loginAttempts[email] = { count: 0, lastTs: now };
  auditLog('admin.login', { email });
  // create session token
  const sess = createSession(String(a.id), 'admin');
  return res.json({ role: 'admin', email, token: sess.token, expires: sess.expires });
});

// Admin forgot password: create token + "send" email via SES stub
app.post('/api/admin/forgot', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'Missing email' });
  const a = db.getAdminByEmail(email);
  if (!a) return res.json({ ok: true }); // don't reveal existence
  const token = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
  const expires = Date.now() + 15 * 60 * 1000;
  db.createResetToken({ token, type: 'admin', ownerId: String(a.id), expires });
  const tpl = resetTemplate(token, 'admin');
  sendEmail(email, tpl.subject, tpl.html).then(() => {}).catch(() => {});
  return res.json({ ok: true });
});

// Verify token
app.get('/api/reset/verify/:token', (req, res) => {
  const { token } = req.params;
  const r = db.getResetToken(token);
  if (!r || r.expires < Date.now()) return res.status(400).json({ message: 'Invalid or expired token' });
  return res.json({ ok: true, type: r.type, id: r.ownerId });
});

// Reset password
app.post('/api/reset/complete', async (req, res) => {
  const { token, password } = req.body || {};
  const r = db.getResetToken(token);
  if (!r || r.expires < Date.now()) return res.status(400).json({ message: 'Invalid or expired token' });
  if (!password) return res.status(400).json({ message: 'Missing password' });
  if (r.type === 'admin') {
    const adminId = r.ownerId;
    const admin = db.db.prepare('SELECT * FROM admins WHERE id = ?').get(adminId);
    if (!admin) return res.status(400).json({ message: 'Admin not found' });
    const ph = await hashPassword(password);
    db.db.prepare('UPDATE admins SET passwordHash = ? WHERE id = ?').run(ph, adminId);
    db.deleteResetToken(token);
    // Invalidate sessions for this admin so they must sign in again
    invalidateSessionsForId(String(adminId));
    auditLog('admin.reset', { adminId });
    return res.json({ ok: true });
  } else if (r.type === 'staff') {
    const sid = r.ownerId;
    const s = db.getStaffByStaffId(sid);
    if (!s) return res.status(400).json({ message: 'Staff not found' });
    const ph = await hashPassword(password);
    if (db.db) {
      db.db.prepare('UPDATE staff SET passwordHash = ? WHERE staffId = ?').run(ph, sid);
    } else {
      const js = db._json && Array.isArray(db._json.staff) ? db._json.staff.find(x => x.staffId === sid) : null;
      if (js) { js.passwordHash = ph; if (db && typeof db.persist === 'function') db.persist(); else require('fs').writeFileSync(require('path').join(__dirname, 'data', 'db.json'), JSON.stringify(db._json, null, 2), 'utf8'); }
    }
    db.deleteResetToken(token);
    // Invalidate sessions for this staff so they must sign in again
    invalidateSessionsForId(sid);
    auditLog('staff.reset', { staffId: sid });
    return res.json({ ok: true });
  }
  return res.status(400).json({ message: 'Unknown token type' });
});

// Staff create (admin only) - check header X-Auth-Role=admin for dev stub
app.post('/api/staff/create', requirePermission('staff.create'), async (req, res) => {
  const { staffId, firstName, lastName, email, phone, role: r = 'Guard', password, status = 'Active' } = req.body || {};
  if (!staffId) return res.status(400).json({ message: 'Missing staffId' });
  const exists = db.getStaffByStaffId(staffId);
  if (exists) return res.status(409).json({ message: 'Staff exists' });
  const tempPassword = password && password.length ? password : (Math.random().toString(36).slice(2, 10) + 'A1!');
  const ph = await hashPassword(tempPassword);
  // determine adminId if we have a session
  let adminId = null;
  if (req.user && req.user.role === 'admin' && req.user.id) adminId = req.user.id;
  // enforce subscription staff limits for the admin who is creating the staff
  if (adminId) {
    try {
      // get admin record
      let adminRec = null;
      if (db.db) adminRec = db.db.prepare('SELECT * FROM admins WHERE id = ?').get(Number(adminId));
      else adminRec = db.getAdminByEmail && db.getAdminByEmailById ? db.getAdminByEmailById(adminId) : (db._json && db._json.admins && db._json.admins.find(a => String(a.id) === String(adminId)));
      const tierId = (adminRec && adminRec.subscriptionTier) ? adminRec.subscriptionTier : 'basic';
      const tier = db.getSubscriptionTier ? db.getSubscriptionTier(tierId) : (db._json && db._json.subscription_tiers && db._json.subscription_tiers.find(t => t.id === tierId));
      const countObj = db.countStaffForAdmin(Number(adminId));
      const currentCount = countObj && (countObj.cnt || countObj.cnt === 0) ? countObj.cnt : (Array.isArray(db._json && db._json.staff) ? db._json.staff.filter(s => String(s.adminId) === String(adminId)).length : 0);
      const staffLimit = tier && (tier.staffLimit >= 0) ? tier.staffLimit : -1;
      if (staffLimit >= 0 && currentCount >= staffLimit) {
        return res.status(403).json({ message: `Staff limit reached for tier ${tierId}` });
      }
    } catch (e) {
      console.error('staff limit check error', e);
    }
  }
  db.createStaff({ staffId, adminId: adminId ? Number(adminId) : null, email, firstName, lastName, phone, role: r, status, passwordHash: ph });
  auditLog('staff.create', { staffId, createdBy: adminId || (req.user && req.user.isDev ? 'dev' : (req.user && req.user.id) || null) });
  if (email) {
    const tpl = staffCreatedTemplate(staffId, tempPassword);
    sendEmail(email, tpl.subject, tpl.html).then(() => {}).catch(() => {});
  }
  return res.json({ ok: true, tempPassword: tempPassword });
});

// Admin: update staff profile
app.post('/api/staff/update', requirePermission('staff.update'), async (req, res) => {
  const { staffId, firstName, lastName, email, phone, role: r, status } = req.body || {};
  if (!staffId) return res.status(400).json({ message: 'Missing staffId' });
  const existing = db.getStaffByStaffId(staffId);
  if (!existing) return res.status(404).json({ message: 'Staff not found' });
  try {
    if (db.db) {
      const upd = db.db.prepare('UPDATE staff SET firstName = COALESCE(?, firstName), lastName = COALESCE(?, lastName), email = COALESCE(?, email), phone = COALESCE(?, phone), role = COALESCE(?, role), status = COALESCE(?, status) WHERE staffId = ?');
      upd.run(firstName, lastName, email, phone, r, status, staffId);
    } else {
      const s = db._json.staff.find(x => x.staffId === staffId);
      if (s) {
        if (firstName !== undefined) s.firstName = firstName;
        if (lastName !== undefined) s.lastName = lastName;
        if (email !== undefined) s.email = email;
        if (phone !== undefined) s.phone = phone;
        if (r !== undefined) s.role = r;
        if (status !== undefined) s.status = status;
        // persist
        if (db && typeof db.persist === 'function') db.persist(); else require('fs').writeFileSync(require('path').join(__dirname, 'data', 'db.json'), JSON.stringify(db._json, null, 2), 'utf8');
      }
    }
  auditLog('staff.update', { staffId, updatedBy: (req.user && req.user.isDev ? 'dev' : (req.user && req.user.id) || null) });
    const updated = db.getStaffByStaffId(staffId);
    return res.json({ ok: true, staff: updated });
  } catch (e) {
    console.error('staff.update error', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: suspend/unsuspend staff
app.post('/api/staff/suspend', requirePermission('staff.suspend'), (req, res) => {
  const { staffId, suspend } = req.body || {};
  if (!staffId) return res.status(400).json({ message: 'Missing staffId' });
  const existing = db.getStaffByStaffId(staffId);
  if (!existing) return res.status(404).json({ message: 'Staff not found' });
  try {
    if (db.db) db.db.prepare('UPDATE staff SET status = ? WHERE staffId = ?').run(suspend ? 'Suspended' : 'Active', staffId);
    else {
      const s = db._json.staff.find(x => x.staffId === staffId);
      if (s) { s.status = suspend ? 'Suspended' : 'Active'; if (db && typeof db.persist === 'function') db.persist(); else require('fs').writeFileSync(require('path').join(__dirname, 'data', 'db.json'), JSON.stringify(db._json, null, 2), 'utf8'); }
    }
  auditLog('staff.suspend', { staffId, suspend, updatedBy: (req.user && req.user.isDev ? 'dev' : (req.user && req.user.id) || null) });
    const updated = db.getStaffByStaffId(staffId);
    return res.json({ ok: true, status: updated.status });
  } catch (e) {
    console.error('staff.suspend error', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: trigger staff reset (sends reset email)
app.post('/api/admin/staff-reset', requirePermission('staff.reset'), (req, res) => {
  const { staffId } = req.body || {};
  if (!staffId) return res.status(400).json({ message: 'Missing staffId' });
  const s = db.getStaffByStaffId(staffId);
  if (!s) return res.status(404).json({ message: 'Staff not found' });
  const email = s.email;
  const token = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
  const expires = Date.now() + 15 * 60 * 1000;
  db.createResetToken({ token, type: 'staff', ownerId: staffId, expires });
  // Invalidate any sessions for this staff member so they are forced to re-login
  invalidateSessionsForId(staffId);
  if (email) {
    const tpl = resetTemplate(token, 'staff');
    sendEmail(email, tpl.subject, tpl.html).then(() => {}).catch(() => {});
  }
  auditLog('admin.staff.reset', { staffId, by: (req.user && req.user.isDev ? 'dev' : (req.user && req.user.id) || null) });
  // In development show the token in the response to make testing easier
  const devReveal = process.env.DEV_RETURN_RESET_TOKEN === '1';
  if (devReveal) return res.json({ ok: true, token });
  return res.json({ ok: true });
});

// Admin: assign role to a user (admin or staff)
app.post('/api/admin/assign-role', requirePermission('role.assign'), (req, res) => {
  const { userType, userId, roleName } = req.body || {};
  if (!userType || !userId || !roleName) return res.status(400).json({ message: 'Missing fields' });
  try {
    if (typeof db.assignRoleToUser === 'function') {
      const ok = db.assignRoleToUser({ userType, userId: String(userId), roleName });
      if (!ok) return res.status(400).json({ message: 'Invalid role or user' });
      auditLog('admin.role.assign', { by: (req.user && req.user.isDev ? 'dev' : (req.user && req.user.id) || null), userType, userId, roleName });
      return res.json({ ok: true });
    }
    return res.status(500).json({ message: 'RBAC not supported' });
  } catch (e) {
    console.error('assign-role error', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Staff list
app.get('/api/admin/staff-list', requirePermission('staff.list'), (req, res) => {
  // return all staff for now (pagination/filtering later)
  try {
    let list = [];
    if (db.db) {
      list = db.db.prepare('SELECT staffId, email, firstName, lastName, role, status, lastLogin FROM staff ORDER BY createdAt DESC').all();
    } else if (db._json && Array.isArray(db._json.staff)) {
      list = db._json.staff.map(s => ({ staffId: s.staffId, email: s.email, firstName: s.firstName, lastName: s.lastName, role: s.role, status: s.status, lastLogin: s.lastLogin }));
    }
    return res.json({ list });
  } catch (e) {
    console.error('staff-list error', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update subscription tier for current admin (or adminId in body)
app.post('/api/admin/subscription', requirePermission('admin.subscription.change'), (req, res) => {
  let adminId = null;
  if (req.user && req.user.role === 'admin' && req.user.id) adminId = req.user.id;
  // allow dev header (req.user.isDev true) to pass through with adminId null
  const { newTier } = req.body || {};
  if (!newTier) return res.status(400).json({ message: 'Missing newTier' });
  const tier = db.getSubscriptionTier ? db.getSubscriptionTier(newTier) : (db._json && db._json.subscription_tiers && db._json.subscription_tiers.find(t => t.id === newTier));
  if (!tier) return res.status(400).json({ message: 'Invalid tier' });
  try {
    if (db.db) db.db.prepare('UPDATE admins SET subscriptionTier = ? WHERE id = ?').run(newTier, Number(adminId));
    else {
      const a = db._json.admins.find(x => String(x.id) === String(adminId));
      if (a) { a.subscriptionTier = newTier; if (db && typeof db.persist === 'function') db.persist(); else require('fs').writeFileSync(require('path').join(__dirname, 'data', 'db.json'), JSON.stringify(db._json, null, 2), 'utf8'); }
    }
    auditLog('admin.subscription.change', { adminId, newTier });
    return res.json({ ok: true, newTier });
  } catch (e) {
    console.error('subscription change error', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Staff login
app.post('/api/staff/login', async (req, res) => {
  const { staffId, password } = req.body || {};
  if (!staffId || !password) return res.status(400).json({ message: 'Missing fields' });
  const s = db.getStaffByStaffId(staffId);
  if (process.env.DEBUG_RBAC_TESTS === '1') console.log('[DEBUG] staff.login attempt', { staffId, found: !!s });
  if (!s) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await comparePassword(password, s.passwordHash);
  if (process.env.DEBUG_RBAC_TESTS === '1') console.log('[DEBUG] password compare', { staffId, ok });
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  try {
    if (db.db) db.db.prepare('UPDATE staff SET lastLogin = ? WHERE staffId = ?').run(Date.now(), staffId);
    else {
      const js = db._json.staff.find(x => x.staffId === staffId);
      if (js) { js.lastLogin = Date.now(); if (db && typeof db.persist === 'function') db.persist(); else require('fs').writeFileSync(require('path').join(__dirname, 'data', 'db.json'), JSON.stringify(db._json, null, 2), 'utf8'); }
    }
  } catch (e) { /* ignore write errors */ }
  auditLog('staff.login', { staffId });
  const sess = createSession(staffId, 'staff');
  return res.json({ role: 'staff', staffId, token: sess.token, expires: sess.expires });
});

// Logout (invalidate single session token)
app.post('/api/logout', (req, res) => {
  const auth = req.headers['authorization'];
  if (!auth || !auth.toLowerCase().startsWith('bearer ')) return res.status(400).json({ message: 'Missing token' });
  const token = auth.slice(7).trim();
  try { db.deleteSession(token); auditLog('session.logout', { token: token.slice(0,6) + '...' }); } catch (e) { /* ignore */ }
  return res.json({ ok: true });
});

// Staff forgot - create token
app.post('/api/staff/forgot', (req, res) => {
  const { staffId, email } = req.body || {};
  let id = staffId;
  if (!id && email) {
    const found = findStaffByEmail(email);
    id = found && found.staffId;
  }
  if (!id) return res.json({ ok: true });
  const s = db.getStaffByStaffId(id);
  if (!s) return res.json({ ok: true });
  const token = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
  const expires = Date.now() + 15 * 60 * 1000;
  db.createResetToken({ token, type: 'staff', ownerId: id, expires });
  const tpl = resetTemplate(token, 'staff');
  const targetEmail = s.email;
  if (targetEmail) sendEmail(targetEmail, tpl.subject, tpl.html).then(() => {}).catch(() => {});
  return res.json({ ok: true });
});

const port = process.env.PORT || 4000;
// ensure at least one admin exists for local development
function ensureInitialAdmin() {
  try {
    let anyAdmin = null;
    if (db.db) {
      const row = db.db.prepare('SELECT id, email FROM admins LIMIT 1').get();
      anyAdmin = row;
    } else if (db._json && Array.isArray(db._json.admins) && db._json.admins.length) {
      anyAdmin = db._json.admins[0];
    }
    // ensure existing admin has Administrator role in RBAC mapping
    if (anyAdmin && typeof db.assignRoleToUser === 'function') {
      try {
        const uid = String(anyAdmin.id || anyAdmin.id);
        let has = [];
        if (typeof db.getUserRoles === 'function') has = db.getUserRoles({ userType: 'admin', userId: uid }) || [];
        else if (db._json && Array.isArray(db._json.user_roles)) has = db._json.user_roles.filter(ur => ur.userType === 'admin' && String(ur.userId) === uid).map(ur => ur.roleId);
        if (!has || (Array.isArray(has) && has.length === 0)) {
          try { db.assignRoleToUser({ userType: 'admin', userId: uid, roleName: 'Administrator' }); auditLog('admin.role.assign', { adminId: anyAdmin.id, role: 'Administrator' }); } catch (e) { /* ignore */ }
        }
      } catch (e) { /* ignore */ }
    }
    if (!anyAdmin) {
      const pw = process.env.DEV_ADMIN_PW || 'Admin123!';
      const email = process.env.DEV_ADMIN_EMAIL || 'admin@local';
      (async () => {
        const ph = await hashPassword(pw);
        const adm = db.createAdmin({ email, passwordHash: ph, firstName: 'Dev', lastName: 'Admin' });
        console.log(`[DEV] created initial admin ${email} with password ${pw}`);
        auditLog('admin.seed', { email });
        try {
          if (typeof db.assignRoleToUser === 'function') {
            db.assignRoleToUser({ userType: 'admin', userId: String(adm.id), roleName: 'Administrator' });
            auditLog('admin.role.assign', { adminId: adm.id, role: 'Administrator' });
          }
        } catch (e) { console.error('assign role error', e); }
      })();
    }
  } catch (e) { console.error('ensureInitialAdmin error', e); }
}

ensureInitialAdmin();

// Export app for in-process testing or external runners
try { module.exports = app; } catch (e) { /* ignore if not allowed */ }

// Only start the HTTP listener when this file is run directly.
if (require.main === module) {
  app.listen(port, () => console.log('Dev stub server listening on', port));
}
