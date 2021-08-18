const path = require('path');

module.exports = (command, filePath) => {
	const file = path.basename(filePath);
	const filename = file.split('.').slice(0, -1).join('.');
	command = command.replace('{%file%}', file);
	command = command.replace('{%filename%}', filename);
	return command;
};
