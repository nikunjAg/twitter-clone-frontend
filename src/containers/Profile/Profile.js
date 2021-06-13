import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';

import classes from './Profile.module.css';
import SideBar from '../SideBar/SideBar';
import * as actionCreator from '../../store/actions';
import FlashMessage from '../../components/FlashMessage/FlashMessage';
import Spinner from '../../components/Spinner/Spinner';
import Button from '../../components/Button/Button';
import { getDateString } from '../../utility/timeDifference';
import { convertToInternationalCurrencySystem } from '../../utility/numberFormatter';
import HorizontalTabs from '../../components/HorizantalTabs/HorizontalTabs';
import Post from '../Post/Post';
import ReplyPost from '../Post/ReplyPost';
import CompletePost from '../Post/CompletePost/CompletePost';
import Links from './Links/Links';
import EditProfile from './EditProfile/EditProfile';
import { appName } from '../../appName';

class Profile extends Component {
	state = {
		tabSelected: `${appName}s`,
		currentPosts: [],
		tweets: [],
		tweetsAndReplies: [],
		media: [],
		likes: [],
		showProfileEditModal: false,
	};

	componentDidMount() {
		this.myRef = React.createRef();
		if (this.props.match.params.username) {
			// load someones other profile
			this.props.getUserProfile(
				this.props.match.params.username,
				this.props.token
			);
		} else {
			// load current user profile
			this.props.getUserProfile(this.props.username, this.props.token);
		}
	}

