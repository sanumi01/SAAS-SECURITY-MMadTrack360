// AWS Lambda: Admin Communication Hub
exports.handler = async (event) => {
  const { adminId, message } = JSON.parse(event.body || '{}')
  // TODO: Send message to staff/other admins
  if (!adminId || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing adminId or message' })
    }
  }
  // Simulate success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Message sent', adminId, message })
  }
}
