// SQLite utility for admin user management
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const dbPath = path.join(__dirname, '../db.sqlite')

const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`)
})

function createAdmin(username, password, cb) {
  db.run('INSERT INTO admins (username, password) VALUES (?, ?)', [username, password], cb)
}

function findAdmin(username, cb) {
  db.get('SELECT * FROM admins WHERE username = ?', [username], cb)
}

module.exports = { db, createAdmin, findAdmin }
