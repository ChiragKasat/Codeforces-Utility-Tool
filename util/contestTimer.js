const {
	addSeconds,
	differenceInSeconds,
	differenceInMinutes
} = require('date-fns');
const cliProgress = require('cli-progress');
const { cyan } = require('chalk');

const sleep = seconds => {
	return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

const bar1 = new cliProgress.SingleBar(
	{
		format:
			'contest starts in ' +
			cyan('{bar}') +
			'| {eta_formatted} s || {percentage}%',
		hideCursor: true,
		clearOnComplete: true
	},
	cliProgress.Presets.shades_classic
);

module.exports = async time => {
	bar1.start(time, 0);
	let elapsed = 0;
	while (time--) {
		bar1.update(elapsed++);
		await sleep(1);
	}
	bar1.stop();
	await sleep(1);
	return true;
};
