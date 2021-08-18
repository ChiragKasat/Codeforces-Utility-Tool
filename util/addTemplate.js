const path = require('path');
const fs = require('fs');
const { homedir } = require('os');
const inquirer = require('inquirer');
const languages = require('../constants/languages');
const { green } = require('chalk');
const { templatePath } = require('../constants/index');
const getExtension = require('./getExtension');
const templateData = JSON.parse(fs.readFileSync(templatePath));
const aliases = templateData.templates.map(template => template.alias);

module.exports = async () => {
	const answer = await inquirer.prompt(templateQuestions);
	answer.lang = answer.lang.split(' ')[0];
	answer.path = path.resolve(answer.path);
	templateData.templates.push(answer);
	answer.alias = answer.alias.trim();
	answer.extension = getExtension(answer.path);
	fs.writeFileSync(templatePath, JSON.stringify(templateData));
	console.log(green('Template added succesfully.'));
};

const templateQuestions = [
	{
		name: 'lang',
		type: 'list',
		message: 'What do you want to do?',
		choices: languages.map(
			lang => `${Object.keys(lang)[0]} - ${Object.values(lang)[0]}`
		)
	},
	{
		name: 'alias',
		type: 'text',
		message: 'Type a alias name for this template(e.g. -> cpp, python)',
		validate: value => {
			value = value.trim();
			if (aliases.includes(value))
				return 'this alias is already present, try another...';
			if (value) return true;
			return "Cant't be empty";
		}
	},
	{
		type: 'input',
		name: 'path',
		message: 'Enter path to template(e.g. -> ./template.cpp)',
		validate: value => {
			if (value[0] === '~') {
				value = value.replace('~', homedir);
			}
			if (fs.statSync(value).isFile()) return true;
			return 'File does not exist. Enter again...';
		}
	},
	{
		type: 'input',
		name: 'pre_run',
		message:
			'Enter command for compiling \n Can be skipped if not required \n File name with extension can be accessed by writing "{%file%} and filename by {%filename%}" \n for example, `g++ {%file%} -o {%filename%}`'
	},
	{
		type: 'input',
		name: 'run',
		message:
			'Enter command for executing file, will run before each test,  \n File name with extension can be accessed by writing "{%file%} and filename by {%filename%}" \n for example, `./{%filename%}.out` or `python {%filename%}`',
		validate: value => {
			value = value.trim();
			if (value) return true;
			return "Cant't be empty";
		}
	}
];
