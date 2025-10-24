// AWS Lambda: Admin Location Tracking
exports.handler = async (event) => {
  const { adminId, location } = JSON.parse(event.body || '{}')
  // TODO: Update location in database
  if (!adminId || !location) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing adminId or location' })
    }
  }
  // Simulate success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Location updated', adminId, location })
  }
}
