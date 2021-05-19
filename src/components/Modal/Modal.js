import React, { Component } from 'react';

import './Modal.css';

class Modal extends Component {
	constructor(props) {
		super(props);
		this.node = React.createRef();
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.modalCloseHandler, false);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.modalCloseHandler, false);
	}

	modalClickedHandler = (event) => {
		event.stopPropagation();
		console.log('Modal clicked but nothing beneath');
	};

	modalCloseHandler = (event) => {
		event.stopPropagation();
		if (!this.node.current.contains(event.target)) this.props.onModalClose();
	};

	render() {
		return (
			<div
				ref={this.node}
				className={'Modal ' + (this.props.smallModal ? 'SmallModal' : '')}
				onClick={this.modalClickedHandler}
				style={{
					height: this.props.height ? this.props.height : '',
					width: this.props.width ? this.props.width : '',
					zIndex: this.props.zIndex ? this.props.zIndex : '',
				}}
			>
				{this.props.children}
			</div>
		);
	}
}

export default Modal;
