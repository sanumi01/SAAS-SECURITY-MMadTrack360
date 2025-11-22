// Test runner: spawn the CLI RBAC test with DEV_ONLY env flags set
const { fork } = require('child_process');
const path = require('path');

const testScript = path.join(__dirname, 'rbac-cli-test.js');
const child = fork(testScript, { cwd: path.join(__dirname, '..'), env: Object.assign({}, process.env, { DEV_RETURN_RESET_TOKEN: '1' }), stdio: 'inherit' });
child.on('exit', (code) => process.exit(code));
child.on('error', (err) => { console.error('Failed to start tests', err); process.exit(1); });
