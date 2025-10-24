// AWS Lambda: Staff Location Tracking
exports.handler = async (event) => {
  const { staffId, location } = JSON.parse(event.body || '{}')
  // TODO: Save location to database
  if (!staffId || !location) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing staffId or location' })
    }
  }
  // Simulate success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Location updated', staffId, location })
  }
}
