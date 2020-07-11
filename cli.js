#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const program = new Command();
const pkg = require('./package.json');
const homeDir = require('os').homedir();

if (!fs.existsSync(path.join(homeDir, '.cfbot'))) {
	fs.mkdirSync(path.join(homeDir, '.cfbot'));
}

const cmd = require('./commands/index');

program.version(pkg.version);

program
	.command('configure')
	.description('configure your settings')
	.action(cmd.config);

program.parse(process.argv);
