#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const program = new Command();
const pkg = require('./package.json');
const homeDir = require('os').homedir();
const { red, cyanBright, bgBlack } = require('chalk');
const moment = require('moment');

const root = path.join(homeDir, '.cfbot');
const templatePath = path.join(root, 'template');
const templateData = {
	templates: []
};

if (!fs.existsSync(root)) {
	fs.mkdirSync(root);
	if (!fs.existsSync(templatePath)) {
		fs.writeFileSync(templatePath, JSON.stringify(templateData));
	}
}

let isLoggedIn = true;

if (fs.existsSync(path.join(root, 'cookies.json'))) {
	const cookies = JSON.parse(fs.readFileSync(path.join(root, 'cookies.json')));
	if (cookies['codeforces.com'] === undefined) {
		isLoggedIn = false;
	} else {
		const user = cookies['codeforces.com']['/']['X-User'];
		if (user === undefined) {
			isLoggedIn = false;
		} else {
			const expires = user.expires;
			if (moment().isAfter(expires)) {
				isLoggedIn = false;
			}
		}
	}
} else {
	isLoggedIn = false;
}

if (!isLoggedIn) {
	console.log(red('You need to log in...'));
	console.log(cyanBright('Log in using ' + bgBlack('cf configure')));
}

const cmd = require('./commands/index');

program.version(pkg.version);

program
	.command('configure')
	.description('configure your settings')
	.action(cmd.config);

program.parse(process.argv);
