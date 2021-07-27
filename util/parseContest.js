let request = require('request-promise');
const fs = require('fs');
const FileCookieStore = require('tough-cookie-file-store').FileCookieStore;
const { cookiepath } = require('../constants/index');
const { parse } = require('node-html-parser');

if (!fs.existsSync(cookiepath)) {
	fs.writeFileSync(cookiepath, '{}');
}

const cookieJar = request.jar(new FileCookieStore(cookiepath));

request = request.defaults({ jar: cookieJar });

module.exports = async contest_number => {
	try {
		if (isNaN(contest_number)) {
			throw Error('Contest does not exist');
		}
		const body = await request.get(
			`https://codeforces.com/contest/${contest_number}`
		);
		if (!body.includes(`/contest/${contest_number}/submit`)) {
			throw Error('Contest does not exist');
		}
		const root = parse(body);
		const problems = [];
		root.querySelectorAll('[data-problem-name]').forEach(elem => {
			if (elem.getAttribute('data-problem-name') !== '')
				problems.push(elem.getAttribute('value'));
		});

		if (fs.existsSync(`./${contest_number}`)) {
			throw Error(
				`Folder already exists. Delete ${contest_number} folder first`
			);
		}

		fs.mkdirSync(`./${contest_number}`);
		problems.forEach(problem => {
			// TODO:
		});
	} catch (e) {
		console.error(`${e}`);
	}
};
