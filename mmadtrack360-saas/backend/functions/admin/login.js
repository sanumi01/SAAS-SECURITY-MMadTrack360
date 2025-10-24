const { hashPassword } = require('../utils/hash')
const { findAdmin } = require('../utils/sqlite')

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body || '{}')
  return new Promise((resolve) => {
    findAdmin(username, (err, admin) => {
      if (!admin || admin.password !== hashPassword(password)) {
        resolve({
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid credentials' })
        })
      } else {
        resolve({
          statusCode: 200,
          body: JSON.stringify({ success: true, username })
        })
      }
    })
  })
}
