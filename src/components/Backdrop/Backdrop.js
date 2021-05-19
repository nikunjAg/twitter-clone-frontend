import React from 'react';

const Backdrop = (props) => {
	return (
		<div
			style={{
				position: 'fixed',
				left: 0,
				top: 0,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				background: props.background ? props.background : 'rgba(0, 0, 0, 0.26)',
				width: '100%',
				height: '100vh',
				zIndex: props.zIndex ? props.zIndex : '20',
				// pointerEvents: 'all',
			}}
		>
			{props.children}
		</div>
	);
};

export default Backdrop;
