import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar/Avatar';

import classes from './User.module.css';
import Button from '../Button/Button';
import { serverBaseURL } from '../../axios';

// Here in props we should get the use basic information
// user prop -> user details which we want to display
// currUserId -> current logged in userId
// profileUserId -> user id of that person whose profile page we are viewing
// toggleFollow -> toggle the follow btn

const User = (props) => {
	// const iAmFollowing = props.user.followers.includes(props.currUserId);
	const iAmFollowing = props.followingList.includes(props.user._id);

	return (
		<div className={classes.User}>
			<Link
				to={`/profile/${props.user.username}`}
				className={classes.ProfileImage}
			>
				<Avatar
					src={`${serverBaseURL}${
						props.user && props.user.profileImage !== ''
							? props.user.profileImage
							: '/images/defaultProfilePic.png'
					}`}
				/>
			</Link>
			<div className={classes.UserData}>
				<Link
					to={`/profile/${props.user.username}`}
					className={classes.DisplayName}
				>
					{props.user.name}
				</Link>
				<div className={classes.Username}>{props.user.username}</div>
				<div className={classes.ShortBio}>{props.user.shortBio}</div>
			</div>
			{props.currUserId.toString() !== props.user._id.toString() ? (
				<Button
					fontSize={0.8}
					sty={!iAmFollowing ? 'Outline' : ''}
					onClick={props.toggleFollow}
				>
					{iAmFollowing ? 'Following' : 'Follow'}
				</Button>
			) : null}
		</div>
	);
};

export default User;
