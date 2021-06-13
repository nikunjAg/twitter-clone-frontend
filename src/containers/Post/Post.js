import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RepeatOutlinedIcon from '@material-ui/icons/RepeatOutlined';
import RoomIcon from '@material-ui/icons/Room';

import classes from './Post.module.css';
import PostFunctions from './PostFunctions/PostFunctions';
import timeDifference from '../../utility/timeDifference';
import { getBorderStyleWithProps } from '../../utility/styleWithProps';
import QuotePost from './QuotePost';
import PostInteraction from './PostInteraction/PostInteraction';
import ImagePreview from '../../components/ImagePreview/ImagePreview';
import Backdrop from '../../components/Backdrop/Backdrop';
import { appName } from '../../appName';

/**
 * PROPS MEANING
 * post -> post which this component represent
 * isVerified -> (temporary prop) means the user is verified
 * currentUser -> The user which is logged in currently
 * isModalPost -> Means the PostInteraction component will not work on clicks because this props signifies that this post is used inside a modal
 * hasReply -> For the sake of reply thread and paddings and means that this post has received a reply beaneath it, Attached class HasReply To Post
 * isReply -> For the sake of reply thread and paddings and means that this post is a reply and has a parentPost above it, Attached class IsReply To Post
 * isProfilePagePost -> means this post is present specifically on profile page (used to show pinned icon or more...)
 */

class Post extends Component {
	state = {
		showImagePreview: '',
	};

	stopEventPropagation = (event) => {
		event.stopPropagation();
	};

	onPostClicked = (event) => {
		event.stopPropagation();
		if (!this.props.post || !this.props.post._id) return;
		const postUrl = this.props.match.path.includes('/post/:postId')
			? new URL(
					`${this.props.match.url}/../../post/${this.props.post._id}`,
					window.location.origin
			  ).pathname
			: this.props.match.url !== '/'
			? `${this.props.match.url}/post/${this.props.post._id}`
			: `/post/${this.props.post._id}`;

		this.props.history.push(postUrl);
	};

	showImagePreviewHandler = (imageSrc, event) => {
		event.stopPropagation();
		this.setState({ showImagePreview: imageSrc });
	};

	closeImagePreviewHandler = () => {
		this.setState({ showImagePreview: '' });
	};

