const timeDifference = (current, previous) => {
	const msPerMinute = 60 * 1000;
	const msPerHour = msPerMinute * 60;
	const msPerDay = msPerHour * 24;
	const msPerMonth = msPerDay * 30;
	const msPerYear = msPerDay * 365;

	const elapsed = current - previous;
	let timeVal = 0;
	let result = 'a while ago';
	if (elapsed < msPerMinute) {
		timeVal = Math.round(elapsed / 1000);
		result = timeVal + ` second${timeVal === 1 ? '' : 's'} ago`;
	} else if (elapsed < msPerHour) {
		timeVal = Math.round(elapsed / msPerMinute);
		result = timeVal + ` minute${timeVal === 1 ? '' : 's'} ago`;
	} else if (elapsed < msPerDay) {
		timeVal = Math.round(elapsed / msPerHour);
		result = timeVal + ` hour${timeVal === 1 ? '' : 's'} ago`;
	} else if (elapsed < msPerMonth) {
		timeVal = Math.round(elapsed / msPerDay);
		result = timeVal + ` day${timeVal === 1 ? '' : 's'} ago`;
	} else if (elapsed < msPerYear) {
		timeVal = Math.round(elapsed / msPerYear);
		result = timeVal + ` year${timeVal === 1 ? '' : 's'} ago`;
	} else {
		timeVal = Math.round(elapsed / msPerYear);
		result = timeVal + ` year${timeVal === 1 ? '' : 's'} ago`;
	}
	return result;
};

export default timeDifference;

export const getDateString = (timestamp) => {
	let dateString = new Date(timestamp);
	dateString = dateString.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
	return dateString;
};

export const getTimeString = (timestamp) => {
	let timeString = new Date(timestamp);
	timeString = timeString.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
	return timeString;
};

export const getPostTime = (timestamp) => {
	return getTimeString(timestamp) + ' · ' + getDateString(timestamp);
};
