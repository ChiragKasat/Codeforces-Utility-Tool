const path = require('path');
const fs = require('fs');
const { homedir } = require('os');
const inquirer = require('inquirer');
const languages = require('./languages');
const templateData = JSON.parse(fs.readFileSync(path.join(homedir(), '.cfbot', 'template')));
const aliases = templateData.templates.map(template => template.alias);

module.exports = async () => {
	const answer = await inquirer.prompt(templateQuestions);
	answer.lang = answer.lang.split(' ')[0];
	answer.path = path.resolve(answer.path);
	templateData.templates.push(answer);
	answer.alias = answer.alias.trim();
	fs.writeFileSync(path.join(homedir(), '.cfbot', 'template'), JSON.stringify(templateData));
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
			if(aliases.includes(value)) return 'this alias is already present, try another...'
			if(value)return true;
			return "Cant't be empty";
		}
	},
	{
		type: 'input',
		name: 'path',
		message: 'Enter path to template(e.g. -> ./template.cpp)',
		validate: function (value) {
			if (value[0] === '~') {
				value = value.replace('~', homedir);
			}
			if (fs.statSync(value).isFile()) return true;
			return 'File does not exist. Enter again...';
		}
	}
];
