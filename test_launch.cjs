/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const { spawn } = require('child_process');
const path = require('path');

const electronExe = path.join(__dirname, '.build', 'electron', 'Code - OSS.exe');
console.log('Starting:', electronExe);

const child = spawn(electronExe, ['.', '--verbose', '--enable-logging'], {
	stdio: 'inherit',
	env: {
		...process.env,
		ELECTRON_ENABLE_LOGGING: '1'
	}
});

child.on('error', (err) => {
	console.error('Failed to start:', err);
});

child.on('exit', (code, signal) => {
	console.log(`Process exited with code ${code} and signal ${signal}`);
});
