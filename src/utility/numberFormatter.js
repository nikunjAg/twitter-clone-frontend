export const convertToInternationalCurrencySystem = (labelValue) => {
	const val = Number(labelValue);

	// Nine Zeroes for Billions
	return Math.abs(val) >= 1.0e9
		? Math.sign(val) * (Math.abs(val) / 1.0e9).toFixed(2) + 'B'
		: // Six Zeroes for Millions
		Math.abs(val) >= 1.0e6
		? Math.sign(val) * (Math.abs(val) / 1.0e6).toFixed(2) + 'M'
		: // Three Zeroes for Thousands
		Math.abs(val) >= 1.0e3
		? Math.sign(val) * (Math.abs(val) / 1.0e3).toFixed(2) + 'K'
		: Math.sign(val) * Math.abs(val);
};
