import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './SignUp.css';
import Backdrop from '../../../components/Backdrop/Backdrop';
import Modal from '../../../components/Modal/Modal';
import UserDetails from './UserDetails';
import UserConfirmations from './UserConfirmations';
import UserDetailsSummary from './UserDetailsSummary';
import UserPassword from './UserPassword';
import * as actionCreators from '../../../store/actions/index';

class SignUp extends Component {
	state = {
		step: 1,
		controls: {
			name: {
				elementType: 'Input',
				elementConfig: {
					type: 'text',
					placeholder: 'John Smith',
				},
				validation: {
					isRequired: true,
					minLength: 3,
				},
				errorMessage: 'Please enter correct name',
				label: 'Name',
				value: '',
				valid: false,
				touched: false,
			},
			email: {
				elementType: 'Input',
				elementConfig: {
					type: 'email',
					placeholder: 'john@smith.com',
				},
				validation: {
					isRequired: true,
					regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				},
				errorMessage: 'Please enter a valid email',
				label: 'Email',
				value: '',
				valid: false,
				touched: false,
			},
			username: {
				elementType: 'Input',
				elementConfig: {
					type: 'text',
					placeholder: '@smithJohn',
				},
				validation: {
					isRequired: true,
					startsWith: '@',
					minLength: 4,
				},
				errorMessage:
					"Username should starts with '@' and should more than 3 chars",
				label: 'Username',
				value: '',
				valid: false,
				touched: false,
			},
			dateOfBirth: {
				elementType: 'Input',
				elementConfig: {
					type: 'date',
					placeholder: '23/02/2000',
				},
				validation: {
					isRequired: true,
				},
				errorMessage: 'Please enter a valid Date Of Birth',
				label: 'Date Of Birth',
				value: '',
				valid: false,
				touched: false,
			},
			trackingConfirmation: {
				elementType: 'Checkbox',
				elementConfig: {
					type: 'checkbox',
				},
				value: true,
				valid: true,
			},
			password: {
				elementType: 'Input',
				elementConfig: {
					type: 'password',
					placeholder: '',
				},
				validation: {
					isRequired: true,
					minLength: 6,
					shouldMatchField: 'confirmPassword',
				},
				errorMessage:
					'Minimum length of password should be 6 and both passwords should match.',
				label: 'Password',
				touched: false,
				valid: false,
				value: '',
			},
			confirmPassword: {
				elementType: 'Input',
				elementConfig: {
					type: 'password',
					placeholder: '',
				},
				validation: {
					isRequired: true,
					minLength: 6,
					shouldMatchField: 'password',
				},
				errorMessage: 'Both passwords should match',
				label: 'Confirm Password',
				touched: false,
				valid: false,
				value: '',
			},
		},
	};

	nextStepHandler = () => {
		this.setState((prevState) => ({ step: Math.min(4, prevState.step + 1) }));
	};

	prevStepHandler = () => {
		this.setState((prevState) => ({ step: Math.max(1, prevState.step - 1) }));
	};

	jumpToStep = (stepNo) => {
		if (stepNo < 1 || stepNo > 4) return;
		this.setState({ step: stepNo });
	};

	checkValidity = (fieldName, rules, value) => {
		if (!rules) return true;
		let isValid = true;
		let updatedValue = value;
		if (fieldName !== 'password' && fieldName !== 'confirmPassword')
			updatedValue = updatedValue.trim();

		if (rules.isRequired) isValid = isValid && updatedValue.length !== 0;

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

		if (fieldName === 'trackingConfirmation') {
			this.setState((prevState) => ({
				...prevState,
				controls: {
					...prevState.controls,
					trackingConfirmation: {
						...prevState.controls.trackingConfirmation,
						value: event.target.checked,
					},
				},
			}));
			return;
		}

		// this.setState({ [fieldName]: value });

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
		if (fieldName !== 'password' && fieldName !== 'confirmPassword')
			this.setState({ controls: updatedControls });
		else if (fieldName === 'password') {
			this.setState({
				controls: {
					...updatedControls,
					confirmPassword: {
						...updatedControls.confirmPassword,
						valid: updatedControl.valid,
						touched: true,
					},
				},
			});
		} else {
			this.setState({
				controls: {
					...updatedControls,
					password: {
						...updatedControls.password,
						valid: updatedControl.valid,
						touched: true,
					},
				},
			});
		}
	};

	onSignUpHandler = (event) => {
		event.preventDefault();

		let formValidity = true;
		for (let control in this.state.controls) {
			formValidity = formValidity && this.state.controls[control].valid;
		}

		if (!formValidity) {
			const updatedControls = { ...this.state.controls };
			for (let control in updatedControls) {
				updatedControls[control] = { ...updatedControls[control] };
				updatedControls[control].touched = true;
			}
			this.setState({ controls: updatedControls });
			return;
		}

		const userData = {
			name: this.state.controls.name.value,
			email: this.state.controls.email.value,
			dateOfBirth: this.state.controls.dateOfBirth.value,
			trackingConfirmation: this.state.controls.trackingConfirmation.value,
			username: this.state.controls.username.value,
			password: this.state.controls.password.value,
			confirmPassword: this.state.controls.confirmPassword.value,
		};

		this.props.onSignUpHandler(userData);
	};

	onModalCloseHandler = (modalNode, event) => {
		this.props.history.push('/');
	};

	render() {
		const { step } = this.state;
		let values;
		let modalContent;

		switch (step) {
			case 1:
				values = {
					name: { ...this.state.controls.name },
					email: { ...this.state.controls.email },
					dateOfBirth: { ...this.state.controls.dateOfBirth },
				};
				modalContent = (
					<UserDetails
						values={values}
						nextStepHandler={this.nextStepHandler}
						onChangeHandler={this.onChangeHandler}
					/>
				);
				break;
			case 2:
				values = {
					trackingConfirmation: { ...this.state.controls.trackingConfirmation },
				};
				modalContent = (
					<UserConfirmations
						nextStepHandler={this.nextStepHandler}
						prevStepHandler={this.prevStepHandler}
						onChangeHandler={this.onChangeHandler}
						values={values}
					/>
				);
				break;
			case 3:
				values = {
					name: { ...this.state.controls.name },
					email: { ...this.state.controls.email },
					dateOfBirth: { ...this.state.controls.dateOfBirth },
				};
				modalContent = (
					<UserDetailsSummary
						prevStepHandler={this.prevStepHandler}
						onChangeHandler={this.onChangeHandler}
						nextStepHandler={this.nextStepHandler}
						jumpToStep={this.jumpToStep}
						values={values}
					/>
				);
				break;
			case 4:
				values = {
					username: { ...this.state.controls.username },
					password: { ...this.state.controls.password },
					confirmPassword: { ...this.state.controls.confirmPassword },
				};
				modalContent = (
					<UserPassword
						prevStepHandler={this.prevStepHandler}
						onChangeHandler={this.onChangeHandler}
						values={values}
						onSignUpHandler={this.onSignUpHandler}
						loading={this.props.loading}
					/>
				);
				break;
			default:
				modalContent = null;
		}

		const userRedirection = this.props.isAuthenticated ? (
			<Redirect to="/home" />
		) : null;

		return (
			<div className="SignUp">
				{userRedirection}
				<Backdrop>
					<Modal onModalClose={this.onModalCloseHandler}>{modalContent}</Modal>
				</Backdrop>
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
		onSignUpHandler: (userDetails) =>
			dispatch(actionCreators.userSignup(userDetails)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
