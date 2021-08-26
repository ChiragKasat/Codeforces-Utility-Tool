let request = require('request-promise');
const { cookiepath } = require('../constants/index');
const isLoggedIn = require('./isLoggedIn');
const { format } = require('date-fns');
const fs = require('fs');
const { parse } = require('node-html-parser');
const sleep = require('./sleep');
const FileCookieStore = require('tough-cookie-file-store').FileCookieStore;
const { red, green } = require('chalk');

if (!fs.existsSync(cookiepath)) {
	fs.writeFileSync(cookiepath, '{}');
}

const cookieJar = request.jar(new FileCookieStore(cookiepath));

request = request.defaults({ jar: cookieJar });

module.exports = async statusURL => {
	try {
		if (!isLoggedIn()) {
			return;
		}

		await sleep(1);

		let waiting = true;
		const bodyfirst = await request.get(statusURL);
		const rootfirst = parse(bodyfirst);
		const submissionID = rootfirst
			.querySelectorAll('[data-submission-id]')[0]
			.getAttribute('data-submission-id');

		let row = rootfirst
			.querySelector(`[data-submission-id=${submissionID}]`)
			.querySelectorAll('td');

		let time = row[1].querySelector('span').innerText;

		time = format(new Date(`${time} GMT+0300`), 'do MMMM, HH:mm zzzz');

		const problem = row[3].querySelector('a').innerText.trim();

		const lang = row[4].innerText.trim();

		console.log(`Submitted At: ${time}`);
		console.log(`Problem: ${problem}`);
		console.log(`Language: ${lang}`);

		process.stdout.write(`Status: `);
		while (waiting) {
			const body = await request.get(statusURL);
			const root = parse(body);

			row = root
				.querySelector(`[data-submission-id=${submissionID}]`)
				.querySelectorAll('td');

			waiting = row[5].getAttribute('waiting') === 'true';

			const status = row[5].innerText.trim();

			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(`Status: ${status}`);
		}
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		if (
			row[5].querySelector('span').getAttribute('submissionverdict') ===
			'WRONG_ANSWER'
		) {
			console.log(red(row[5].innerText.trim()));
		} else {
			console.log(green(row[5].innerText.trim()));
		}
		const runtime = row[6].innerText.trim().replace('&nbsp;', ' ');
		const memory = row[7].innerText.trim().replace('&nbsp;', ' ');
		console.log(`Time: ${runtime}`);
		console.log(`Memory: ${memory}`);
	} catch (e) {
		console.log(`${e}`);
	}
};
