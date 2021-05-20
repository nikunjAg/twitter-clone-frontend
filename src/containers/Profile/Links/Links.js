import React, { Component } from 'react';
import { connect } from 'react-redux';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import classes from './Links.module.css';
import * as actionCreator from '../../../store/actions';
import SideBar from '../../SideBar/SideBar';
import HorizontalTabs from '../../../components/HorizantalTabs/HorizontalTabs';
import User from '../../../components/User/User';
import Spinner from '../../../components/Spinner/Spinner';

class Links extends Component {
	state = {
		tabSelected: null,
	};

	componentDidMount() {
		this.setState({
			tabSelected: this.props.match.url.split('/').slice(-1)[0],
		});
		// So that only once we fetch the followers and following from redux store
		// And can see the follow toggling
		this.profileFollowers = [];
		this.profileFollowing = [];

		// If we are coming directly from profile page
		// Then there will be no loading,
		// so no shouldcomponentUpdate will be called
		if (this.props.profile) {
			this.profileFollowers = this.props.profile.followers;
			this.profileFollowing = this.props.profile.following;
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		// We cannot do this initialization in componentDidMount as profile data may still have not been fetched
		// Doing this inside render will not trigger the re-render
		if (nextProps.loading !== this.props.loading && !nextProps.loading) {
			this.profileFollowers = nextProps.profile.followers;
			this.profileFollowing = nextProps.profile.following;
		}
		return true;
	}

	tabSwitchedHandler = (tabName, event) => {
		event.stopPropagation();
		this.props.history.push(
			`/profile/${this.props.match.params.username}/${tabName.toLowerCase()}`
		);
		this.setState({ tabSelected: tabName.toLowerCase() });
	};

	componentWillUnmount() {
		console.log('Unmount');
	}

	goBack = (event) => {
		event.stopPropagation();
		this.props.history.goBack();
	};

	render() {
		let spinner = null;
		let usersList = [];

		if (this.props.loading)
			spinner = (
				<div className="SpinnerWrapper">
					<Spinner />
				</div>
			);
		else if (this.props.profile) {
			if (this.state.tabSelected === 'following') {
				usersList = this.profileFollowing;
				if (usersList.length === 0) {
					usersList = (
						<div className={classes.NoFollowing}>
							<h3>You don’t have followed anyone yet.</h3>
							<p>When you follow someone, you’ll see them here</p>
						</div>
					);
				} else {
					usersList = usersList.map((u) => (
						<User
							key={u._id}
							user={u}
							currUserId={this.props.userId}
							followingList={this.props.following}
							profileUserId={this.props.profile._id}
							toggleFollow={this.props.toggleFollowUser.bind(
								null,
								u._id,
								this.props.token
							)}
						/>
					));
				}
			} else if (this.state.tabSelected === 'followers') {
				usersList = this.profileFollowers;
				if (usersList.length === 0) {
					usersList = (
						<div className={classes.NoFollower}>
							<h3>You don’t have any followers yet</h3>
							<p>When someone follows you, you’ll see them here</p>
						</div>
					);
				} else {
					usersList = usersList.map((u) => (
						<User
							key={u._id}
							user={u}
							currUserId={this.props.userId}
							followingList={this.props.following}
							profileUserId={this.props.profile._id}
							toggleFollow={this.props.toggleFollowUser.bind(
								null,
								u._id,
								this.props.token
							)}
						/>
					));
				}
			}
		}

		return (
			<div className={classes.Links}>
				<div className="SidebarWrapper" style={{ zIndex: 27 }}>
					<SideBar />
				</div>
				<div className={classes.MainLinks}>
					<div className={classes.LinksHeader}>
						<KeyboardBackspaceIcon
							className={classes.BackIcon}
							onClick={this.goBack}
						/>
						<div className="col">
							<div className="row">
								{this.props.profile ? (
									<React.Fragment>
										<h4>{this.props.profile.name}</h4>
										<VerifiedUserIcon className={classes.VerifiedIcon} />
									</React.Fragment>
								) : (
									<h3>Profile</h3>
								)}
							</div>
							<p>{this.props.profile?.username}</p>
						</div>
					</div>
					<div className={classes.HorizontalTabs}>
						<HorizontalTabs
							tabs={[{ name: 'Followers' }, { name: 'Following' }]}
							selected={this.state.tabSelected}
							onTabSelected={this.tabSwitchedHandler}
						/>
					</div>
					{spinner}
					{usersList}
				</div>
				<div className="Recommendations"></div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		token: state.auth.token,
		userId: state.auth.userId,
		username: state.auth.username,
		following: state.auth.following,
		loading: state.profile.loading || state.auth.loading,
		profile: state.profile.profile,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		toggleFollowUser: (userId, token) =>
			dispatch(actionCreator.toggleFollowUser(userId, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Links);
