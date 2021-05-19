import React from 'react';

const AuthInput = (props) => {
	const classes = ['AuthInput'];
	let inputElement = null;

	switch (props.element.elementType) {
		case 'Input':
			inputElement = (
				<input
					className={
						!props.element.valid && props.element.touched ? 'InputError' : ''
					}
					{...props.element.elementConfig}
					name={props.element.name}
					id={props.element.id}
					onChange={props.element.onChangeHandler.bind(
						null,
						props.element.name
					)}
					onClick={props.element.onClick}
				/>
			);
			break;
		case 'Date':
			inputElement = (
				<input
					className={
						!props.element.valid && props.element.touched ? 'InputError' : ''
					}
					{...props.element.elementConfig}
					name={props.element.name}
					id={props.element.id}
					onChange={props.element.onChangeHandler.bind(
						null,
						props.element.name
					)}
					onClick={props.element.onClick}
				/>
			);
			break;
		default:
			inputElement = <input />;
	}

	return (
		<div className={classes.join(' ')}>
			<label htmlFor={props.element.id}>{props.element.label}</label>
			{inputElement}
			{!props.element.valid && props.element.touched ? (
				<small className="ErrorMessage">{props.element.errorMessage}</small>
			) : null}
		</div>
	);
};

export default AuthInput;
