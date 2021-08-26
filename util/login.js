let request = require('request-promise');
const fs = require('fs');
const chalk = require('chalk');
const getCSRF = require('./getCSRF');
const FileCookieStore = require('tough-cookie-file-store').FileCookieStore;

const { cookiepath } = require('../constants/index');

if (!fs.existsSync(cookiepath)) {
	fs.writeFileSync(cookiepath, '{}');
}

const cookieJar = request.jar(new FileCookieStore(cookiepath));

request = request.defaults({ jar: cookieJar });

module.exports = async (handleOrEmail, password) => {
	try {
		const body = await request.get('https://codeforces.com/enter');
		const token = getCSRF(body);

		request
			.post('https://codeforces.com/enter?f0a28=1', {
				form: {
					csrf_token: token,
					action: 'enter',
					ftaa: 'v7zx9mkh3ehg6mbl4h',
					bfaa: 'fb697a0610154b8d2c2fc09991ea506d',
					handleOrEmail,
					password,
					remember: 'on',
					_tta: '910'
				}
			})
			.then(() => console.log(chalk.red('Invalid password or handle/email')))
			.catch(() => {
				console.log(
					chalk.green(`Logged in succesfully as ${handleOrEmail}...`)
				);
			});
	} catch {
		console.error('Cannot login now');
	}
};
