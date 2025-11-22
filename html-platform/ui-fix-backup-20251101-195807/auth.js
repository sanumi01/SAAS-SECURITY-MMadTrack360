const Auth = {
login(role, user) {
localStorage.setItem('isAuthenticated','true');
localStorage.setItem('userRole', role);
localStorage.setItem('userName', user?.name || (role==='admin'?'Admin User':'Staff Member'));
localStorage.setItem('userEmail', user?.email || '');
},
requireRole(requiredRole) {
const isAuth = localStorage.getItem('isAuthenticated') === 'true';
const role = localStorage.getItem('userRole');
if (!isAuth) {
alert('Please login first');
location.href = 'index.html';
return false;
}
if (requiredRole && role !== requiredRole) {
alert('Access denied. ' + requiredRole.toUpperCase() + ' only');
location.href = 'index.html';
return false;
}
return true;
},
logout() { localStorage.clear(); location.href = 'index.html'; },
getUser() {
return { name: localStorage.getItem('userName') || '', email: localStorage.getItem('userEmail') || '', role: localStorage.getItem('userRole') || '' };
}
};
window.Auth = Auth;
