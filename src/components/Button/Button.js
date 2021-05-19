import React from 'react';

import classes from './Button.module.css';

const Button = (props) => {
	const btnClasses = [
		classes.Button,
		props.sty === 'Outline' ? classes.Outline : classes.Filled,
		props.btnBlock ? classes.Block : '',
	].join(' ');

	return (
		<button
			type={props.type ? props.type : 'button'}
			style={{
				width: `${props.width ? props.width + '%' : 'auto'}`,
				fontSize: `${props.fontSize ? props.fontSize : 1}rem`,
			}}
			className={btnClasses}
			disabled={props.disabled}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
};

export default Button;
