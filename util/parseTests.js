let request = require('request-promise');
const { parse } = require('node-html-parser');
const fs = require('fs');

module.exports = async (contestURL, problem, testProblemPath) => {
	const problemURL = `${contestURL}/problem/${problem}`;
	const body = await request.get(problemURL);
	const root = parse(body);
	root.querySelectorAll('div.input pre').forEach((input, ind) => {
		fs.writeFileSync(`${testProblemPath}/${ind}.inp`, input.innerText.trim());
	});
	root.querySelectorAll('div.output pre').forEach((input, ind) => {
		fs.writeFileSync(`${testProblemPath}/${ind}.out`, input.innerText.trim());
	});
};
