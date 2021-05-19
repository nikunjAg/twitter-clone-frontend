import React, { useRef, useEffect } from 'react';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

import classes from './ImagePreview.module.css';

const ImagePreview = (props) => {
	const node = useRef();

	const handleClick = (e) => {
		e.stopPropagation();
		if (!node.current.contains(e.target)) props.closePreview();
	};

	const imagePreviewClicked = (event) => {
		event.stopPropagation();
		console.log('Image Preview has been clicked');
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClick, false);
		return () => {
			document.removeEventListener('mousedown', handleClick, false);
		};
	}, []);

	return (
		<div
			ref={node}
			className={classes.ImagePreview}
			onClick={imagePreviewClicked}
		>
			<CloseOutlinedIcon
				className={classes.CloseIcon}
				onClick={props.closePreview}
			/>
			<img src={`http://localhost:8080${props.src}`} alt="ImagePreview" />
		</div>
	);
};

export default ImagePreview;
