// AWS Lambda: Staff Check-In
exports.handler = async (event) => {
  const { staffId, location } = JSON.parse(event.body || '{}')
  // TODO: Save check-in to database
  if (!staffId || !location) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing staffId or location' })
    }
  }
  // Simulate success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Check-in successful', staffId, location })
  }
}
