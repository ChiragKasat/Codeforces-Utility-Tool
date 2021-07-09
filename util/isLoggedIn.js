const { isAfter, parseISO } = require('date-fns');
const fs = require('fs');
const path = require('path');
const homeDir = require('os').homedir();
const root = path.join(homeDir, '.cfbot');

module.exports = () => {
	if (fs.existsSync(path.join(root, 'cookies.json'))) {
		const cookies = JSON.parse(
			fs.readFileSync(path.join(root, 'cookies.json'))
		);
		if (cookies['codeforces.com'] === undefined) {
			return false;
		} else {
			const user = cookies['codeforces.com']['/']['X-User'];
			if (user === undefined) {
				return false;
			} else {
				const expires = parseISO(user.expires);
				if (isAfter(new Date(), expires)) {
					return false;
				}
			}
		}
		return true;
	} else {
		return false;
	}
};
