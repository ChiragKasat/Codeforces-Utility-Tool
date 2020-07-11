const inquirer = require('inquirer');
const login = require('../util/login');

module.exports = async () => {
	const inp = await inquirer.prompt([
		{
			type: 'list',
			name: 'option',
			message: 'What do you want to do?',
			choices: [
				'login',
				'add a template',
				'delete a template',
				'set default template'
			]
		}
	]);

	switch (inp.option) {
		case 'login':
			const creds = await getCredentials();
			login(creds.handleOrEmail, creds.password);
			break;
		case 'add a template':
			console.log('add a template');
			break;
		case 'delete a template':
			console.log('delete a template');
			break;
		case 'set default template':
			console.log('set default template');
			break;
		default:
			console.log('error	');
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
