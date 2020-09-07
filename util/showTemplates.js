const path = require('path');
const fs = require('fs');
const { homedir } = require('os');
const templateData = JSON.parse(fs.readFileSync(path.join(homedir(), '.cfbot', 'template')));

module.exports = () => {
	const templates = (templateData.templates.map((template, index) => {
		return `${index+1}: ${template.alias} --> ${template.path}`;
	}))

	for(let i=0; i<templates.length; i++){
		console.log(templates[i]);
	}
}