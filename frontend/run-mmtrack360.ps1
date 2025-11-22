# STEP 1  Start Frontend
Write-Host "`n Starting frontend..." -ForegroundColor Cyan
cd "html-platform"
if (-not (Get-Command http-server -ErrorAction SilentlyContinue)) {
  npm install -g http-server
}
Start-Process powershell -ArgumentList '-NoExit','-Command', 'http-server -p 4173 -o'
cd ..

# STEP 2  Start Backend
Write-Host "`n Starting backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList '-NoExit','-Command', 'cd "backend"; $env:AWS_PROFILE="default"; $env:AWS_REGION="us-west-2"; npm run dev'

# STEP 3  Health Check
Start-Sleep -Seconds 3
Write-Host "`n Checking backend health..." -ForegroundColor Yellow
Invoke-RestMethod http://localhost:4000/api/health

# STEP 4  Create Secrets if Missing
Write-Host "`n Creating SES/SNS secrets if needed..." -ForegroundColor Cyan
aws secretsmanager create-secret --name "mmadtrack360/prod/notifications/ses" --secret-string '{"FROM_EMAIL":"mamaadsolution@gmail.com","FROM_NAME":"MMadTrack360 Security"}' -ErrorAction SilentlyContinue
aws secretsmanager create-secret --name "mmadtrack360/prod/notifications/sms" --secret-string '{"SENDER_ID":"MM360","SMS_TYPE":"Transactional"}' -ErrorAction SilentlyContinue

# STEP 5  Describe Secrets
Write-Host "`n Verifying Secrets Manager entries..." -ForegroundColor Yellow
aws secretsmanager describe-secret --secret-id "mmadtrack360/prod/notifications/ses"
aws secretsmanager describe-secret --secret-id "mmadtrack360/prod/notifications/sms"

# STEP 6  Verify SES Identity
Write-Host "`n Verifying SES sender identity..." -ForegroundColor Cyan
aws sesv2 create-email-identity --email-identity mamaadsolution@gmail.com -ErrorAction SilentlyContinue
aws sesv2 get-email-identity --email-identity mamaadsolution@gmail.com

# STEP 7  Set SNS Attributes
Write-Host "`n Configuring SNS SMS attributes..." -ForegroundColor Cyan
aws sns set-sms-attributes --attributes DefaultSMSType=Transactional,DefaultSenderID=MM360

# STEP 8  Patch Root Route (optional)
Write-Host "`n Patching root route in server.js..." -ForegroundColor Cyan
$server = Get-Content "backend\src\server.js"
$insertAt = ($server | Select-String -Pattern "app.listen").LineNumber - 1
$patched = $server[0..($insertAt - 1)] + 'app.get("/", (req, res) => res.send("OK"));' + $server[$insertAt..($server.Length - 1)]
$patched | Set-Content "backend\src\server.js"

# STEP 9  Check for Twilio remnants
Write-Host "`n Checking for leftover Twilio requires..." -ForegroundColor Yellow
Select-String -Path "backend\src\**\*.js" -Pattern "twilio" -List

Write-Host "`n MMadTrack360 setup complete. You can now test signup, billing, and notifications via the UI." -ForegroundColor Green
