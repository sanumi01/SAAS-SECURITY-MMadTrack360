// Playwright automation for MMadTrack360 platform preview
const { chromium } = require('playwright');

const baseUrl = 'http://localhost:5173';
const routes = [
  '/login',
  '/admin',
  '/admin/dashboard',
  '/admin/settings',
  '/staff',
  '/staff/dashboard',
  '/staff/tasks',
  '/preview'
];

const users = [
  {
    role: 'admin',
    username: 'admin@mmadtrack360.com',
    password: 'Admin123@',
    dashboard: '/admin/dashboard'
  },
  {
    role: 'staff',
    username: 'staff@mmadtrack360.com',
    password: 'Staff123@',
    dashboard: '/staff/dashboard'
  }
];

async function autoLogin(page, user) {
  await page.goto(baseUrl + '/login');
  await page.fill('input[type="email"]', user.username);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle' });
}

async function captureScreenshots(page, role) {
  for (const route of routes) {
    await page.goto(baseUrl + route);
    await page.waitForTimeout(1000); // Wait for UI to load
    await page.screenshot({ path: `screenshots/${role}${route.replace(/\//g, '_')}.png`, fullPage: true });
  }
}

(async () => {
  for (const user of users) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    console.log(`Logging in as ${user.role}...`);
    await autoLogin(page, user);
    await captureScreenshots(page, user.role);
    await browser.close();
  }
  // Guest (no login)
  const browser = await chromium.launch();
  const page = await browser.newPage();
  console.log('Previewing as guest...');
  await captureScreenshots(page, 'guest');
  await browser.close();
  console.log('✅ Screenshots saved in ./screenshots');
})();