	render() {
		const { replyTo } = this.props.post;
		const currentPost = this.props.post;

		let quoteParentPost = null;
		let imagePreview = null;

		if (!this.props.post) {
			console.log(this.props.isModalPost);
		}

		if (currentPost.isQuotePost) {
			quoteParentPost = <QuotePost post={currentPost.quoteData} isVerified />;
		}

		if (this.state.showImagePreview !== '') {
			imagePreview = (
				<Backdrop background="rgba(0,0,0,0.65)">
					<ImagePreview
						src={this.state.showImagePreview}
						closePreview={this.closeImagePreviewHandler}
					/>
				</Backdrop>
			);
		}

		return (
			<div
				className={
					classes.Post +
					' ' +
					(this.props.hasReply ? classes.HasReply : '') +
					' ' +
					(this.props.isReply ? classes.IsReply : '')
				}
				style={{ ...getBorderStyleWithProps(this.props) }}
				onClick={this.onPostClicked}
			>
				{imagePreview}
				<div className={classes.PostLeft}>
					{/* Is this post is a reply to another post */}
					{/* So it shows a top thread */}
					<div className={classes.TopReplyThread}></div>

					{/* Pinned Tweet Icon */}
					{this.props.isProfilePagePost &&
					this.props.pinnedTweet?.toString() === currentPost._id.toString() ? (
						<RoomIcon className={classes.AddOn + ' ' + classes.PinnedTweet} />
					) : null}

					{/* Retweet or Like Icon */}
					{this.props.post.isQuotePost ? (
						<RepeatOutlinedIcon className={classes.AddOn} />
					) : this.props.post.likedBy ? (
						<FavoriteIcon className={classes.AddOn} />
					) : null}

					<Link
						onClick={this.stopEventPropagation}
						to={`/profile/${currentPost.postedBy.username}`}
					>
						<Avatar
							className={classes.Avatar}
							alt="Profile Pic"
							src={`http://localhost:8080${
								currentPost.postedBy.profileImage !== ''
									? currentPost.postedBy.profileImage
									: '/images/defaultProfilePic.png'
							}`}
						/>
					</Link>

					{/* If this post has a reply it shows a bottom reply thread */}
					<div className={classes.BottomReplyThread}></div>
				</div>

				<div className={classes.PostContent}>
					{/* Show the pinned tweet text */}
					{this.props.isProfilePagePost &&
					this.props.pinnedTweet?.toString() === currentPost._id.toString() ? (
						<p className={classes.AddOn + ' ' + classes.PinnedTweet}>
							Pinned Tweet
						</p>
					) : null}

					{/* Show the quote post or liked by text */}
					{this.props.post.isQuotePost || this.props.post.likedBy ? (
						<p className={classes.AddOn}>
							<Link
								onClick={this.stopEventPropagation}
								to={`/profile/${this.props.post.postedBy.username}`}
							>
								{this.props.post.postedBy.name}
							</Link>
							{this.props.post.isQuotePost
								? ` Re${appName.toLowerCase()}ed`
								: ' Liked'}
						</p>
					) : null}

					<div className={classes.UserDetails}>
						<Link
							to={`/profile/${this.props.post.postedBy.username}`}
							onClick={this.stopEventPropagation}
							className={classes.UserNameLinkRow}
						>
							<p className={classes.DisplayName}>{currentPost.postedBy.name}</p>
							{this.props.isVerified ? (
								<VerifiedUserIcon className={classes.Verified} />
							) : null}
							<p className={classes.UserName}>
								{currentPost.postedBy.username}
							</p>
						</Link>
						<div className={classes.Seperator}>
							<span>·</span>
						</div>
						<p className={classes.PostedOn}>
							{timeDifference(new Date(), new Date(currentPost.createdAt))}
						</p>
						<div className={classes.MoreIcon}>
							<PostFunctions
								posStyle={{ top: '50%', left: '0%' }}
								ownerPost={
									this.props.post.postedBy.username === this.props.username
								}
								post={this.props.post}
								token={this.props.token}
								pinnedTweet={this.props.pinnedTweet}
							/>
						</div>
					</div>
					{replyTo?.postedBy ? (
						<div className={classes.ReplyTo}>
							<Link to={`/posts/${replyTo._id}`}>
								Replying To {replyTo.postedBy.username}
							</Link>
						</div>
					) : null}
					<div className={classes.PostData}>
						<div
							className={classes.Content}
							dangerouslySetInnerHTML={{ __html: currentPost.content }}
						></div>
						{quoteParentPost}
					</div>

					{/* Post Images */}
					{currentPost.images?.length ? (
						<div className={classes.PostImages}>
							{currentPost.images.map((i, index) => (
								<div
									key={index}
									style={{
										height: currentPost.images.length < 3 ? '100%' : '50%',
										width:
											currentPost.images.length === 4 ||
											currentPost.images.length === 2
												? '50%'
												: currentPost.images.length === 1
												? '100%'
												: index !== 2
												? '50%'
												: '100%',
									}}
									className={classes.PostImageDiv}
									onClick={this.showImagePreviewHandler.bind(null, i)}
								>
									<img alt="Post Pic" src={`http://localhost:8080${i}`} />
								</div>
							))}
						</div>
					) : null}

					<PostInteraction
						post={currentPost}
						isModalPost={this.props.isModalPost}
						currentUser={this.props.currentUser}
						pinnedTweet={this.props.pinnedTweet}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		username: state.auth.username,
		token: state.auth.token,
		pinnedTweet: state.auth.pinnedTweet,
		currentUser: state.auth.userId,
	};
};

export default withRouter(connect(mapStateToProps)(Post));
