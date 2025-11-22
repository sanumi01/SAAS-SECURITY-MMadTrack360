# Define base API URL
$baseUrl = "https://mamaadsolution.com/api"

# Optional: Replace with your real token or API key
$headers = @{
    Authorization = "Bearer YOUR_JWT_TOKEN_HERE"
}

# Define test payloads
$adminSignupPayload = @{
    email = "testadmin@mamaadsolution.com"
    password = "TestPassword123"
} | ConvertTo-Json

$adminLoginPayload = @{
    email = "testadmin@mamaadsolution.com"
    password = "TestPassword123"
} | ConvertTo-Json

$staffLoginPayload = @{
    email = "teststaff@mamaadsolution.com"
    password = "TestPassword123"
} | ConvertTo-Json

# Function to test POST route
function Test-Route {
    param (
        [string]$endpoint,
        [string]$payload
    )
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$endpoint" -Method POST -Body $payload -ContentType "application/json" -Headers $headers
        $msg = "? $endpoint responded with status: $($response.status)"
    } catch {
        $msg = "? $endpoint failed: $($_.Exception.Message)"
    }
    Write-Host $msg
    Add-Content -Path "$logPath" -Value "$((Get-Date).ToString()) - $msg"
}

# Run validations
Write-Host "`n?? Validating Admin Signup..."
Test-Route -endpoint "admin/signup" -payload $adminSignupPayload

Write-Host "`n?? Validating Admin Login..."
Test-Route -endpoint "admin/login" -payload $adminLoginPayload

Write-Host "`n?? Validating Staff Login..."
Test-Route -endpoint "staff/login" -payload $staffLoginPayload
