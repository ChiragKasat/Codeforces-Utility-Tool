const { isAfter, parseISO } = require('date-fns');
const fs = require('fs');
const { cookiepath } = require('../constants/index');

module.exports = () => {
	if (fs.existsSync(cookiepath)) {
		const cookies = JSON.parse(fs.readFileSync(cookiepath));
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
