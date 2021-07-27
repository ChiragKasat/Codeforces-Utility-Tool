const checkContest = require('../util/checkContest');
const parseContest = require('../util/parseContest');
const isLoggedIn = require('../util/isLoggedIn');
const { cyan, red } = require('chalk');
const { format } = require('date-fns');
const inquirer = require('inquirer');

const contestQuestions = registeredContests => [
	{
		name: 'contest_number',
		type: 'list',
		message: '\nWhich one do you want to parse?',
		choices: registeredContests.map(
			registeredContest => `${registeredContest.contestID}`
		)
	}
];

const printContest = ({ contestID, contestStartTime, contestName }) => {
	const contestStartTimeLocale = format(
		new Date(`${contestStartTime} GMT+0300`),
		'do MMMM, HH:mm zzzz'
	);
	console.log(
		`${contestID}: ${contestName} starts at ${contestStartTimeLocale}`
	);
};

module.exports = async contest_number => {
	try {
		if (!isLoggedIn()) {
			return;
		}
		if (contest_number === undefined) {
			const { registeredContests, contests } = await checkContest();
			console.log('\nUpcoming Contests:');
			contests.forEach(printContest);
			if (registeredContests.length === 0) {
				console.log(red("\nYou haven't registered for any contest."));
			} else {
				console.log(cyan('\nContests you have registered for:'));
				registeredContests.forEach(printContest);
			}
			const answer = await inquirer.prompt(
				contestQuestions(registeredContests)
			);
			parseContest(answer.contest_number);
		} else {
			parseContest(contest_number);
		}
	} catch (e) {
		console.error('Some error occured.');
	}
};
