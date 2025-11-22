# Define base paths
$projectRoot = "C:\Users\pryan\OneDrive\Desktop\SAAS PROJECTS\SAAS For MMadTrack360-Security3"
$frontendDir = "$projectRoot\src\pages"
$cssDir = "$projectRoot\src\css"
$landingPage = "$frontendDir\dashboard.html"
$styleSheet = "$cssDir\style.css"
$backupDir = "$projectRoot\backup\$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Create folders if missing
New-Item -ItemType Directory -Path $frontendDir -Force
New-Item -ItemType Directory -Path $cssDir -Force
New-Item -ItemType Directory -Path $backupDir -Force

# Create files if missing
New-Item -ItemType File -Path $landingPage -Force
New-Item -ItemType File -Path $styleSheet -Force

# Backup existing files
Copy-Item $landingPage -Destination "$backupDir\dashboard.html"
Copy-Item $styleSheet -Destination "$backupDir\style.css"

# Inject unified sign-in block
$signinBlock = @"
<!-- Unified Sign-In Block -->
<div class='signin-container'>
  <h2>MMadTrack360 Access</h2>
  <select id='userType' onchange='toggleLoginForm()'>
    <option value='admin'>Admin</option>
    <option value='staff'>Staff</option>
  </select>

  <div id='adminLogin'>
    <input type='email' placeholder='Admin Email' />
    <input type='password' placeholder='Password' />
    <button>Sign In</button>
    <a href='#'>Forgot password?</a>
    <a href='#'>Create Account</a>
  </div>

  <div id='staffLogin' style='display:none;'>
    <input type='email' placeholder='Staff Email' />
    <input type='password' placeholder='Password' />
    <button>Sign In</button>
    <a href='#'>Forgot password?</a>
  </div>
</div>

<script>
function toggleLoginForm() {
  var type = document.getElementById('userType').value;
  document.getElementById('adminLogin').style.display = (type === 'admin') ? 'block' : 'none';
  document.getElementById('staffLogin').style.display = (type === 'staff') ? 'block' : 'none';
}
</script>
"@

Add-Content $landingPage $signinBlock

# Add styling
Add-Content $styleSheet @"
.signin-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}
.signin-container input, .signin-container select {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
"@

Write-Host "? Sign-in block injected and styled. Backup saved to $backupDir"
