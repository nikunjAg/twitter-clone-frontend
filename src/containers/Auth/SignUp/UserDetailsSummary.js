import React from 'react';
import TwitterIcon from '@material-ui/icons/Twitter';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Button from '../../../components/Button/Button';

import './SignUp.css';
import AuthInput from '../AuthInput';

const UserDetailsSummary = (props) => {
	return (
		<div className="UserDetailsSummary">
			<div className="ModalHeader">
				<KeyboardBackspaceIcon
					className="Icon BackIcon"
					onClick={props.prevStepHandler}
				/>
				<TwitterIcon className="Icon" />
				<Button onClick={props.nextStepHandler}>Next</Button>
			</div>
			<div className="ModalContent">
				<h2>Create your account</h2>

				<AuthInput
					element={{
						name: 'name',
						id: 'name',
						elementConfig: {
							...props.values.name.elementConfig,
							value: props.values.name.value,
						},
						elementType: props.values.name.elementType,
						label: props.values.name.label,
						touched: props.values.name.touched,
						valid: props.values.name.valid,
						errorMessage: props.values.name.errorMessage,
						onChangeHandler: props.onChangeHandler,
						onClick: props.jumpToStep.bind(null, 1),
					}}
				/>
				<AuthInput
					element={{
						name: 'email',
						id: 'email',
						elementConfig: {
							...props.values.email.elementConfig,
							value: props.values.email.value,
						},
						elementType: props.values.email.elementType,
						label: props.values.email.label,
						touched: props.values.email.touched,
						valid: props.values.email.valid,
						errorMessage: props.values.email.errorMessage,
						onChangeHandler: props.onChangeHandler,
						onClick: props.jumpToStep.bind(null, 2),
					}}
				/>

				<AuthInput
					element={{
						name: 'dateOfBirth',
						id: 'dateOfBirth',
						elementConfig: {
							...props.values.dateOfBirth.elementConfig,
							value: props.values.dateOfBirth.value,
						},
						elementType: props.values.dateOfBirth.elementType,
						label: props.values.dateOfBirth.label,
						touched: props.values.dateOfBirth.touched,
						valid: props.values.dateOfBirth.valid,
						errorMessage: props.values.dateOfBirth.errorMessage,
						onChangeHandler: props.onChangeHandler,
						onClick: props.jumpToStep.bind(null, 3),
					}}
				/>
			</div>
		</div>
	);
};

export default UserDetailsSummary;
