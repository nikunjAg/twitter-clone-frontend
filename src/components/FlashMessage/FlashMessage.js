import React from 'react';

import classes from './FlashMessage.module.css';

const FlashMessage = (props) => {
	return (
		<div className={classes.FlashMessage}>
			<p className={classes.Message}>{props.message}</p>
		</div>
	);
};

export default FlashMessage;
