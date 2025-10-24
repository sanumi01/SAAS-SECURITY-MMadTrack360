// AWS Lambda: Admin Alert Management
exports.handler = async (event) => {
  const { adminId, alert } = JSON.parse(event.body || '{}')
  // TODO: Send alert to staff/notification system
  if (!adminId || !alert) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing adminId or alert' })
    }
  }
  // Simulate success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Alert sent', adminId, alert })
  }
}
