const inquirer = require('inquirer');
const login = require('../util/login');
const isLoggedIn = require('../util/isLoggedIn');
const addTemplate = require('../util/addTemplate');
const showTemplates = require('../util/showTemplates');
const deleteTemplate = require('../util/deleteTemplate');
const logout = require('../util/logout');
const { green } = require('chalk');

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
				'show all templates',
				'logout'
			]
		}
	]);

	switch (inp.option) {
		case 'login':
			if (isLoggedIn()) {
				console.log(green(`Already Logged In...`));
				break;
			}
			const creds = await getCredentials();
			login(creds.handleOrEmail, creds.password);
			break;
		case 'add a template':
			addTemplate();
			break;
		case 'delete a template':
			deleteTemplate();
			break;
		case 'show all templates':
			const templates = showTemplates();
			for (const template of templates) {
				console.log(template);
			}
			break;
		case 'logout':
			logout();
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