	windowScrollToTop = (event) => {
		if (event) event.stopPropagation();
		if (this.myRef?.current)
			this.myRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	componentDidUpdate(prevProps, prevState) {
		// The username has changed
		if (this.props.match.params.username !== prevProps.match.params.username) {
			this.props.getUserProfile(
				this.props.match.params.username,
				this.props.token
			);
			return;
		}

		// 2 cases
		// 1. If the profile has changed
		// 2. If the current user has updated his pinned post
		if (
			(this.props.profile && this.props.profile !== prevProps.profile) ||
			(this.props.pinnedTweet !== prevProps.pinnedTweet &&
				this.props.profile?._id.toString() === this.props.userId)
		) {
			const tweets = this.props.profile.tweets
				.concat(
					...this.props.profile.quoteTweets,
					...this.props.profile.retweets.map((r) => ({
						...r,
						isRetweetPost: true,
					}))
				)
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

			const tweetsAndReplies = this.props.profile.tweets
				.concat(
					...this.props.profile.quoteTweets,
					...this.props.profile.comments
				)
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

			const media = this.props.profile.tweets
				.concat(
					...this.props.profile.quoteTweets,
					...this.props.profile.comments
				)
				.filter((t) => t.images.length)
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

			const likes = this.props.profile.likes
				.map((p) => ({
					...p,
					isLikePost: true,
				}))
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

			let pinnedTweetIdx = tweets.findIndex(
				(t) => t._id.toString() === this.props.pinnedTweet.toString()
			);
			if (pinnedTweetIdx !== -1) {
				const pinnedTweet = tweets.splice(pinnedTweetIdx, 1)[0];
				tweets.unshift(pinnedTweet);
			}

			pinnedTweetIdx = tweetsAndReplies.findIndex(
				(t) => t._id.toString() === this.props.pinnedTweet.toString()
			);
			if (pinnedTweetIdx !== -1) {
				const pinnedTweet = tweetsAndReplies.splice(pinnedTweetIdx, 1)[0];
				tweetsAndReplies.unshift(pinnedTweet);
			}

			pinnedTweetIdx = media.findIndex(
				(t) => t._id.toString() === this.props.pinnedTweet.toString()
			);
			if (pinnedTweetIdx !== -1) {
				const pinnedTweet = media.splice(pinnedTweetIdx, 1)[0];
				media.unshift(pinnedTweet);
			}

			pinnedTweetIdx = likes.findIndex(
				(t) => t._id.toString() === this.props.pinnedTweet.toString()
			);
			if (pinnedTweetIdx !== -1) {
				const pinnedTweet = likes.splice(pinnedTweetIdx, 1)[0];
				likes.unshift(pinnedTweet);
			}

			const tabSelected = prevState.tabSelected || `${appName}s`;

			let currentPosts = null;

			if (tabSelected === `${appName}s`) {
				currentPosts = tweets;
			} else if (tabSelected === `${appName}s & Replies`) {
				currentPosts = tweetsAndReplies;
			} else if (tabSelected === 'Media') {
				currentPosts = media;
			} else {
				currentPosts = likes;
			}

			this.setState({
				tabSelected,
				currentPosts,
				tweets,
				tweetsAndReplies,
				media,
				likes,
			});
		}
	}

	tabSwitchedHandler = (tabName, event) => {
		event.stopPropagation();
		if (this.state.tabSelected === tabName || !this.props.profile) return;
		let updatedPosts = null;
		switch (tabName) {
			case appName:
				updatedPosts = this.state.tweets;
				break;
			case `${appName}s & Replies`:
				updatedPosts = this.state.tweetsAndReplies;
				break;
			case 'Media':
				updatedPosts = this.state.media;
				break;
			case 'Likes':
				updatedPosts = this.state.likes;
				break;
			default:
				updatedPosts = this.state.tweets;
				break;
		}
		this.setState({ tabSelected: tabName, currentPosts: updatedPosts });
		const endPoint = tabName.toLowerCase().split(' ').join('');
		this.props.history.push(this.props.match.url + '/' + endPoint);
	};

	goBack = (event) => {
		event.stopPropagation();
		this.props.history.goBack();
	};

	onEditBtnClickedHandler = () => {
		console.log('Clicked Edit Button');
		this.setState({ showProfileEditModal: true });
	};

	closeProfileEditModalHandler = () => {
		this.setState({ showProfileEditModal: false });
	};

	onFollowUnfollowUserHandler = () => {
		console.log('Follow/Unfollow Button Clicked');
		this.props.toggleFollowUserHandler(
			this.props.profile._id,
			this.props.token
		);
	};

	updateUserHandler = (
		name,
		shortBio,
		location,
		dateOfBirth,
		coverImage,
		profileImage
	) => {
		this.props.updateUser(
			name,
			shortBio,
			location,
			dateOfBirth,
			coverImage,
			profileImage,
			this.props.token
		);

		// Now after this maybe we need to add a spinner
		// And also dismiss the EditProfile modal
		this.closeProfileEditModalHandler();
	};

	render() {
		let errorMessage = null;
		if (this.props.error) {
			errorMessage = <FlashMessage message={this.props.error.message} />;
		}

		let spinner = null;
		let tabsPosts = null;
		let userProfileInfo = null;
		let invalidProfile = null;
		let profileEditModal = null;

		if (this.props.loading) spinner = <Spinner />;

		if (this.props.invalidProfile)
			invalidProfile = (
				<div className={classes.InvalidProfile}>
					<h3>This account doesn't exists</h3>
					<p>Try searching for another</p>
				</div>
			);

		if (this.props.profile) {
			if (
				this.state.showProfileEditModal &&
				this.props.profile._id === this.props.userId
			) {
				profileEditModal = (
					<EditProfile
						profile={this.props.profile}
						userId={this.props.userId}
						closeEditProfileModal={this.closeProfileEditModalHandler}
						onUpdateUser={this.updateUserHandler}
					/>
				);
			}

			userProfileInfo = (
				<React.Fragment>
					<div className={classes.ProfileActions}>
						<div className={classes.ProfileImage}>
							<img
								src={`http://localhost:8080${
									this.props.profile.profileImage !== ''
										? this.props.profile.profileImage
										: '/images/defaultProfilePic.png'
								}`}
								alt="Profile Pic"
							/>
							<div className={classes.Overlay}></div>
						</div>
						<div className={classes.Actions}>
							<div className={classes.IconOutline}>
								<MoreHorizIcon className={classes.Icon} />
							</div>
							<div className={classes.IconOutline}>
								<MailOutlineOutlinedIcon className={classes.Icon} />
							</div>
							<div className={classes.IconOutline}>
								<NotificationsOutlinedIcon className={classes.Icon} />
							</div>
							<Button
								onClick={
									this.props.profile.username === this.props.username
										? this.onEditBtnClickedHandler
										: this.onFollowUnfollowUserHandler
								}
								sty="Outline"
							>
								{this.props.profile.username === this.props.username
									? 'Edit Profile'
									: this.props.following.includes(this.props.profile._id)
									? 'Unfollow'
									: 'Follow'}
							</Button>
						</div>
					</div>

					<div className={classes.ProfileUserDetails}>
						<div className="row">
							<div className={classes.DisplayName}>
								{this.props.profile.name}
							</div>
							<VerifiedUserIcon className={classes.VerifiedIcon} />
						</div>
						<div className={classes.Username}>
							{this.props.profile.username}
						</div>
						<div className={classes.ShortBio}>
							{this.props.profile.shortBio || 'Short Bio'}
						</div>
						<div className={classes.ExtraDetails}>
							{this.props.profile.location ? (
								<div className={classes.Detail}>
									<LocationOnOutlinedIcon className={classes.ExtraIcon} />
									<span>{this.props.profile.location}</span>
								</div>
							) : null}
							{this.props.profile.dateOfBirth ? (
								<div className={classes.Detail}>
									<EventOutlinedIcon className={classes.ExtraIcon} />
									<span>
										{'Borned ' + getDateString(this.props.profile.dateOfBirth)}
									</span>
								</div>
							) : null}
							{this.props.profile.createdAt ? (
								<div className={classes.Detail}>
									<DateRangeOutlinedIcon className={classes.ExtraIcon} />
									<span>
										{'Joined ' + getDateString(this.props.profile.createdAt)}
									</span>
								</div>
							) : null}
						</div>
						<div className={'row mt-5'}>
							<div className={'row mr-1'}>
								<Link
									className={classes.UsersLabels}
									to={`${this.props.match.url}/following`}
								>
									<span>{this.props.profile.following?.length || 0}</span>
									<span>Following</span>
								</Link>
							</div>
							<div className={'row'}>
								<Link
									className={classes.UsersLabels}
									to={`${this.props.match.url}/followers`}
								>
									<span>{this.props.profile.followers?.length || 0}</span>
									<span>Followers</span>
								</Link>
							</div>
						</div>
						<div className={classes.CommonFollowers}></div>
					</div>
				</React.Fragment>
			);

			tabsPosts = this.state.currentPosts.map((post) => {
				// isRetweetPost is a property created temporarily
				// it means that as a post can be a reply post but for the current user it is a retweet post as the user has retweeted it
				// isRetweetPost and isLikePost are some properties we have added to posts
				// This helps in profile sections as if we have retweeted or liked on a post which is a reply post then as we have not populated the replyTo property for liked or retweet posts as they are not necessary so, these added property helps in avoiding the if condition going to ReplyPost Component
				return !post.replyTo || post.isRetweetPost || post.isLikePost ? (
					// Normal Post or Retweet Post
					<Post
						key={post._id}
						post={post}
						isVerified
						style={{ noBorderLeft: true, noBorderRight: true }}
						isProfilePagePost={
							this.props.profile._id.toString() === post.postedBy._id.toString()
						}
					/>
				) : (
					// Reply Post
					<ReplyPost
						key={post._id + post.replyTo?._id}
						isVerified
						post={post}
						style={{ noBorderLeft: true, noBorderRight: true }}
						isProfilePagePost={
							this.props.profile._id.toString() === post.postedBy._id.toString()
						}
					/>
				);
			});
		}

		return (
			<div className={classes.Profile}>
				{errorMessage}
				{profileEditModal}
				<div className="SidebarWrapper" style={{ zIndex: 17 }}>
					<SideBar scrollHandler={this.windowScrollToTop} />
				</div>
				<div className={classes.MainProfile} ref={this.myRef}>
					<div className={classes.ProfileHeader}>
						<KeyboardBackspaceIcon
							className={classes.BackIcon}
							onClick={this.goBack}
						/>
						<div
							className="col"
							style={{ cursor: 'pointer' }}
							onClick={this.windowScrollToTop}
						>
							<div className="row">
								{this.props.profile ? (
									<React.Fragment>
										<h3>{this.props.profile.name}</h3>
										<VerifiedUserIcon className={classes.VerifiedIcon} />
									</React.Fragment>
								) : (
									<h3>Profile</h3>
								)}
							</div>
							<p>
								{this.props.profile
									? convertToInternationalCurrencySystem(
											this.props.profile.tweets.length +
												this.props.profile.quoteTweets.length +
												this.props.profile.comments.length
									  )
									: 0}
								{` ${appName}`}
							</p>
						</div>
					</div>
					<div className={classes.ProfileDetails}>
						<div className={classes.ProfileBanner}>
							<img
								src={`http://localhost:8080${
									this.props.profile && this.props.profile.coverImage !== ''
										? this.props.profile.coverImage
										: '/images/defaultProfilePic.png'
								}`}
								alt="Profile Banner"
							/>
						</div>
						<div className={classes.ProfileInfo}>{userProfileInfo}</div>
					</div>
					<div className={classes.PostsTabs}>
						{this.props.profile ? (
							<HorizontalTabs
								tabs={[
									{ name: `${appName}s` },
									{ name: `${appName}s & Replies` },
									{ name: 'Media' },
									{ name: 'Likes' },
								]}
								selected={this.state.tabSelected}
								onTabSelected={this.tabSwitchedHandler}
							/>
						) : null}
						{invalidProfile}
						{spinner}
						{tabsPosts}
					</div>
				</div>
				<div className="Recommendations"></div>
				<Switch>
					<Route
						path={this.props.match.path + '/post/:postId'}
						component={CompletePost}
					/>
					<Route
						path={this.props.match.path + '/followers'}
						component={Links}
					/>
					<Route
						path={this.props.match.path + '/following'}
						component={Links}
					/>
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		name: state.auth.name,
		username: state.auth.username,
		userId: state.auth.userId,
		profileImage: state.auth.profileImage,
		token: state.auth.token,
		following: state.auth.following,
		pinnedTweet: state.auth.pinnedTweet,
		profile: state.profile.profile,
		invalidProfile: state.profile.invalidProfile,
		loading: state.profile.loading || state.auth.loading,
		error: state.profile.error,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getUserProfile: (username, token) =>
			dispatch(actionCreator.getUserProfile(username, token)),
		toggleFollowUserHandler: (userId, token) =>
			dispatch(actionCreator.toggleFollowUser(userId, token)),
		updateUser: (
			name,
			shortBio,
			location,
			dateOfBirth,
			coverImage,
			profileImage,
			token
		) =>
			dispatch(
				actionCreator.updateUser(
					name,
					shortBio,
					location,
					dateOfBirth,
					coverImage,
					profileImage,
					token
				)
			),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
