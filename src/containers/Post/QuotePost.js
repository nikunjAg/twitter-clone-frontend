import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import classes from './QuotePost.module.css';
import timeDifference from '../../utility/timeDifference';

const QuotePost = (props) => {
	let tweetUnavailable = false;
	if (!props.post || !props.post.content) {
		tweetUnavailable = true;
	}
	let tweetContent = (
		<p className={classes.TweetUnavailable}>This tweet is not available</p>
	);
	if (!tweetUnavailable) {
		tweetContent = (
			<React.Fragment>
				<div className={classes.UserDetails}>
					<Link to={`/profile/${props.post.postedBy.username}`}>
						<Avatar
							className={classes.Avatar}
							src={`http://localhost:8080${
								props.post.postedBy.profileImage !== ''
									? props.post.postedBy.profileImage
									: '/images/defaultProfilePic.png'
							}`}
							alt="Profile Pic"
						/>
					</Link>
					<p className={classes.DisplayName}>{props.post.postedBy.name}</p>
					{props.isVerified ? (
						<VerifiedUserIcon className={classes.Verified} />
					) : null}
					<p className={classes.UserName}>{props.post.postedBy.username}</p>
					<div className={classes.Seperator}>
						<span>·</span>
					</div>
					<p className={classes.PostedOn}>
						{timeDifference(new Date(), new Date(props.post.createdAt))}
					</p>
				</div>
				<div className={classes.PostData}>
					<div
						className={classes.Content}
						dangerouslySetInnerHTML={{ __html: props.post.content }}
					></div>
				</div>
			</React.Fragment>
		);
	}

	const onPostClickedHandler = (event) => {
		event.stopPropagation();
		if (!props.post || !props.post._id) return;
		// If we are alrady on Complete post page we should go back 2 levels
		const postUrl = props.match.path.includes('/post/:postId')
			? new URL(
					`${props.match.url}/../../post/${props.post._id}`,
					window.location.origin
			  ).pathname
			: props.match.url !== '/'
			? `${props.match.url}/post/${props.post._id}`
			: `/post/${props.post._id}`;

		props.history.push(postUrl);
	};

	return (
		<div className={classes.QuotePost} onClick={onPostClickedHandler}>
			{tweetContent}
		</div>
	);
};

export default withRouter(QuotePost);
