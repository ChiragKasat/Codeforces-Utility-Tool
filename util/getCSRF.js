module.exports = body => {
	return body.split('data-csrf=')[1].split("'")[1];
};
