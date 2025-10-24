// AWS Lambda: Staff Scan
exports.handler = async (event) => {
  const { staffId, scanData } = JSON.parse(event.body || '{}')
  // TODO: Save scan data to database
  if (!staffId || !scanData) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing staffId or scanData' })
    }
  }
  // Simulate success
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Scan successful', staffId, scanData })
  }
}
