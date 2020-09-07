const path = require('path');
const fs = require('fs');
const { homedir } = require('os');
const inquirer = require('inquirer');
const templateData = JSON.parse(fs.readFileSync(path.join(homedir(), '.cfbot', 'template')));
const templates = templateData.templates;

module.exports = async () => {
	const answer = await inquirer.prompt(questions);
	const index = answer.template.split(':')[0];
	templates.splice(index-1, 1);
	fs.writeFileSync(path.join(homedir(), '.cfbot', 'template'), JSON.stringify(templateData));
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
