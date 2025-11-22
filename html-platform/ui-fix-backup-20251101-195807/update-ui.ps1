# Navigate to frontend folder
cd "C:\Users\pryan\OneDrive\Desktop\SAAS PROJECTS\SAAS For MMadTrack360-Security3\html-platform"

#  Update admin-login.html to embed signup form
@"
<!DOCTYPE html>
<html>
<head>
  <title>Admin Login</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="auth-container">
    <h2>Admin Login</h2>
    <form id="admin-login-form">
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p class="signup-link">
      Dont have an account? <a href="#" onclick="toggleSignup()">Sign up</a>
    </p>

    <div id="signup-form" style="display:none;">
      <h3>Create Admin Account</h3>
      <form id="admin-signup-form">
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="tel" placeholder="Phone Number" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Create Account</button>
      </form>
    </div>
  </div>

  <script>
    function toggleSignup() {
      const form = document.getElementById("signup-form");
      form.style.display = form.style.display === "none" ? "block" : "none";
    }
  </script>
</body>
</html>
"@ | Set-Content "admin-login.html"

#  Update dashboard.html to include Plans & Billing in sidebar
(Get-Content "dashboard.html") -replace '</ul>', '<li><a href="#plans">Plans & Billing</a></li>`n</ul>' |
  Set-Content "dashboard.html"

#  Append billing section to dashboard.html
Add-Content "dashboard.html" @"
<section id='plans'>
  <h2>Plans & Billing</h2>
  <p>Apply offer codes:</p>
  <ul>
    <li><strong>LAUNCH50</strong>  50% off 3 months</li>
    <li><strong>ANNUAL20</strong>  20% off annual</li>
    <li><strong>REFER100</strong>  £100 credit</li>
  </ul>
  <button onclick="alert('Plan activated!')">Activate / Update Plan</button>
</section>
"@

Write-Host "`n UI updated: Signup is now embedded in login, and billing is part of the dashboard." -ForegroundColor Green
