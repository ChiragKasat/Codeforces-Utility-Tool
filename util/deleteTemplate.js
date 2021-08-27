const fs = require('fs');
const inquirer = require('inquirer');
const { red } = require('chalk');
const { templatePath } = require('../constants/index');
const templateData = JSON.parse(fs.readFileSync(templatePath));
const templates = templateData.templates;

//TODO: Check for 0 templates

module.exports = async () => {
	const answer = await inquirer.prompt(questions);
	const index = answer.template.split(':')[0];
	templates.splice(index - 1, 1);
	fs.writeFileSync(templatePath, JSON.stringify(templateData));
	console.log(red('Template deleted.'));
};

const questions = [
	{
		name: 'template',
		type: 'list',
		message: 'Which template do you want to delete?',
		choices: templates.map((template, index) => {
			return `${index + 1}: ${template.alias} --> ${template.path}`;
		})
	}
];
