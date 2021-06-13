import React from 'react';
import { Link } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Button from '../../../components/Button/Button';

import './SignUp.css';
import AuthInput from '../AuthInput';
import Spinner from '../../../components/Spinner/Spinner';
import Logo from '../../../Logo';

const UserPassword = (props) => {
	return (
		<div className="UserPassword">
			<div className="ModalHeader">
				<KeyboardBackspaceIcon
					className="Icon BackIcon"
					onClick={props.prevStepHandler}
				/>
				<Logo className="Icon" />
			</div>
			<div className="ModalContent">
				<h2>Create Password</h2>
				<form className="SignUpForm" onSubmit={props.onSignUpHandler}>
					<AuthInput
						element={{
							name: 'username',
							id: 'username',
							elementConfig: {
								...props.values.username.elementConfig,
								value: props.values.username.value,
							},
							elementType: props.values.username.elementType,
							label: props.values.username.label,
							touched: props.values.username.touched,
							valid: props.values.username.valid,
							errorMessage: props.values.username.errorMessage,
							onChangeHandler: props.onChangeHandler,
						}}
					/>
					<AuthInput
						element={{
							name: 'password',
							id: 'password',
							elementConfig: {
								...props.values.password.elementConfig,
								value: props.values.password.value,
							},
							elementType: props.values.password.elementType,
							label: props.values.password.label,
							touched: props.values.password.touched,
							valid: props.values.password.valid,
							errorMessage: props.values.password.errorMessage,
							onChangeHandler: props.onChangeHandler,
						}}
					/>

					<AuthInput
						element={{
							name: 'confirmPassword',
							id: 'confirmPassword',
							elementConfig: {
								...props.values.confirmPassword.elementConfig,
								value: props.values.confirmPassword.value,
							},
							elementType: props.values.confirmPassword.elementType,
							label: props.values.confirmPassword.label,
							touched: props.values.confirmPassword.touched,
							valid: props.values.confirmPassword.valid,
							errorMessage: props.values.confirmPassword.errorMessage,
							onChangeHandler: props.onChangeHandler,
						}}
					/>

					<p className="TermsAndConditions">
						By signing up, you agree to the <Link to="#">Terms of Service</Link>
						&nbsp; and <Link to="#">Privacy Policy</Link>, including&nbsp;
						<Link to="#">Cookie Use</Link>. Others will be able to find you by
						email or phone number when provided ·&nbsp;
						<Link to="#">Privacy Options</Link>
					</p>
					<Button type="submit" btnBlock width={100}>
						{props.loading ? <Spinner white /> : 'Sign up'}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default UserPassword;
