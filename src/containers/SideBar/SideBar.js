import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import HomeIcon from '@material-ui/icons/Home';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import classes from './SideBar.module.css';
import Navigation from '../../components/Navigation/Navigation';
import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import * as actionCreator from '../../store/actions';
import Logo from '../../Logo';
import { appName } from '../../appName';
import { serverBaseURL } from '../../axios';

const moreDropdownItems = [
	{
		value: 'Logout',
		icon: <PowerSettingsNewIcon />,
		type: 'logout',
	},
];

class SideBar extends Component {
	state = {
		openMoreDropdown: false,
		for: '',
	};

	onItemTypeSelected = (type) => {
		console.log(type);
		this.props.logout();
	};

	openMoreDropdownHandler = (forWhom, event) => {
		event.stopPropagation();
		this.setState({ openMoreDropdown: true, for: forWhom });
	};

	closeMoreDropdown = () => {
		this.setState({ openMoreDropdown: false, for: '' });
	};

	render() {
		let moreDropdown = null;

		moreDropdown = (
			<Dropdown
				posStyle={{ top: '0%', left: '100%', transform: 'translateY(-50%)' }}
				items={moreDropdownItems}
				onItemSelected={this.onItemTypeSelected}
				handleCloseDropdown={this.closeMoreDropdown}
			/>
		);

		return (
			<div className={classes.SideBar}>
				<Link to="/home">
					<Logo size={54} className={classes.Logo} />
				</Link>
				<Navigation
					username={this.props.username}
					scrollHandler={this.props.scrollHandler}
					addOn={this.props.addOn}
				/>
				<Button type="button" btnBlock width={100} fontSize={1}>
					<Logo className="" size={22} color="#fff" />
					<p>{appName}</p>
				</Button>
				<div
					className={classes.Profile}
					onClick={this.openMoreDropdownHandler.bind(null, 'forProfile')}
				>
					{/* <Link to={`/profile/${this.props.username}`}> */}
					<Avatar
						className={classes.ProfileIcon}
						src={`${serverBaseURL}${
							this.props.profileImage !== ''
								? this.props.profileImage
								: '/images/defaultProfilePic.png'
						}`}
						alt="Profile Pic"
					/>
					{/* </Link> */}
					<div className={classes.User}>
						<p className={classes.Name}>{this.props.name}</p>
						<p className={classes.UserName}>{this.props.username}</p>
					</div>
					<MoreHorizIcon className={classes.ProfileMore} />
					{this.state.for === 'forProfile' ? moreDropdown : null}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		username: state.auth.username,
		name: state.auth.name,
		profileImage: state.auth.profileImage,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => dispatch(actionCreator.logout()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
