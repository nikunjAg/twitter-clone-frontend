import React from 'react';

import classes from './Spinner.module.css';

const Spinner = (props) => {
	return (
		<div
			style={{
				borderColor: props.white ? '#ffffff33' : '#1da1f233',
				borderLeftColor: props.white ? '#fff' : '#1da1f2',
			}}
			className={classes.Spinner}
		></div>
	);
};

export default Spinner;
