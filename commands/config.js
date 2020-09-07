const inquirer = require('inquirer');
const login = require('../util/login');
const addTemplate = require('../util/addTemplate');
const showTemplates = require('../util/showTemplates');
// const deleteTemplate = require('../util/deleteTemplate');

module.exports = async () => {
	const inp = await inquirer.prompt([
		{
			name: 'option',
			type: 'list',
			message: 'What do you want to do?',
			choices: [
				'login',
				'add a template',
				'delete a template',
				'show all templates'
			]
		}
	]);

	switch (inp.option) {
		case 'login':
			const creds = await getCredentials();
			login(creds.handleOrEmail, creds.password);
			break;
		case 'add a template':
			addTemplate();
			break;
		case 'delete a template':
			// deleteTemplate();
			break;
		case 'show all templates':
			showTemplates();
			break;
		default:
			console.log('error');
	}
};

const credQuestions = [
	{
		type: 'input',
		name: 'handleOrEmail',
		message: 'Enter your handle or email',
		validate: function (value) {
			if (value) return true;
			return 'Cannot be blank...';
		}
	},
	{
		type: 'password',
		name: 'password',
		message: 'Enter password',
		validate: function (value) {
			if (value) return true;
			return 'Cannot be blank...';
		}
	}
];

const getCredentials = async () => {
	const answer = await inquirer.prompt(credQuestions);
	return answer;
};
