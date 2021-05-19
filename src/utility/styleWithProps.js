export const getBorderStyleWithProps = (props) => {
	return {
		borderLeft: props.style?.noBorderLeft ? 'none' : 'auto',
		borderRight: props.style?.noBorderRight ? 'none' : 'auto',
		borderTop: props.style?.noBorderTop ? 'none' : 'auto',
		borderBottom: props.style?.noBorderBottom ? 'none' : 'auto',
		border: props.style?.noBorder ? 'none' : 'auto',
	};
};
