import React, { Component } from 'react';
import TwitterIcon from '@material-ui/icons/Twitter';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './Login.module.css';
import AuthInput from '../AuthInput';
import Button from '../../../components/Button/Button';
import Spinner from '../../../components/Spinner/Spinner';
import * as actionCreator from '../../../store/actions';

class Login extends Component {
	state = {
		controls: {
			userId: {
				elementType: 'Input',
				elementConfig: {
					type: 'text',
					placeholder: 'Phone, email, or username',
				},
				validation: {
					isRequired: true,
				},
				label: '',
				errorMessage: 'Please enter a valid value',
				touched: false,
				value: '',
				valid: false,
			},
			password: {
				elementType: 'Input',
				elementConfig: {
					type: 'password',
					placeholder: 'Password',
				},
				validation: {
					isRequired: true,
					minLength: 6,
				},
				label: '',
				errorMessage: 'Password should be at least 6 chars long',
				touched: false,
				value: '',
				valid: false,
			},
		},
	};

	checkValidity = (fieldName, rules, value) => {
		if (!rules) return true;
		let isValid = true;
		let updatedValue = value;
		if (fieldName !== 'password' && fieldName !== 'confirmPassword')
			updatedValue = updatedValue.trim();

		if (rules.isRequired) isValid = isValid & (updatedValue.length !== 0);

		if (rules.minLength)
			isValid = isValid && updatedValue.length >= rules.minLength;

		if (rules.regex) isValid = isValid && rules.regex.test(updatedValue);

		if (rules.startsWith)
			isValid = isValid && updatedValue.startsWith(rules.startsWith);

		if (rules.shouldMatchField)
			isValid =
				isValid &&
				this.state.controls[rules.shouldMatchField].value === updatedValue;

		return isValid;
	};

	onChangeHandler = (fieldName, event) => {
		const updatedValue = event.target.value;

		const updatedControls = { ...this.state.controls };
		const updatedControl = { ...this.state.controls[fieldName] };

		updatedControl.value = updatedValue;
		updatedControl.touched = true;
		updatedControl.valid = this.checkValidity(
			fieldName,
			updatedControl.validation,
			updatedControl.value
		);

		updatedControls[fieldName] = updatedControl;
		this.setState({ controls: updatedControls });
	};

	checkFormValidity = () => {
		let formValidity = true;
		for (let control in this.state.controls) {
			formValidity = formValidity && this.state.controls[control].valid;
		}

		return formValidity;
	};

	onLoginHandler = (event) => {
		event.preventDefault();

		const formValidity = this.checkFormValidity();

		if (!formValidity) {
			// Here we need to mark all the fields as touched so that they can display their error messages
			const updatedControls = { ...this.state.controls };
			for (let control in updatedControls) {
				updatedControls[control] = { ...updatedControls[control] };
				updatedControls[control].touched = true;
			}
			this.setState({ controls: updatedControls });
			return;
		}

		const userData = {
			userId: this.state.controls.userId.value,
			password: this.state.controls.password.value,
		};
		this.props.onLoginHandler(userData);
	};

	render() {
		const inputs = [...Object.keys(this.state.controls)].map((keyName, idx) => (
			<AuthInput
				key={keyName}
				element={{
					name: keyName,
					id: keyName,
					elementConfig: {
						...this.state.controls[keyName].elementConfig,
						value: this.state.controls[keyName].value,
					},
					elementType: this.state.controls[keyName].elementType,
					label: this.state.controls[keyName].label,
					touched: this.state.controls[keyName].touched,
					valid: this.state.controls[keyName].valid,
					errorMessage: this.state.controls[keyName].errorMessage,
					onChangeHandler: this.onChangeHandler,
				}}
			/>
		));

		const userRedirection = this.props.isAuthenticated ? (
			<Redirect to="/home" />
		) : null;

		return (
			<div className={classes.Login}>
				{userRedirection}
				<Link to="/">
					<TwitterIcon className={classes.Icon} />
				</Link>
				<h2>Log in to Twitter</h2>
				<form className={classes.LoginForm} onSubmit={this.onLoginHandler}>
					{inputs}
					<Button
						type="submit"
						btnBlock
						width={100}
						disabled={!this.checkFormValidity()}
					>
						{this.props.loading ? <Spinner white /> : 'Log in'}
					</Button>
				</form>
				<div className={classes.OneLiner}>
					<Link to="/">Forgot Password?</Link>
					<p>·</p>
					<Link to="/signup">Sign up for Twitter</Link>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null,
		loading: state.auth.loading,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLoginHandler: (userDetails) =>
			dispatch(actionCreator.userLogin(userDetails)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
