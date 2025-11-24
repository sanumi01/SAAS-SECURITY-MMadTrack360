// Test runner: spawn the CLI RBAC test with DEV_ONLY env flags set
const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');

const testScript = path.join(__dirname, 'rbac-cli-test.js');

// Ensure test runner exposes reset tokens and optionally enable periodic flush for verification
const env = Object.assign({}, process.env, { DEV_RETURN_RESET_TOKEN: '1' });
// If the caller hasn't set a periodic flush ms, default to 5000 for CI/local verification
if (!env.DB_PERSIST_PERIODIC_FLUSH_MS) env.DB_PERSIST_PERIODIC_FLUSH_MS = '5000';

// Monitor db.json mtime to assert periodic flush occurred during the test run.
const dbPath = path.join(__dirname, '..', 'data', 'db.json');
let initialMtime = null;
try {
	const stat = fs.statSync(dbPath);
	initialMtime = stat.mtimeMs;
} catch (e) {
	// file may not exist yet; that's okay - we'll detect creation
	initialMtime = 0;
}

let mtimeChanged = false;
function checkMtime() {
	try {
		const s = fs.statSync(dbPath);
		if (s.mtimeMs > initialMtime) mtimeChanged = true;
	} catch (e) {
		// ignore
	}
}

const pollHandle = setInterval(checkMtime, 500);

const child = fork(testScript, { cwd: path.join(__dirname, '..'), env, stdio: 'inherit' });
child.on('exit', (code) => {
	clearInterval(pollHandle);
	// final check
	checkMtime();
	if (!mtimeChanged) {
		console.error('[TEST] periodic-flush verification failed: db.json mtime did not change during test run');
		// non-zero exit to fail CI
		process.exit(2);
	}
	process.exit(code);
});
child.on('error', (err) => { clearInterval(pollHandle); console.error('Failed to start tests', err); process.exit(1); });
