// AWS Lambda: Staff Alert
exports.handler = async (event) => {
  const { staffId, message } = JSON.parse(event.body || '{}')
  // TODO: Send alert to admin/notification system
  if (!staffId || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing staffId or message' })
    }
  }
  // Simulate success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Alert sent', staffId, alert: message })
  }
}
