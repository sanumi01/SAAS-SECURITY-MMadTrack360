# Define base API URL
$baseUrl = "https://mamaadsolution.com/api"
$logPath = "C:\Users\pryan\OneDrive\Desktop\SAAS PROJECTS\SAAS For MMadTrack360-Security3\logs\route-validation-log.txt"

# Step 1: Admin login to get JWT token
$loginPayload = @{
    email = "testadmin@mamaadsolution.com"
    password = "TestPassword123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/admin/login" -Method POST -Body $loginPayload -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "? Token acquired"
} catch {
    Write-Host "? Failed to acquire token: $($_.Exception.Message)"
    Add-Content -Path $logPath -Value "$((Get-Date).ToString()) - Token fetch failed: $($_.Exception.Message)"
    exit
}

# Step 2: Define headers with token
$headers = @{
    Authorization = "Bearer $token"
}

# Step 3: Define test payloads
$adminSignupPayload = @{
    email = "testadmin2@mamaadsolution.com"
    password = "AnotherTest123"
} | ConvertTo-Json

$staffLoginPayload = @{
    email = "teststaff@mamaadsolution.com"
    password = "TestPassword123"
} | ConvertTo-Json

# Step 4: Function to test routes
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
    Add-Content -Path $logPath -Value "$((Get-Date).ToString()) - $msg"
}

# Step 5: Run validations
Write-Host "`n?? Validating Admin Signup..."
Test-Route -endpoint "admin/signup" -payload $adminSignupPayload

Write-Host "`n?? Validating Staff Login..."
Test-Route -endpoint "staff/login" -payload $staffLoginPayload
