import React, { Component } from 'react';

import classes from './Dropdown.module.css';

class Dropdown extends Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClick);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClick);
	}

	handleClick = (event) => {
		if (!this.myRef.current.contains(event.target)) {
			this.props.handleCloseDropdown();
		}
	};

	dropdownclickedHandler = (event) => {
		event.stopPropagation();
		console.log('Dropdown clicked');
	};

	render() {
		return (
			<React.Fragment>
				<div className={classes.Overlay}></div>
				<div
					className={classes.Dropdown}
					style={this.props.posStyle}
					ref={this.myRef}
					onClick={this.dropdownclickedHandler}
				>
					{this.props.items.map((item, idx) => (
						<div
							key={idx}
							className={classes.Item}
							onClick={this.props.onItemSelected.bind(null, item.type)}
						>
							{item.icon ? item.icon : null}
							<span>{item.value}</span>
						</div>
					))}
				</div>
			</React.Fragment>
		);
	}
}

export default Dropdown;
