import React, { Component } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';

import classes from './EditProfile.module.css';
import Backdrop from '../../../components/Backdrop/Backdrop';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import Input from '../../../components/Input/Input';
import ImageCropper from '../../ImageCropper/ImageCropper';
import { dataURItoBlob } from '../../../utility/imageUpload';
import { serverBaseURL } from '../../../axios';

class EditProfile extends Component {
	state = {
		controls: {
			name: {
				elementType: 'Input',
				elementConfig: {
					type: 'text',
					placeholder: 'Name',
					name: 'name',
				},
				validation: {
					isRequired: true,
					minLength: 3,
				},
				value: this.props.profile.name,
				touched: false,
				valid: true,
				errorMessage: 'Please enter a valid name',
				label: 'Name',
			},
			shortBio: {
				elementType: 'Input',
				elementConfig: {
					type: 'text',
					placeholder: 'Short Bio',
					name: 'shortBio',
				},
				validation: {},
				value: this.props.profile.shortBio,
				touched: false,
				valid: true,
				label: 'Short Bio',
			},
			location: {
				elementType: 'Input',
				elementConfig: {
					type: 'text',
					placeholder: 'Location',
					name: 'location',
				},
				validation: {
					minLength: 3,
				},
				value: this.props.profile.location,
				touched: false,
				valid: true,
				errorMessage: 'Please enter a valid location',
				label: 'Location',
			},
			dateOfBirth: {
				elementType: 'Input',
				elementConfig: {
					type: 'date',
					placeholder: 'Date Of Birth',
					name: 'dateOfBirth',
				},
				validation: {
					isRequired: true,
				},
				value: new Date(this.props.profile.dateOfBirth)
					.toISOString()
					.substr(0, 10),
				touched: false,
				valid: true,
				errorMessage: 'Please enter valid Date Of Birth',
				label: 'Date Of Birth',
			},
		},
		coverImage: null,
		profileImage: null,
		openImageCropper: false,
		selectedImageDataUrl: '',
		cropperFor: '',
	};

	checkValidity = (rules, value) => {
		if (!rules) return true;
		let isValid = true;
		let updatedValue = value.trim();

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

	onInputChangeHandler = (keyName, event) => {
		const updatedValue = event.target.value;
		console.log(updatedValue);
		const updatedControls = { ...this.state.controls };
		const updatedControl = { ...this.state.controls[keyName] };
		if (keyName === 'dateOfBirth')
			updatedControl.value = new Date(updatedValue).toISOString().substr(0, 10);
		else updatedControl.value = updatedValue;
		updatedControl.touched = true;
		updatedControl.valid = this.checkValidity(
			updatedControl.validation,
			updatedValue
		);

		updatedControls[keyName] = updatedControl;

		this.setState({ controls: updatedControls });
	};

	onImageChangeHandler = (keyName, event) => {
		const eventTarget = event.target;

		if (eventTarget?.files?.length) {
			const reader = new FileReader();
			reader.onload = () => {
				this.setState({
					openImageCropper: true,
					selectedImageDataUrl: reader.result,
					cropperFor: keyName,
				});
			};
			reader.readAsDataURL(eventTarget.files[0]);
		}
	};

	closeImageCropperHandler = () => {
		this.setState({
			openImageCropper: false,
			selectedImageDataUrl: null,
			cropperFor: '',
		});
	};

	/* setCroppedImage = (croppedImageblob) => {
		const imageCroppedFor = this.state.cropperFor;
		this.setState({ [imageCroppedFor]: croppedImageblob });
		this.closeImageCropperHandler();
	}; */
	setCroppedImage = (dataURI) => {
		const blobData = dataURItoBlob(dataURI);
		const imageCroppedFor = this.state.cropperFor;

		this.setState({ [imageCroppedFor]: blobData });
		this.closeImageCropperHandler();
	};

	onUpdateUserDetailsHandler = (event) => {
		event.preventDefault();
		this.props.onUpdateUser(
			this.state.controls.name.value,
			this.state.controls.shortBio.value,
			this.state.controls.location.value,
			this.state.controls.dateOfBirth.value,
			this.state.coverImage,
			this.state.profileImage
		);
	};

	render() {
		const inputElements = Object.keys(this.state.controls).map((keyName) => (
			<Input
				key={keyName}
				elementConfig={{
					...this.state.controls[keyName].elementConfig,
					value: this.state.controls[keyName].value,
				}}
				elementType={this.state.controls[keyName].elementType}
				valid={this.state.controls[keyName].valid}
				label={this.state.controls[keyName].label}
				errorMessage={this.state.controls[keyName].errorMessage}
				touched={this.state.controls[keyName].touched}
				onChange={this.onInputChangeHandler.bind(null, keyName)}
			/>
		));

		let imageCropper = null;

		if (this.state.openImageCropper) {
			imageCropper = (
				<ImageCropper
					imageSrc={this.state.selectedImageDataUrl}
					setCroppedImage={this.setCroppedImage}
					onCloseImageCropper={this.closeImageCropperHandler}
				/>
			);
		}

		return (
			<div className={classes.EditProfile}>
				<Backdrop>
					<Modal width="70%" onModalClose={this.props.closeEditProfileModal}>
						{imageCropper}
						<div className={classes.EditModal}>
							<div className={classes.EditModalHeader}>
								<CloseIcon
									onClick={this.props.closeEditProfileModal}
									className={classes.CloseIcon}
								/>
								<h3>Edit Profile</h3>
								<Button onClick={this.onUpdateUserDetailsHandler}>Save</Button>
							</div>
							<div className={classes.EditModalContent}>
								<div className={classes.ModalImages}>
									<div className={classes.EditModalCoverImage}>
										<div className={classes.CoverImageInput}>
											<img
												src={
													!this.state.coverImage
														? `${serverBaseURL}${
																this.props.profile.coverImage !== ''
																	? this.props.profile.coverImage
																	: '/images/defaultProfilePic.png'
														  }`
														: URL.createObjectURL(this.state.coverImage)
												}
												alt="CoverImage"
											/>
											<label htmlFor="coverImage">
												<CameraAltOutlinedIcon className={classes.CameraIcon} />
											</label>
											<input
												id="coverImage"
												type="file"
												onChange={this.onImageChangeHandler.bind(
													null,
													'coverImage'
												)}
												accept="image/png, image/jpg, image/jpeg"
											/>
										</div>
									</div>
									<div className={classes.EditModalProfileImage}>
										<div className={classes.ProfileImageInput}>
											<img
												src={
													!this.state.profileImage
														? `${serverBaseURL}${
																this.props.profile.profileImage !== ''
																	? this.props.profile.profileImage
																	: '/images/defaultProfilePic.png'
														  }`
														: URL.createObjectURL(this.state.profileImage)
												}
												alt="ProfileImage"
											/>
											<label htmlFor="profileImage">
												<CameraAltOutlinedIcon className={classes.CameraIcon} />
											</label>
											<input
												id="profileImage"
												type="file"
												onChange={this.onImageChangeHandler.bind(
													null,
													'profileImage'
												)}
												accept="image/png, image/jpg, image/jpeg"
											/>
										</div>
									</div>
								</div>
								<div className={classes.ModalInputs}>{inputElements}</div>
							</div>
						</div>
					</Modal>
				</Backdrop>
			</div>
		);
	}
}

export default EditProfile;
