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

module.exports = async () => {
	try {
		const body = await request.get('https://codeforces.com/contests');
		const root = parse(body);
		const table =
			root.querySelectorAll('[data-contestid]')[0].parentNode.childNodes;
		const registeredContests = [];
		const contests = [];
		for (let i = 3; i < table.length; i += 2) {
			const contestName = table[i].childNodes[1].innerText.trim();
			const contestStartTime =
				table[i].childNodes[5].childNodes[1].innerText.trim();
			const contestID = table[i].getAttribute('data-contestid');
			if (
				table[i].childNodes[11].innerText.trim().split('\n')[0].trim() ===
				'Registration completed'
			) {
				registeredContests.push({ contestID, contestStartTime, contestName });
			} else {
				contests.push({ contestID, contestStartTime, contestName });
			}
		}
		return { registeredContests, contests };
	} catch {
		console.error('Error ocucured, please try again.');
	}
};
