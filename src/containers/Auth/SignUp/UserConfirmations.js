import React from 'react';
import { Link } from 'react-router-dom';
import TwitterIcon from '@material-ui/icons/Twitter';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import './SignUp.css';
import Button from '../../../components/Button/Button';

const UserConfirmations = (props) => {
	return (
		<div className="UserConfirmations">
			<div className="ModalHeader">
				<KeyboardBackspaceIcon
					className="Icon BackIcon"
					onClick={props.prevStepHandler}
				/>
				<TwitterIcon className="Icon" />
				<Button onClick={props.nextStepHandler}>Next</Button>
			</div>
			<div className="ModalContent">
				<h2>Customize your experience</h2>

				<h3>Track where you see Twitter content across the web</h3>
				<div className="TrackingCheckBox">
					<label htmlFor="userConfirm">
						Twitter uses this data to personalise your experience. This web
						browsing history will never be stored with your name, email, or
						phone number.
					</label>
					<input
						type="checkbox"
						id="userConfirm"
						checked={props.values.trackingConfirmation.value}
						onChange={props.onChangeHandler.bind(null, 'trackingConfirmation')}
					/>
				</div>
				<p className="MoreDetails">
					For more details about these settings, visit the{' '}
					<Link to="#">Help Center</Link>.
				</p>
			</div>
		</div>
	);
};

export default UserConfirmations;
