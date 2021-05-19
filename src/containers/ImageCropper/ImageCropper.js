import React, { Component } from 'react';
import Cropper from 'react-cropper';
import CloseIcon from '@material-ui/icons/Close';

import classes from './ImageCropper.module.css';
import Backdrop from '../../components/Backdrop/Backdrop';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import '../../../node_modules/cropperjs/dist/cropper.css';

class ImageCropper extends Component {
	onCropperInit = (cropper) => {
		this.cropper = cropper;
	};

	getCropData = () => {
		this.props.setCroppedImage(this.cropper.getCroppedCanvas().toDataURL());
	};

	render() {
		return (
			<div className={classes.ImageCropper}>
				<Backdrop zIndex={150}>
					<Modal
						height="auto"
						onModalClose={this.props.onCloseImageCropper}
						zIndex={150}
					>
						<div className={classes.ImageCropModal}>
							<div className={classes.ModalHeader}>
								<CloseIcon
									className={classes.CloseIcon}
									onClick={this.props.onCloseImageCropper}
								/>
								<h3>Crop Image</h3>
								<Button onClick={this.getCropData}>Crop</Button>
							</div>
							<div className={classes.ModalContent}>
								<Cropper
									src={this.props.imageSrc}
									style={{ height: 500, width: '100%', overflow: 'hidden' }}
									initialAspectRatio={21 / 9}
									background={true}
									autoCropArea={false}
									strict={false}
									guides={false}
									highlight={false}
									dragCrop={false}
									cropBoxMovable={true}
									cropBoxResizable={true}
									onInitialized={this.onCropperInit}
								/>
							</div>
						</div>
					</Modal>
				</Backdrop>
			</div>
		);
	}
}

export default ImageCropper;
