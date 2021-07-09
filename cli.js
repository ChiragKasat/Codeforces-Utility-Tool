#!/usr/bin/env node
const fs = require('fs');
const { Command } = require('commander');
const program = new Command();
const pkg = require('./package.json');
const { red, cyanBright, bgBlack } = require('chalk');
const isLoggedIn = require('./util/isLoggedIn');
const { templatePath, root } = require('./constants');

const templateData = {
	templates: []
};

if (!fs.existsSync(root)) {
	fs.mkdirSync(root);
	if (!fs.existsSync(templatePath)) {
		fs.writeFileSync(templatePath, JSON.stringify(templateData));
	}
}

let isLogged = true;

if (!isLoggedIn()) {
	isLogged = false;
}

if (!isLogged) {
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
