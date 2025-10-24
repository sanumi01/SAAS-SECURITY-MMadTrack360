// AWS Lambda: Staff Login
exports.handler = async (event) => {
  const { staffId } = JSON.parse(event.body || '{}')
  // TODO: Validate staffId against database
  if (!staffId || staffId.length < 6) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid staff ID' })
    }
  }
  // Simulate success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Login successful', staffId })
  }
}
