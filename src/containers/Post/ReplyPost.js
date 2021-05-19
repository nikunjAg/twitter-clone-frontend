import React from 'react';
import { Link } from 'react-router-dom';
// import ModeCommentIcon from '@material-ui/icons/ModeComment';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';

import classes from './ReplyPost.module.css';
import { getBorderStyleWithProps } from '../../utility/styleWithProps';
import Post from './Post';

/**
 * PROPS MEANING
 * isProfilePagePost -> Here the meaning is this reply post component is getting used on profile page -> now we need to decide which post is pinned depending upon the profile is of the profile which is loaded
 */

const ReplyPost = (props) => {
	return (
		<div
			className={classes.ReplyPost}
			style={{ ...getBorderStyleWithProps(props) }}
		>
			<div className={classes.ReplyHeading}>
				<ModeCommentOutlinedIcon className={classes.Icon} />
				<p className={classes.ReplyAddOn}>
					<Link to={`/profile/${props.post.postedBy.name}`}>
						{props.post.postedBy.name}
					</Link>
					<span> Replied</span>
				</p>
			</div>
			<Post
				post={props.post.replyTo}
				isVerified
				currentUser={props.currentUser}
				hasReply
				style={{ noBorder: true }}
			/>
			<Post
				post={props.post}
				isVerified
				currentUser={props.currentUser}
				isReply
				style={{ noBorder: true }}
				isProfilePagePost={props.isProfilePagePost}
			/>
		</div>
	);
};

export default ReplyPost;
