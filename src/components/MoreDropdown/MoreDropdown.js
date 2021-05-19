import React, { Component } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import classes from './MoreDropdown.module.css';
import Dropdown from '../Dropdown/Dropdown';

class MoreDropdown extends Component {
	state = {
		openDropdown: false,
	};

	onMoreBtnClicked = (event) => {
		event.stopPropagation();
		this.setState({ openDropdown: true });
	};

	onCloseMoreDropdown = () => {
		this.setState({ openDropdown: false });
	};

	onDropdownItemSelected = (type, event) => {
		event.stopPropagation();
		this.onCloseMoreDropdown();
		this.props.onItemTypeSelected(type);
	};

	render() {
		return (
			<div className={classes.MoreDropdown} onClick={this.onMoreBtnClicked}>
				{this.props.hideIcon ? null : (
					<MoreHorizIcon className={classes.MoreIcon} />
				)}
				{this.state.openDropdown ? (
					<Dropdown
						posStyle={{ bottom: '0%', left: '50%' }}
						handleCloseDropdown={this.onCloseMoreDropdown}
						items={this.props.items}
						onItemSelected={this.onDropdownItemSelected}
					/>
				) : null}
			</div>
		);
	}
}

export default MoreDropdown;
