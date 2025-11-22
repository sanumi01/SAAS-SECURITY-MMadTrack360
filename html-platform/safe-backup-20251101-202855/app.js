function $(q){ return document.querySelector(q); }
function show(el){ el.style.display="block"; }
function hide(el){ el.style.display="none"; }

function activateTab(groupSel, targetId){
const group = document.querySelector(groupSel);
if(!group) return;
group.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
group.querySelectorAll("[data-panel]").forEach(p=>p.style.display="none");
group.querySelector([data-panel="${targetId}"]).style.display="block";
group.querySelector([data-tab="${targetId}"]).classList.add("active");
}

// Admin login (demo or wire to backend when ready)
async function adminLogin(email, password){
if(email==='admin@demo.com' && password==='admin123'){
Auth.login('admin',{name:'Admin User', email});
alert(' Welcome Admin!');
location.href='dashboard.html';
}else{
alert(' Invalid credentials. Use admin@demo.com / admin123');
}
}

// Admin signup -> call backend then trial + login
async function adminSignup(payload){
try{
const res = await fetch('http://localhost:4000/api/auth/register-admin', {
method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
});
const json = await res.json();
if(!json.ok){ alert('Registration failed: ' + (json.error||'Unknown')); return; }
// start trial + notifications + login
Billing.startTrialBasic('GBP', null);
sendEmail(payload.email,'welcome',{ userName: payload.firstName + ' ' + payload.lastName });
sendSMS(payload.phone, 'welcome', {});
Auth.login('admin',{name:payload.firstName + ' ' + payload.lastName, email:payload.email});
alert(' Account created! Trial started.');
location.href='dashboard.html';
}catch(err){
console.error(err); alert('Registration failed');
}
}
