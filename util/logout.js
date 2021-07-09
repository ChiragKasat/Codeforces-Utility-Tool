const fs = require('fs');
const { cookiepath } = require('../constants');
const { green, red } = require('chalk');

module.exports = () => {
	fs.unlink(cookiepath, function (err) {
		console.log('here');
		if (err && err.code == 'ENOENT') {
			console.log(green('Not Logged In'));
		} else if (err) {
			console.log(red('Error Logging Out'));
		} else {
			console.log(green('Logged out successfully...'));
		}
	});
};
