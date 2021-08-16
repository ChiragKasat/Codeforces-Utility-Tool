let request = require('request-promise');
const fs = require('fs');
const { parse } = require('node-html-parser');
const parseTests = require('./parseTests');
const { basename } = require('path');
const inquirer = require('inquirer');
const { templatePath } = require('../constants/index');
const checkContest = require('./checkContest');
const contestTimer = require('./contestTimer');
const templateData = JSON.parse(fs.readFileSync(templatePath));
const templates = templateData.templates;
const { differenceInMinutes } = require('date-fns');

const questions = [
	{
		name: 'alias',
		type: 'list',
		message: 'Which template do you want to use?',
		choices: templates.map(template => {
			return template.alias;
		})
	}
];

const getExtension = templatePath => {
	const file = basename(templatePath);
	return file.split('.').pop();
};

module.exports = async contest_number => {
	try {
		if (isNaN(contest_number)) {
			throw Error('Contest does not exist');
		}
		const contestURL = `https://codeforces.com/contest/${contest_number}`;
		const body = await request.get(contestURL);
		if (!body.includes(`/contest/${contest_number}/submit`)) {
			const { registeredContests } = await checkContest();
			const contest = registeredContests.filter(
				registeredContest => registeredContest.contestID == contest_number
			)[0];
			const timerLimit = 5;
			if (!contest) throw Error('Contest does not exist');
			const difference = Math.abs(
				differenceInMinutes(new Date(contest.contestStartTime), new Date())
			);
			if (difference > timerLimit) {
				console.log(
					`Contest starts on ${contest.contestStartTime}. Timer will begin when contest starts in less than ${timerLimit} minutes.`
				);
				return;
			} else {
				await contestTimer(difference * 60 + 1);
			}
		}
		const root = parse(body);
		const problems = [];
		root.querySelectorAll('[data-problem-name]').forEach(elem => {
			if (elem.getAttribute('data-problem-name') !== '')
				problems.push(elem.getAttribute('value'));
		});

		if (problems.length === 0)
			throw Error("Contest hasn't started. Try again!");

		let template;
		if (templates.length !== 1) {
			const answer = await inquirer.prompt(questions);
			template = templates.filter(
				template => template.alias === answer.alias
			)[0];
		} else {
			template = templates[0];
		}

		const extension = getExtension(template.path);
		const contestFolderPath = `./${contest_number}`;
		const testFolderPath = `./${contest_number}/.tests`;
		if (fs.existsSync(contestFolderPath)) {
			throw Error(
				`Folder already exists. Delete ${contest_number} folder first`
			);
		}

		const source = fs.readFileSync(template.path);
		fs.mkdirSync(contestFolderPath);
		fs.mkdirSync(testFolderPath);
		problems.forEach(problem => {
			fs.writeFileSync(`${contestFolderPath}/${problem}.${extension}`, source);
			const testProblemPath = `${testFolderPath}/${problem}`;
			fs.mkdirSync(testProblemPath);
			parseTests(contestURL, problem, testProblemPath);
		});
		const info = { template, contest_number };
		fs.writeFileSync(`${contestFolderPath}/.info`, JSON.stringify(info));
	} catch (e) {
		console.error(`${e}`);
	}
};
