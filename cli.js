#!/usr/bin/env node
const fs = require('fs');
const { Command } = require('commander');
const program = new Command();
const pkg = require('./package.json');
const { red, cyanBright, bgBlack } = require('chalk');
const isLoggedIn = require('./util/isLoggedIn');
const { templatePath, root } = require('./constants/index');

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

program
	.command('contest [contest_number]')
	.description(
		"Parse all questions of the contest whose number is provided, if number is not provided then you'll be given a list of your registered contests to choose from"
	)
	.action(cmd.contest);

program
	.command('test <problem>')
	.option(
		'-o --show-output',
		'show output of tests without comparing with expected output'
	)
	.description(
		'Test your solution against given test cases. Enter the problem number to test'
	)
	.action(cmd.test);

program
	.command('submit <problem>')
	.description(
		'Submit your solution to the problem. Enter the problem number to submit'
	)
	.action(cmd.submit);

program.parse(process.argv);
