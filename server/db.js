const path = require('path');
const fs = require('fs');
let db = null;
let usingSqlite = false;
try {
  const Database = require('better-sqlite3');
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, 'database.sqlite');
  const sdb = new Database(dbPath);
  usingSqlite = true;
  db = sdb;
  // Initialize schema for sqlite
  const initSql = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  firstName TEXT,
  lastName TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  role TEXT DEFAULT 'Administrator',
  subscriptionTier TEXT DEFAULT 'basic',
  createdAt INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staffId TEXT UNIQUE NOT NULL,
  adminId INTEGER,
  email TEXT,
  firstName TEXT,
  lastName TEXT,
  phone TEXT,
  role TEXT,
  status TEXT DEFAULT 'Active',
  passwordHash TEXT,
  createdAt INTEGER DEFAULT (strftime('%s','now')),
  lastLogin INTEGER,
  FOREIGN KEY(adminId) REFERENCES admins(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  ownerId TEXT NOT NULL,
  role TEXT NOT NULL,
  expires INTEGER NOT NULL,
  createdAt INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS reset_tokens (
  token TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  ownerId TEXT NOT NULL,
  expires INTEGER NOT NULL,
  createdAt INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL DEFAULT (datetime('now')),
  action TEXT NOT NULL,
  details TEXT
);

CREATE TABLE IF NOT EXISTS subscription_tiers (
  id TEXT PRIMARY KEY,
  staffLimit INTEGER,
  durationDays INTEGER,
  price TEXT
);

-- RBAC tables
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  roleId INTEGER NOT NULL,
  permissionId INTEGER NOT NULL,
  PRIMARY KEY(roleId, permissionId),
  FOREIGN KEY(roleId) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY(permissionId) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_roles (
  userType TEXT NOT NULL, -- 'admin' | 'staff'
  userId TEXT NOT NULL,
  roleId INTEGER NOT NULL,
  PRIMARY KEY(userType, userId, roleId),
  FOREIGN KEY(roleId) REFERENCES roles(id) ON DELETE CASCADE
);
`;
  sdb.exec(initSql);
  // Seed tiers
  const seedTiers = sdb.prepare('INSERT OR IGNORE INTO subscription_tiers (id, staffLimit, durationDays, price) VALUES (?, ?, ?, ?)');
  seedTiers.run('basic', 6, 14, '0');
  seedTiers.run('pro', 30, 30, '19.99');
  seedTiers.run('advance3', 70, 90, '49.99');
  seedTiers.run('advance6', 70, 180, '99.99');
  seedTiers.run('enterprise', -1, null, 'custom');
  // Seed default RBAC roles and permissions
  const seedRole = sdb.prepare('INSERT OR IGNORE INTO roles (name) VALUES (?)');
  const seedPerm = sdb.prepare('INSERT OR IGNORE INTO permissions (name) VALUES (?)');
  const getRole = sdb.prepare('SELECT id FROM roles WHERE name = ?');
  const getPerm = sdb.prepare('SELECT id FROM permissions WHERE name = ?');
  const grant = sdb.prepare('INSERT OR IGNORE INTO role_permissions (roleId, permissionId) VALUES (?, ?)');
  const defaultRoles = ['Administrator', 'Supervisor', 'Auditor', 'Guard'];
  const defaultPerms = ['staff.create','staff.update','staff.suspend','staff.reset','admin.subscription.change','staff.list','role.assign'];
  for (const r of defaultRoles) seedRole.run(r);
  for (const p of defaultPerms) seedPerm.run(p);
  // map perms to roles
  const roleAdmin = getRole.get('Administrator').id;
  const roleSupervisor = getRole.get('Supervisor').id;
  const roleAuditor = getRole.get('Auditor').id;
  const roleGuard = getRole.get('Guard').id;
  // grant broad perms to Administrator
  for (const p of defaultPerms) {
    const pid = getPerm.get(p).id; grant.run(roleAdmin, pid);
  }
  // Supervisor: create/update/suspend + list
  ['staff.create','staff.update','staff.suspend','staff.list'].forEach(p => { const pid = getPerm.get(p).id; grant.run(roleSupervisor, pid); });
  // Auditor: list
  { const pid = getPerm.get('staff.list').id; grant.run(roleAuditor, pid); }
} catch (err) {
  // Fallback to JSON-file store if better-sqlite3 isn't available
  const jsonDbPath = path.join(__dirname, 'data', 'db.json');
  if (!fs.existsSync(path.dirname(jsonDbPath))) fs.mkdirSync(path.dirname(jsonDbPath), { recursive: true });
  let data = { admins: [], staff: [], sessions: [], reset_tokens: [], audit_logs: [], subscription_tiers: [], roles: [], permissions: [], role_permissions: [], user_roles: [] };
  if (fs.existsSync(jsonDbPath)) {
    try { data = JSON.parse(fs.readFileSync(jsonDbPath, 'utf8') || '{}'); } catch (e) { /* ignore parse errors */ }
  }
  // Ensure arrays exist even if the on-disk DB was created before RBAC fields were added
  data.admins = data.admins || [];
  data.staff = data.staff || [];
  data.sessions = data.sessions || [];
  data.reset_tokens = data.reset_tokens || [];
  data.audit_logs = data.audit_logs || [];
  data.subscription_tiers = data.subscription_tiers || [];
  data.roles = data.roles || [];
  data.permissions = data.permissions || [];
  data.role_permissions = data.role_permissions || [];
  data.user_roles = data.user_roles || [];
  // ensure tiers
  const defaultTiers = [
    { id: 'basic', staffLimit: 6, durationDays: 14, price: '0' },
    { id: 'pro', staffLimit: 30, durationDays: 30, price: '19.99' },
    { id: 'advance3', staffLimit: 70, durationDays: 90, price: '49.99' },
    { id: 'advance6', staffLimit: 70, durationDays: 180, price: '99.99' },
    { id: 'enterprise', staffLimit: -1, durationDays: null, price: 'custom' }
  ];
  for (const t of defaultTiers) {
    if (!data.subscription_tiers.find(x => x.id === t.id)) data.subscription_tiers.push(t);
  }
  // ensure RBAC defaults
  const defaultRoles = ['Administrator', 'Supervisor', 'Auditor', 'Guard'];
  const defaultPerms = ['staff.create','staff.update','staff.suspend','staff.reset','admin.subscription.change','staff.list','role.assign'];
  for (const r of defaultRoles) if (!data.roles.find(x => x.name === r)) data.roles.push({ id: (data.roles.reduce((m,a)=>Math.max(m, a.id||0),0)||0)+1, name: r });
  for (const p of defaultPerms) if (!data.permissions.find(x => x.name === p)) data.permissions.push({ id: (data.permissions.reduce((m,a)=>Math.max(m, a.id||0),0)||0)+1, name: p });
  // populate role_permissions mapping
  function ensureRolePerm(roleName, permName) {
    const role = data.roles.find(r => r.name === roleName);
    const perm = data.permissions.find(p => p.name === permName);
    if (role && perm && !data.role_permissions.find(rp => rp.roleId === role.id && rp.permissionId === perm.id)) data.role_permissions.push({ roleId: role.id, permissionId: perm.id });
  }
  // grant everything to Administrator
  for (const p of defaultPerms) ensureRolePerm('Administrator', p);
  ['staff.create','staff.update','staff.suspend','staff.list'].forEach(p => ensureRolePerm('Supervisor', p));
  ensureRolePerm('Auditor', 'staff.list');
  // helper to persist (async, debounced)
  const DEBOUNCE_MS = Number(process.env.DB_PERSIST_DEBOUNCE_MS) || 250;
  let pendingWrite = null;
  function save() {
    if (pendingWrite) clearTimeout(pendingWrite);
    pendingWrite = setTimeout(() => {
      fs.writeFile(jsonDbPath, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) console.error('[DB] write error', err);
        pendingWrite = null;
      });
    }, DEBOUNCE_MS);
  }
  // periodic flush: optional regular flush to disk to reduce window
  // of in-memory-only changes; set via DB_PERSIST_PERIODIC_FLUSH_MS (ms).
  const PERIODIC_FLUSH_MS = Number(process.env.DB_PERSIST_PERIODIC_FLUSH_MS) || 0;
  let _periodicFlushHandle = null;
  function startPeriodicFlush() {
    if (PERIODIC_FLUSH_MS > 0 && !_periodicFlushHandle) {
      _periodicFlushHandle = setInterval(() => {
        try {
          // If there's a pending debounced write, flush immediately to ensure
          // changes hit disk regularly. Otherwise, trigger a save which will
          // schedule a debounced write.
          if (pendingWrite) {
            flushSync();
          } else {
            save();
          }
        } catch (e) {
          console.error('[DB] periodic flush error', e);
        }
      }, PERIODIC_FLUSH_MS);
    }
  }
  function flushSync() {
    if (pendingWrite) { clearTimeout(pendingWrite); pendingWrite = null; }
    try { fs.writeFileSync(jsonDbPath, JSON.stringify(data, null, 2), 'utf8'); } catch (e) { console.error('[DB] flush error', e); }
  }
  // ensure writes are flushed on exit/termination
  try {
    process.on('exit', () => flushSync());
    process.on('SIGINT', () => { flushSync(); process.exit(); });
    process.on('SIGTERM', () => { flushSync(); process.exit(); });
  } catch (e) { /* ignore if signals not supported in environment */ }
  // start periodic flush if requested
  try { startPeriodicFlush(); } catch (e) { /* ignore */ }
  db = {
    _json: data,
    db: null,
    // expose persist/flush for callers
    persist: function () { save(); },
    flush: function () { flushSync(); },
    // RBAC helpers for JSON fallback
    getRoleByName: function (name) { return this._json.roles.find(r => r.name === name); },
    createRole: function (name) { if (this.getRoleByName(name)) return this.getRoleByName(name); const id = (this._json.roles.reduce((m,a)=>Math.max(m,a.id||0),0)||0)+1; const r = { id, name }; this._json.roles.push(r); save(); return r; },
    createPermission: function (name) { if (this._json.permissions.find(p=>p.name===name)) return this._json.permissions.find(p=>p.name===name); const id = (this._json.permissions.reduce((m,a)=>Math.max(m,a.id||0),0)||0)+1; const p = { id, name }; this._json.permissions.push(p); save(); return p; },
    grantPermissionToRole: function (roleName, permName) { const role = this.getRoleByName(roleName); const perm = this._json.permissions.find(p=>p.name===permName); if (!role || !perm) return false; if (!this._json.role_permissions.find(rp=>rp.roleId===role.id && rp.permissionId===perm.id)) { this._json.role_permissions.push({ roleId: role.id, permissionId: perm.id }); save(); } return true; },
    assignRoleToUser: function ({ userType, userId, roleName }) { const role = this.getRoleByName(roleName); if (!role) return false; if (!this._json.user_roles.find(ur=>ur.userType===userType && String(ur.userId)===String(userId) && ur.roleId===role.id)) { this._json.user_roles.push({ userType, userId: String(userId), roleId: role.id }); save(); } return true; },
    getUserRoles: function ({ userType, userId }) { const u = this._json.user_roles.filter(ur => ur.userType === userType && String(ur.userId) === String(userId)); return u.map(ur => this._json.roles.find(r => r.id === ur.roleId)).filter(Boolean); },
    userHasPermission: function ({ userType, userId, permission }) { const roles = this.getUserRoles({ userType, userId }); if (!roles || !roles.length) return false; const perm = this._json.permissions.find(p=>p.name===permission); if (!perm) return false; return this._json.role_permissions.some(rp => roles.some(r => r.id === rp.roleId) && rp.permissionId === perm.id); },
    createAdmin: function ({ email, passwordHash, firstName, lastName, phone, company, address, role = 'Administrator' }) {
      const id = (this._json.admins.reduce((m, a) => Math.max(m, a.id || 0), 0) || 0) + 1;
      const adm = { id, email, passwordHash, firstName, lastName, phone, company, address, role, subscriptionTier: 'basic', createdAt: Date.now() };
      this._json.admins.push(adm); save(); return adm;
    },
    getAdminByEmail: function (email) { return this._json.admins.find(a => a.email === email); },
    createStaff: function ({ staffId, adminId = null, email = null, firstName = null, lastName = null, phone = null, role = 'Guard', status = 'Active', passwordHash = null }) {
      const id = (this._json.staff.reduce((m, s) => Math.max(m, s.id || 0), 0) || 0) + 1;
      const s = { id, staffId, adminId, email, firstName, lastName, phone, role, status, passwordHash, createdAt: Date.now(), lastLogin: null };
      this._json.staff.push(s); save(); return s;
    },
    getStaffByStaffId: function (staffId) { return this._json.staff.find(s => s.staffId === staffId); },
    listStaffForAdmin: function (adminId) { return this._json.staff.filter(s => s.adminId === adminId); },
    createSession: function ({ token, ownerId, role, expires }) { this._json.sessions.push({ token, ownerId, role, expires, createdAt: Date.now() }); save(); this.insertAudit('session.create', { ownerId, role, token: token.slice(0,6) + '...' }); return { token, ownerId, role, expires }; },
    getSession: function (token) { return this._json.sessions.find(s => s.token === token); },
    deleteSession: function (token) { this._json.sessions = this._json.sessions.filter(s => s.token !== token); save(); this.insertAudit('session.delete', { token: token.slice(0,6) + '...' }); },
    invalidateSessionsForOwner: function (ownerId) { const before = this._json.sessions.length; this._json.sessions = this._json.sessions.filter(s => s.ownerId !== ownerId); const removed = before - this._json.sessions.length; save(); this.insertAudit('session.invalidate', { ownerId, removed }); return removed; },
    createResetToken: function ({ token, type, ownerId, expires }) { this._json.reset_tokens.push({ token, type, ownerId, expires, createdAt: Date.now() }); save(); return { token, type, ownerId, expires }; },
    getResetToken: function (token) { return this._json.reset_tokens.find(t => t.token === token); },
    deleteResetToken: function (token) { this._json.reset_tokens = this._json.reset_tokens.filter(t => t.token !== token); save(); },
    insertAudit: function (action, details) { this._json.audit_logs.push({ id: (this._json.audit_logs.reduce((m, a) => Math.max(m, a.id || 0), 0) || 0) + 1, ts: new Date().toISOString(), action, details: details ? JSON.stringify(details) : null }); save(); },
    listAudit: function (limit = 100) { return this._json.audit_logs.slice(-limit).reverse(); },
    getSubscriptionTier: function (id) { return this._json.subscription_tiers.find(t => t.id === id); },
    countStaffForAdmin: function (adminId) { return { cnt: this._json.staff.filter(s => String(s.adminId) === String(adminId)).length }; }
  };
}

// Helper functions
// Export public API (db may be either sqlite Database instance or JSON-backed object)
if (usingSqlite) {
  module.exports = {
    db,
    createAdmin: function (opts) {
      const stmt = db.prepare('INSERT INTO admins (email, passwordHash, firstName, lastName, phone, company, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      stmt.run(opts.email, opts.passwordHash, opts.firstName || null, opts.lastName || null, opts.phone || null, opts.company || null, opts.address || null, opts.role || 'Administrator');
      return this.getAdminByEmail(opts.email);
    },
    getAdminByEmail: function (email) { return db.prepare('SELECT * FROM admins WHERE email = ?').get(email); },
    createStaff: function (opts) { db.prepare('INSERT INTO staff (staffId, adminId, email, firstName, lastName, phone, role, status, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(opts.staffId, opts.adminId, opts.email, opts.firstName, opts.lastName, opts.phone, opts.role, opts.status, opts.passwordHash); return this.getStaffByStaffId(opts.staffId); },
    getStaffByStaffId: function (staffId) { return db.prepare('SELECT * FROM staff WHERE staffId = ?').get(staffId); },
    listStaffForAdmin: function (adminId) { return db.prepare('SELECT * FROM staff WHERE adminId = ?').all(adminId); },
    createSession: function (opts) { db.prepare('INSERT INTO sessions (token, ownerId, role, expires) VALUES (?, ?, ?, ?)').run(opts.token, opts.ownerId, opts.role, opts.expires); this.insertAudit('session.create', { ownerId: opts.ownerId, role: opts.role, token: opts.token.slice(0,6) + '...' }); return { token: opts.token, ownerId: opts.ownerId, role: opts.role, expires: opts.expires }; },
    getSession: function (token) { return db.prepare('SELECT * FROM sessions WHERE token = ?').get(token); },
    deleteSession: function (token) { db.prepare('DELETE FROM sessions WHERE token = ?').run(token); this.insertAudit('session.delete', { token: token.slice(0,6) + '...' }); },
    invalidateSessionsForOwner: function (ownerId) { const info = db.prepare('DELETE FROM sessions WHERE ownerId = ?').run(ownerId); this.insertAudit('session.invalidate', { ownerId, removed: info.changes }); return info.changes; },
    createResetToken: function (opts) { db.prepare('INSERT INTO reset_tokens (token, type, ownerId, expires) VALUES (?, ?, ?, ?)').run(opts.token, opts.type, opts.ownerId, opts.expires); return { token: opts.token, type: opts.type, ownerId: opts.ownerId, expires: opts.expires }; },
    getResetToken: function (token) { return db.prepare('SELECT * FROM reset_tokens WHERE token = ?').get(token); },
    deleteResetToken: function (token) { db.prepare('DELETE FROM reset_tokens WHERE token = ?').run(token); },
    insertAudit: function (action, details) { db.prepare('INSERT INTO audit_logs (action, details) VALUES (?, ?)').run(action, details ? JSON.stringify(details) : null); },
    listAudit: function (limit = 100) { return db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?').all(limit); },
    getSubscriptionTier: function (id) { return db.prepare('SELECT * FROM subscription_tiers WHERE id = ?').get(id); },
    countStaffForAdmin: function (adminId) { return db.prepare('SELECT COUNT(*) as cnt FROM staff WHERE adminId = ?').get(adminId); }
    ,
    // RBAC sqlite helpers
    getRoleByName: function (name) { return db.prepare('SELECT * FROM roles WHERE name = ?').get(name); },
    createRole: function (name) { db.prepare('INSERT OR IGNORE INTO roles (name) VALUES (?)').run(name); return this.getRoleByName(name); },
    createPermission: function (name) { db.prepare('INSERT OR IGNORE INTO permissions (name) VALUES (?)').run(name); return db.prepare('SELECT * FROM permissions WHERE name = ?').get(name); },
    grantPermissionToRole: function (roleName, permName) { const r = this.getRoleByName(roleName); const p = db.prepare('SELECT * FROM permissions WHERE name = ?').get(permName); if (!r || !p) return false; db.prepare('INSERT OR IGNORE INTO role_permissions (roleId, permissionId) VALUES (?, ?)').run(r.id, p.id); return true; },
    assignRoleToUser: function ({ userType, userId, roleName }) { const r = this.getRoleByName(roleName); if (!r) return false; db.prepare('INSERT OR IGNORE INTO user_roles (userType, userId, roleId) VALUES (?, ?, ?)').run(userType, String(userId), r.id); return true; },
    getUserRoles: function ({ userType, userId }) { const rows = db.prepare('SELECT r.* FROM roles r JOIN user_roles ur ON ur.roleId = r.id WHERE ur.userType = ? AND ur.userId = ?').all(userType, String(userId)); return rows; },
    userHasPermission: function ({ userType, userId, permission }) { const p = db.prepare('SELECT id FROM permissions WHERE name = ?').get(permission); if (!p) return false; const row = db.prepare(`SELECT 1 FROM user_roles ur JOIN role_permissions rp ON rp.roleId = ur.roleId WHERE ur.userType = ? AND ur.userId = ? AND rp.permissionId = ? LIMIT 1`).get(userType, String(userId), p.id); return !!row; }
  };
} else {
  module.exports = db; // json-backed implementation
}
