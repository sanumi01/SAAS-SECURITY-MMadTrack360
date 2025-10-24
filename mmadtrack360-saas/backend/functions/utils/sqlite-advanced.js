// Advanced SQLite features: staff management
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const dbPath = path.join(__dirname, '../db.sqlite')

const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staffId TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT,
    location TEXT,
    checkinTime TEXT
  )`)
})

function createStaff(staffId, name, role, location, checkinTime, cb) {
  db.run('INSERT INTO staff (staffId, name, role, location, checkinTime) VALUES (?, ?, ?, ?, ?)', [staffId, name, role, location, checkinTime], cb)
}

function findStaff(staffId, cb) {
  db.get('SELECT * FROM staff WHERE staffId = ?', [staffId], cb)
}

function updateStaffLocation(staffId, location, cb) {
  db.run('UPDATE staff SET location = ? WHERE staffId = ?', [location, staffId], cb)
}

function staffCheckin(staffId, checkinTime, cb) {
  db.run('UPDATE staff SET checkinTime = ? WHERE staffId = ?', [checkinTime, staffId], cb)
}

module.exports = { db, createStaff, findStaff, updateStaffLocation, staffCheckin }
