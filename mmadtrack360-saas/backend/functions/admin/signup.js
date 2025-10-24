const { hashPassword } = require('../utils/hash')
const { createAdmin, findAdmin } = require('../utils/sqlite')

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body || '{}')
  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Username and password required' })
    }
  }
  return new Promise((resolve) => {
    findAdmin(username, (err, admin) => {
      if (admin) {
        resolve({
          statusCode: 409,
          body: JSON.stringify({ error: 'Admin already exists' })
        })
        return
      }
      createAdmin(username, hashPassword(password), (err) => {
        if (err) {
          resolve({
            statusCode: 500,
            body: JSON.stringify({ error: 'Database error' })
          })
        } else {
          resolve({
            statusCode: 201,
            body: JSON.stringify({ success: true, username })
          })
        }
      })
    })
  })
}
