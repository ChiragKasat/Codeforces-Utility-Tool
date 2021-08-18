const { basename } = require('path');

module.exports = templatePath => {
	const file = basename(templatePath);
	return file.split('.').pop();
};
