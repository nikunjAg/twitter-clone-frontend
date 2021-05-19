import React from 'react';
import TwitterIcon from '@material-ui/icons/Twitter';

import './SignUp.css';
import Button from '../../../components/Button/Button';
import AuthInput from '../AuthInput';

const UserDetails = (props) => {
	return (
		<div className="UserDetails">
			<div className="ModalHeader">
				<TwitterIcon className="Icon" />
				<Button
					disabled={
						!props.values.name.valid ||
						!props.values.email.valid ||
						!props.values.dateOfBirth.valid
					}
					onClick={props.nextStepHandler}
				>
					Next
				</Button>
			</div>
			<div className="ModalContent">
				<h2>Create your account</h2>
				{/* <label htmlFor="name">{props.values.name.label}</label>
				<input
					className={!props.values.name.valid ? 'InputError' : ''}
					id="name"
					{...props.values.name.elementConfig}
					name="name"
					value={props.values.name.value}
					onChange={props.onChangeHandler.bind(null, 'name')}
				/>
				{!props.values.name.valid ? (
					<small className="ErrorMessage">
						{props.values.name.errorMessage}
					</small>
				) : null} */}
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
					}}
				/>
				<p className="EmailPhoneToggler">Use Email instead</p>
				<div className="dobLabel">
					<p>
						<b>Date of birth</b>
					</p>
					<p>
						This will not be shown publicly. Confirm your own age, even if this
						account is for a business, a pet, or something else.
					</p>
				</div>
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
					}}
				/>
			</div>
		</div>
	);
};

export default UserDetails;
