// AWS Lambda: Staff Scheduling
exports.handler = async (event) => {
  const { staffId, schedule } = JSON.parse(event.body || '{}')
  // TODO: Save schedule to database
  if (!staffId || !schedule) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing staffId or schedule' })
    }
  }
  // Simulate success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Schedule updated', staffId, schedule })
  }
}
