import React, { Component } from 'react';
import Picker from 'emoji-picker-react';

class EmojiPicker extends Component {
	componentDidMount() {
		document.addEventListener('mousedown', this.handleClick, false);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClick, false);
	}

	handleClick = (event) => {
		if (!this.node.contains(event.target)) {
			this.props.closeEmojiPicker();
		}
	};

	render() {
		return (
			<div className="EmojiPicker" ref={(node) => (this.node = node)}>
				<Picker onEmojiClick={this.props.handleEmojiClick} />
			</div>
		);
	}
}

export default EmojiPicker;
