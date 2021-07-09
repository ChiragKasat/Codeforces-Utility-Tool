const { red } = require('chalk');
const fs = require('fs');
const { templatePath } = require('../constants/index');
const templateData = JSON.parse(fs.readFileSync(templatePath));

module.exports = () => {
	const templates = templateData.templates.map((template, index) => {
		return `${index + 1}: ${template.alias} --> ${template.path}`;
	});

	if (templates.length == 0) {
		console.log(red('No Templates Defined.'));
	}

	for (const template of templates) {
		console.log(template);
	}
};
