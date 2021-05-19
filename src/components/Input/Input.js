import React from 'react';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';

import classes from './Input.module.css';

const Input = (props) => {
	const inputClasses = [
		classes.InputElement,
		!props.valid && props.touched ? classes.Error : '',
	].join(' ');

	return (
		<div className={classes.Input}>
			<label>{props.label}</label>
			<input
				className={inputClasses}
				{...props.elementConfig}
				onChange={props.onChange}
			/>
			{!props.valid && props.touched ? (
				<small>
					<ErrorOutlineOutlinedIcon className={classes.Icon} />
					{props.errorMessage}
				</small>
			) : null}
		</div>
	);
};

export default Input;
